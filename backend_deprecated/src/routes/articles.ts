// src/routes/articles.ts
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/db.js";
import slugify from "../utils/slugify.js";

export const router = Router();

const ArticleInput = z.object({ // for type validation of articles using zod
  title: z.string().min(3),
  slug: z.string().min(3).optional(), // add slug as optional
  body: z.union([z.any(), z.string()]),    // TipTap JSON or HTML (Day 2 refine)
  coverUrl: z.url().optional(),
  tags: z.array(z.string()).default([]),   // tag slugs
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT")
});

const ArticleCreate = z.object({
  title: z.string().min(3),
  slug: z.string().min(3).optional(), // server can derive if not provided
  coverUrl: z.url().optional(),
  body: z.any(), // TipTap JSON
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  tags: z.array(z.string()).default([]), // tag slugs
});

const ArticleUpdate = ArticleInput.partial();

async function syncTags(articleId: string, tagSlugs: string[]) {
  // upsert tags and connect
  const tags = await Promise.all(
    tagSlugs.map(async (slug) => {
      const name = slug.replace(/-/g, " ");
      return prisma.tag.upsert({
        where: { slug },
        update: {},
        create: { slug, name },
      });
    })
  );
}
// --- routes ---

// GET /api/articles?status=PUBLISHED // list articles, optional status filter
router.get("/", async (req, res) => {
  const status = req.query.status as "DRAFT" | "PUBLISHED" | undefined;
  const where = status ? { status } : {};
  const posts = await prisma.article.findMany({
    where,
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      slug: true,
      coverUrl: true,
      status: true,
      createdAt: true,
      publishedAt: true,
      tags: { include: { tag: true } },
    },
  });
  res.json(posts);
});

// GET /api/articles/:slug // get article by slug
router.get("/:slug", async (req, res) => {
  const post = await prisma.article.findUnique({
    where: { slug: req.params.slug },
    include: { tags: { include: { tag: true } } },
  });
  if (!post) return res.status(404).json({ error: "Not found" });
  res.json(post);
});

// POST /api/articles // create new article
router.post("/", async (req, res) => {
  const parsed = ArticleCreate.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: z.treeifyError(parsed.error) });

  const { title, slug, body, coverUrl, status, tags } = parsed.data;
  const finalSlug = (slug || slugify(title)).slice(0, 120);

  const now = new Date();
  const post = await prisma.article.create({
    data: {
      title,
      slug: finalSlug,
      body,
      coverUrl,
      status,
      publishedAt: status === "PUBLISHED" ? now : null,
      author: {
        // replace with real auth later
        connectOrCreate: {
          where: { email: "admin@local" },
          create: { email: "admin@local", password: "TEMP", role: "ADMIN" },
        },
      },
    },
  });

  await syncTags(post.id, tags.map((s) => slugify(s)));
  const saved = await prisma.article.findUnique({
    where: { id: post.id },
    include: { tags: { include: { tag: true } } },
  });

  res.status(201).json(saved);
});

// PUT /api/articles/:id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const parsed = ArticleUpdate.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const data = parsed.data;
  if (data.title && !data.slug) data.slug = slugify(data.title);

  // handle publishedAt flip
  let publishedAt: Date | null | undefined = undefined;
  if (data.status === "PUBLISHED") publishedAt = new Date();
  if (data.status === "DRAFT") publishedAt = null;

  const updated = await prisma.article.update({
    where: { id },
    data: { ...data, publishedAt },
  });

  if (data.tags) await syncTags(id, data.tags.map((s) => slugify(s)));

  const saved = await prisma.article.findUnique({
    where: { id },
    include: { tags: { include: { tag: true } } },
  });

  res.json(saved);
});

// DELETE /api/articles/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.articleTag.deleteMany({ where: { articleId: id } });
  await prisma.image.deleteMany({ where: { articleId: id } });
  await prisma.article.delete({ where: { id } });
  res.status(204).send();
});

// quick admin seed helper (Day 1 only)
async function ensureAdmin() {
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (admin) return admin;
  return prisma.user.create({ data: { email: "admin@local", password: "TEMP", role: "ADMIN" } });
}
// src/routes/articles.ts
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/db.js";
import slugify from "../utils/slugify.js";

export const router = Router();

const ArticleInput = z.object({ // for type validation of articles using zod
  title: z.string().min(3),
  body: z.union([z.any(), z.string()]),    // TipTap JSON or HTML (Day 2 refine)
  coverUrl: z.url().optional(),
  tags: z.array(z.string()).default([]),   // tag slugs
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT")
});

router.get("/", async (req, res) => { // list all articles
  const posts = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, slug: true, coverUrl: true, createdAt: true, status: true }
  });
  res.json(posts);
});

router.get("/:slug", async (req, res) => { // grab article by slug
  const post = await prisma.article.findUnique({ where: { slug: req.params.slug } });
  if (!post) return res.status(404).json({ error: "Not found" });
  res.json(post);
});

router.post("/", async (req, res) => { // create new article
  const parsed = ArticleInput.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: z.treeifyError(parsed.error) });
  const { title, body, coverUrl, tags, status } = parsed.data;
  const slug = slugify(title);
  const post = await prisma.article.create({
    data: {
      title, slug, body, coverUrl, status,
      author: { connect: { id: (await ensureAdmin()).id } } // temp author for Day 1
    }
  });
  // TODO Day 2: upsert tags & connect
  res.status(201).json(post);
});

// quick admin seed helper (Day 1 only)
async function ensureAdmin() {
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (admin) return admin;
  return prisma.user.create({ data: { email: "admin@local", password: "TEMP", role: "ADMIN" } });
}
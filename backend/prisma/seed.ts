import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@local" },
    update: {},
    create: { email: "admin@local", password: "TEMP", role: "ADMIN" },
  });
  for (let i = 1; i <= 5; i++) {
    await prisma.article.create({
      data: {
        title: `Sample Article ${i}`,
        slug: `sample-article-${i}`,
        body: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Hello world" }]}]},
        authorId: admin.id,
        status: "DRAFT"
      }
    });
  }
}
main().finally(() => prisma.$disconnect());
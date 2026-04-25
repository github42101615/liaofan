import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.post.upsert({
    where: { slug: "building-a-quiet-digital-home" },
    update: {},
    create: {
      title: "Building a Quiet Digital Home",
      slug: "building-a-quiet-digital-home",
      excerpt: "How intentional typography, pacing, and writing can turn a personal site into a memorable space.",
      content: `A personal blog should feel like a room with taste, not a timeline fighting for attention.

When the interface gets quieter, the writing becomes more visible. That is why spacing, restraint, and contrast matter more than decorative noise.

The goal of this starter is simple: give you a publishing system that feels editorial, modern, and deeply personal from day one.`,
      featured: true,
      published: true,
      publishedAt: new Date("2026-04-10T08:00:00.000Z"),
      coverImage: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80"
    }
  });

  await prisma.post.upsert({
    where: { slug: "notes-on-modern-blog-architecture" },
    update: {},
    create: {
      title: "Notes on Modern Blog Architecture",
      slug: "notes-on-modern-blog-architecture",
      excerpt: "Why Next.js, Prisma, and PostgreSQL are a pragmatic stack for a deployable personal publishing system.",
      content: `The stack behind a blog should serve the writing, not dominate it.

Next.js gives us server rendering, routing, metadata, and API handlers in one place. Prisma makes the data layer approachable. PostgreSQL is dependable and easy to host.

That combination means fewer moving parts, cleaner deployment, and more time spent actually publishing.`,
      featured: false,
      published: true,
      publishedAt: new Date("2026-04-15T08:00:00.000Z"),
      coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80"
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

import { prisma } from "@/lib/prisma";

export async function getPublishedPosts() {
  return prisma.post.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }]
  });
}

export async function getFeaturedPost() {
  return prisma.post.findFirst({
    where: { published: true, featured: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }]
  });
}

export async function getPostBySlug(slug: string) {
  return prisma.post.findUnique({
    where: { slug }
  });
}

export function formatDate(date: Date | null) {
  if (!date) {
    return "Draft";
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}

export function splitContent(content: string) {
  return content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);
}

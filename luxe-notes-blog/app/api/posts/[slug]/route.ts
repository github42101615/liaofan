import { NextRequest, NextResponse } from "next/server";

import { isAdminAuthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { postInputSchema } from "@/lib/validators";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const isAdmin = isAdminAuthorized(request);

  const post = await prisma.post.findUnique({
    where: { slug }
  });

  if (!post || (!post.published && !isAdmin)) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await context.params;

  try {
    const json = await request.json();
    const payload = postInputSchema.parse(json);
    const current = await prisma.post.findUnique({ where: { slug } });

    if (!current) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const nextPublishedAt =
      payload.published && !current.published
        ? new Date()
        : payload.published
          ? current.publishedAt ?? new Date()
          : null;

    const updated = await prisma.post.update({
      where: { slug },
      data: {
        ...payload,
        coverImage: payload.coverImage || null,
        publishedAt: nextPublishedAt
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update post." },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await context.params;

  try {
    await prisma.post.delete({
      where: { slug }
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to delete post." }, { status: 400 });
  }
}

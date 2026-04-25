import { NextRequest, NextResponse } from "next/server";

import { isAdminAuthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { postInputSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  if (request.headers.has("x-admin-secret") && !isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = isAdminAuthorized(request);

  const posts = await prisma.post.findMany({
    where: isAdmin ? undefined : { published: true },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }]
  });

  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await request.json();
    const payload = postInputSchema.parse(json);

    const post = await prisma.post.create({
      data: {
        ...payload,
        coverImage: payload.coverImage || null,
        publishedAt: payload.published ? new Date() : null
      }
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create post." },
      { status: 400 }
    );
  }
}

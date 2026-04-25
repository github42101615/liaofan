import Link from "next/link";

import { formatDate } from "@/lib/posts";

type PostCardProps = {
  post: {
    title: string;
    slug: string;
    excerpt: string;
    coverImage: string | null;
    publishedAt: Date | null;
    featured: boolean;
  };
};

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="post-card">
      <div
        className="post-card-image"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(11, 15, 22, 0.08), rgba(11, 15, 22, 0.72)), url(${post.coverImage ?? ""})`
        }}
      />
      <div className="post-card-body">
        <div className="eyebrow-row">
          <span>{post.featured ? "Featured Essay" : "Journal Note"}</span>
          <span>{formatDate(post.publishedAt)}</span>
        </div>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <Link href={`/posts/${post.slug}`} className="inline-link">
          Read article
        </Link>
      </div>
    </article>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteShell } from "@/components/site-shell";
import { formatDate, getPostBySlug, splitContent } from "@/lib/posts";

type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: `${post.title} | Luxe Notes`,
    description: post.excerpt
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || !post.published) {
    notFound();
  }

  const paragraphs = splitContent(post.content);

  return (
    <SiteShell>
      <article className="article-shell">
        <div className="article-hero">
          <p className="eyebrow-row">
            <span>{post.featured ? "Featured Essay" : "Journal Entry"}</span>
            <span>{formatDate(post.publishedAt)}</span>
          </p>
          <h1>{post.title}</h1>
          <p className="article-excerpt">{post.excerpt}</p>
        </div>

        {post.coverImage ? (
          <div
            className="article-cover"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(10, 14, 20, 0.08), rgba(10, 14, 20, 0.65)), url(${post.coverImage})`
            }}
          />
        ) : null}

        <div className="article-body">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>
    </SiteShell>
  );
}

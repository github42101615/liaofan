import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { PostCard } from "@/components/post-card";
import { SiteShell } from "@/components/site-shell";
import { formatDate, getFeaturedPost, getPublishedPosts } from "@/lib/posts";

export const revalidate = 60;

export default async function HomePage() {
  const [featuredPost, posts] = await Promise.all([getFeaturedPost(), getPublishedPosts()]);
  const archivePosts = featuredPost ? posts.filter((post) => post.slug !== featuredPost.slug) : posts;

  return (
    <SiteShell>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <Sparkles size={16} />
            Personal publishing, elevated
          </p>
          <h1>A cinematic blog for essays, notes, and the work behind your ideas.</h1>
          <p className="hero-text">
            This full-stack setup blends a refined editorial front-end with a deployable content system, so your personal site feels bespoke instead of templated.
          </p>
          <div className="hero-actions">
            <Link href="#journal" className="primary-button">
              Explore journal
            </Link>
            <Link href="/admin" className="secondary-button">
              Open studio
            </Link>
          </div>
        </div>

        {featuredPost ? (
          <article className="featured-card">
            <div
              className="featured-media"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(8, 10, 14, 0.12), rgba(8, 10, 14, 0.78)), url(${featuredPost.coverImage ?? ""})`
              }}
            />
            <div className="featured-body">
              <p className="eyebrow-row">
                <span>Featured Essay</span>
                <span>{formatDate(featuredPost.publishedAt)}</span>
              </p>
              <h2>{featuredPost.title}</h2>
              <p>{featuredPost.excerpt}</p>
              <Link href={`/posts/${featuredPost.slug}`} className="inline-link">
                Read the feature <ArrowRight size={16} />
              </Link>
            </div>
          </article>
        ) : (
          <article className="featured-card featured-empty">
            <div className="featured-body">
              <p className="eyebrow-row">
                <span>Seed your first entry</span>
              </p>
              <h2>Your homepage is ready for a lead story.</h2>
              <p>Run the seed script or open the studio to create your first post. Once featured, it will appear here automatically.</p>
              <Link href="/admin" className="inline-link">
                Open the studio <ArrowRight size={16} />
              </Link>
            </div>
          </article>
        )}
      </section>

      <section className="stats-band">
        <div>
          <p className="stats-value">{posts.length.toString().padStart(2, "0")}</p>
          <p className="stats-label">Published pieces</p>
        </div>
        <div>
          <p className="stats-value">SSR</p>
          <p className="stats-label">Fast rendering and SEO-ready</p>
        </div>
        <div>
          <p className="stats-value">API</p>
          <p className="stats-label">CRUD endpoints with admin secret</p>
        </div>
      </section>

      <section className="section-heading" id="journal">
        <div>
          <p className="panel-kicker">Latest writing</p>
          <h2>Journal archive</h2>
        </div>
        <p className="muted-copy">A polished homepage, a detail page for long-form writing, and an admin studio for managing your content.</p>
      </section>

      <section className="post-grid">
        {archivePosts.length > 0 ? (
          archivePosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <article className="post-card empty-card">
            <div className="post-card-body">
              <div className="eyebrow-row">
                <span>Ready for launch</span>
              </div>
              <h3>No archive entries yet.</h3>
              <p>Create a few posts in the studio and this section will become your scrolling editorial grid.</p>
            </div>
          </article>
        )}
      </section>
    </SiteShell>
  );
}

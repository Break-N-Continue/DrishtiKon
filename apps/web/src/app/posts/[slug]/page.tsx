"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MarkdownRenderer from "@/components/posts/MarkdownRenderer";
import { getPostBySlug, type Post } from "@/lib/api";

interface PostDetailPageProps {
  params: { slug: string };
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;
    const loadPost = async () => {
      try {
        setLoading(true);
        const data = await getPostBySlug(params.slug);
        if (isActive) {
          setPost(data);
        }
      } catch (err: any) {
        if (isActive) {
          setError(err?.response?.data?.error || "Failed to load post");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadPost();
    return () => {
      isActive = false;
    };
  }, [params.slug]);

  const body = post?.content?.trim() || post?.description || "";

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/homePage" className="font-label text-xs uppercase tracking-widest text-secondary">
        Back to feed
      </Link>

      {loading && (
        <div className="text-center py-12 text-on-surface-variant font-body">
          Loading post...
        </div>
      )}

      {error && (
        <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl font-body text-sm mt-6">
          {error}
        </div>
      )}

      {post && !loading && (
        <article className="mt-10">
          <header className="mb-8">
            <h1 className="font-headline text-5xl font-bold text-on-surface leading-tight mb-4">
              {post.title}
            </h1>
            <p className="font-body text-on-surface-variant text-lg max-w-2xl">
              {post.description}
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-6 text-sm text-on-surface-variant">
              <span className="font-label tracking-widest uppercase text-secondary">
                {post.authorName}
              </span>
              <span className="text-outline-variant">•</span>
              <span>{formatDate(post.createdAt)}</span>
              {post.tags && post.tags.length > 0 && (
                <>
                  <span className="text-outline-variant">•</span>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-full text-xs font-semibold tracking-wide bg-surface-container text-on-surface-variant"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </header>

          {post.coverImageUrl && (
            <div className="mb-10">
              <img
                src={post.coverImageUrl}
                alt={post.title}
                className="w-full max-h-[420px] object-cover rounded-2xl border border-outline-variant/20"
                loading="lazy"
              />
            </div>
          )}

          <MarkdownRenderer content={body} />
        </article>
      )}
    </div>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

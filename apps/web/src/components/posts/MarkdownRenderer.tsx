"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeRaw from "rehype-raw";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <article className="prose prose-lg max-w-none prose-headings:scroll-mt-24">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          rehypeRaw,
          rehypeKatex,
          rehypeHighlight,
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
        ]}
        components={{
          pre: ({ children }) => <>{children}</>,
          code: CodeBlock,
          a: LinkRenderer,
          img: ImageRenderer,
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}

function LinkRenderer({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isExternal = !!href && /^https?:\/\//i.test(href);
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  );
}

function ImageRenderer({ src, alt, title }: React.ImgHTMLAttributes<HTMLImageElement>) {
  if (!src) return null;
  return (
    <figure className="my-6">
      <img src={src} alt={alt ?? ""} className="rounded-lg" />
      {title && (
        <figcaption className="text-center text-sm text-on-surface-variant mt-2">
          {title}
        </figcaption>
      )}
    </figure>
  );
}

function CodeBlock({ inline, className, children }: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) {
  const codeText = String(children).replace(/\n$/, "");
  const [copied, setCopied] = useState(false);
  const language = /language-([^\s]+)/.exec(className || "")?.[1];

  if (inline) {
    return (
      <code className={className}>
        {children}
      </code>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="relative group my-4">
      <button
        type="button"
        onClick={handleCopy}
        className="absolute right-3 top-3 text-xs font-label uppercase tracking-widest text-on-surface-variant bg-surface-container px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      {language && (
        <span className="absolute left-3 top-3 text-xs font-label uppercase tracking-widest text-on-surface-variant">
          {language}
        </span>
      )}
      <pre className="overflow-x-auto rounded-lg border border-outline-variant/20 bg-surface-container p-4">
        <code className={className}>
          {children}
        </code>
      </pre>
    </div>
  );
}

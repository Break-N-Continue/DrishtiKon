"use client";

import { useState } from "react";
import type { CreatePostData } from "@/lib/api";
import MarkdownRenderer from "@/components/posts/MarkdownRenderer";

interface CreatePostFormProps {
  onSubmit: (post: CreatePostData) => Promise<void>;
}

export default function CreatePostForm({ onSubmit }: CreatePostFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [isDraft, setIsDraft] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const normalizedTags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        content: content.trim() || description.trim(),
        tags: normalizedTags.length ? normalizedTags : undefined,
        coverImageUrl: coverImageUrl.trim() || undefined,
        isDraft,
      });
      setTitle("");
      setDescription("");
      setContent("");
      setTagsInput("");
      setCoverImageUrl("");
      setIsDraft(false);
      setIsOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-surface-container-lowest p-8 shadow-sm ring-1 ring-outline-variant/10 rounded-xl 
                   text-primary hover:shadow-md transition-all flex items-center gap-4 group composer-expand"
      >
        <span
          className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          edit_note
        </span>
        <span className="font-headline text-xl font-semibold italic text-primary">
          Contribute to the Archive
        </span>
      </button>
    );
  }

  return (
    <section className="bg-surface-container-lowest p-8 shadow-sm ring-1 ring-outline-variant/10 composer-expand rounded-xl">
      <div className="flex items-center gap-4 mb-6">
        <span
          className="material-symbols-outlined text-primary"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          edit_note
        </span>
        <h3 className="font-headline text-xl font-semibold italic text-primary">
          Contribute to the Archive
        </h3>
      </div>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="relative">
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title of Publication"
            minLength={5}
            maxLength={255}
            required
            className="w-full bg-transparent border-0 border-b border-outline-variant/40 focus:ring-0 focus:border-primary focus:none transition-all font-headline text-lg py-2 px-0 placeholder:text-outline/50"
          />
        </div>
        <div className="relative">
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short summary or excerpt for the feed..."
            minLength={10}
            rows={3}
            required
            className="w-full bg-transparent border-0 border-b border-outline-variant/40 focus:ring-0 focus:border-primary focus:outline-none transition-all font-body text-sm py-2 px-0 resize-none placeholder:text-outline/50"
          />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="relative">
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the full post in Markdown..."
              rows={12}
              className="w-full bg-transparent border border-outline-variant/40 focus:ring-0 focus:border-primary focus:outline-none transition-all font-body text-sm p-3 rounded-lg resize-none placeholder:text-outline/50"
            />
          </div>
          <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/20">
            <p className="font-label text-xs uppercase tracking-widest text-secondary mb-3">
              Live Preview
            </p>
            <MarkdownRenderer
              content={
                content.trim() || "_Start typing to preview your post..._"
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="relative">
            <input
              id="tags"
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Tags (comma separated)"
              className="w-full bg-transparent border-0 border-b border-outline-variant/40 focus:ring-0 focus:border-primary focus:outline-none transition-all font-body text-sm py-2 px-0 placeholder:text-outline/50"
            />
          </div>
          <div className="relative">
            <input
              id="coverImageUrl"
              type="url"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              placeholder="Cover image URL (optional)"
              className="w-full bg-transparent border-0 border-b border-outline-variant/40 focus:ring-0 focus:border-primary focus:outline-none transition-all font-body text-sm py-2 px-0 placeholder:text-outline/50"
            />
          </div>
          <label className="flex items-center gap-2 text-sm font-body text-on-surface-variant">
            <input
              type="checkbox"
              checked={isDraft}
              onChange={(e) => setIsDraft(e.target.checked)}
              className="rounded border-outline-variant"
            />
            Save as draft
          </label>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setTitle("");
              setDescription("");
              setContent("");
              setTagsInput("");
              setCoverImageUrl("");
              setIsDraft(false);
            }}
            className="px-6 py-2 rounded font-bold text-sm tracking-wide text-primary hover:bg-surface-container-high transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="bg-primary text-on-primary px-8 py-2 rounded font-bold text-sm tracking-wide shadow-sm hover:opacity-90 transition-opacity btn-hover-lift disabled:opacity-50"
          >
            {submitting ? "Publishing..." : "Publish"}
          </button>
        </div>
      </form>
    </section>
  );
}

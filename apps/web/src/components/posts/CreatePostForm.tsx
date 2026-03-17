"use client";

import { useState } from "react";

interface CreatePostFormProps {
  onSubmit: (title: string, description: string) => Promise<void>;
}

export default function CreatePostForm({ onSubmit }: CreatePostFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSubmitting(true);
    try {
      await onSubmit(title, description);
      setTitle("");
      setDescription("");
      setIsOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant/10 rounded-xl 
                   text-primary hover:shadow-md transition-all flex items-center gap-4 group"
      >
        <span
          className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          edit_note
        </span>
        <span className="font-headline text-lg font-semibold italic text-primary">
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
            className="w-full bg-transparent border-0 border-b border-outline-variant/40 focus:ring-0 focus:border-secondary transition-all font-headline text-lg py-2 px-0 placeholder:text-outline/50"
          />
        </div>
        <div className="relative">
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter content or abstract..."
            minLength={10}
            rows={3}
            required
            className="w-full bg-transparent border-0 border-b border-outline-variant/40 focus:ring-0 focus:border-secondary transition-all font-body text-sm py-2 px-0 resize-none placeholder:text-outline/50"
          />
        </div>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setTitle("");
              setDescription("");
            }}
            className="px-6 py-2 rounded font-bold text-sm tracking-wide text-secondary hover:text-on-surface transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="bg-gradient-to-br from-primary to-primary-container text-primary-foreground px-8 py-2 rounded font-bold text-sm tracking-wide shadow-sm hover:opacity-90 transition-opacity btn-hover-lift disabled:opacity-50"
          >
            {submitting ? "Publishing..." : "Publish"}
          </button>
        </div>
      </form>
    </section>
  );
}

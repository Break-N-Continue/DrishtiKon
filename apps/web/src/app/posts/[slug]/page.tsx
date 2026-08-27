// Server Component — generateStaticParams() is required for dynamic routes
// with output: 'export'. Since slugs are unknown at build time (fetched from
// the live API at runtime), we use force-static + a placeholder param so
// Next.js generates the shell page. The client component handles data loading.
import PostDetailClient from "./PostDetailClient";

// Tells Next.js to treat this as a static page even without pre-generated params.
export const dynamic = "force-static";

// Satisfies Next.js static-export requirement for dynamic routes.
// Returning a placeholder ensures the page shell is generated at build time.
// Actual slug data is fetched client-side at runtime via PostDetailClient.
export function generateStaticParams() {
  return [{ slug: "_" }];
}

interface PageProps {
  params: { slug: string };
}

export default function PostDetailPage({ params }: PageProps) {
  return <PostDetailClient slug={params.slug} />;
}

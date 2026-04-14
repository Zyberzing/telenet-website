import {
  getDynamicPageDetails,
  getDynamicPageIdFromSlug,
} from "@/services/dynamicPage";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type DynamicPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: DynamicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const pageId = getDynamicPageIdFromSlug(slug);
  const page = await getDynamicPageDetails(pageId);

  if (!page) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: page.pageName,
    description: `${page.pageName} details`,
  };
}

export default async function DynamicPageDetailsPage({ params }: DynamicPageProps) {
  const { slug } = await params;
  const pageId = getDynamicPageIdFromSlug(slug);
  const page = await getDynamicPageDetails(pageId);

  if (!page || page.status === "inactive" || page.isDeleted) {
    notFound();
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 md:px-10 lg:px-[6em]">
      <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
        {page.pageName}
      </h1>

      <div className="mt-8 space-y-6">
        {(page.sections || []).map((section) => (
          <article key={section._id} className="rounded-xl border p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-medium text-foreground">
              {section.title}
            </h2>
            <div
              className="mt-3 text-sm sm:text-base leading-relaxed text-muted-foreground whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: section.description || "" }}
            />
          </article>
        ))}
      </div>
    </section>
  );
}

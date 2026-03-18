import { Button } from "@/components/ui/Button";
import { getCmsBlogList } from "@/services/cms";
import { getLanguageIdByCode } from "@/services/language";
import { ArrowLeft, CalendarIcon, Clock } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const stripHtml = (value: string) =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

const formatDate = (value?: string) => {
  if (!value) return "Unknown date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const estimateReadTime = (value: string) => {
  const words = stripHtml(value).split(" ").filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
};

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const langId = await getLanguageIdByCode(locale);
  const idFromSlug = slug.includes("--") ? slug.split("--").pop() : slug;
  const blogs = (
    await getCmsBlogList({
      blogId: idFromSlug,
      lang: langId,
    })
  ).filter((item) => item.status !== "inactive" && !item.isDeleted);
  const blog =
    blogs.find((item) => item._id === idFromSlug) ||
    blogs.find((item) => `${slugify(item.title)}--${item._id}` === slug);

  if (!blog) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${blog.title} | Telenet Blog`,
    description: stripHtml(blog.description),
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug, locale } = await params;
  const langId = await getLanguageIdByCode(locale);
  const idFromSlug = slug.includes("--") ? slug.split("--").pop() : slug;
  const blogs = (
    await getCmsBlogList({
      blogId: idFromSlug,
      lang: langId,
    })
  ).filter((item) => item.status !== "inactive" && !item.isDeleted);
  const blog =
    blogs.find((item) => item._id === idFromSlug) ||
    blogs.find((item) => `${slugify(item.title)}--${item._id}` === slug);

  if (!blog) {
    notFound();
  }
  const post = {
    title: blog.title,
    content: blog.description,
    date: formatDate(blog.createdAt || blog.updatedAt),
    category: blog.category || "General",
    imageUrl: blog.image || "/banner-blog.svg",
    readTime: estimateReadTime(blog.description),
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <div className="relative h-[400px] w-full">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-12">
          <div className="max-w-3xl">
            <div className="flex items-center text-white/80 text-sm mb-4 space-x-4">
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                {post.category}
              </span>
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-1" />
                {post.date}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {post.readTime}
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Button
            asChild
            variant="ghost"
            className="mb-8 -ml-4 hover:bg-transparent hover:text-primary"
          >
            <Link href={`/${locale}/blog`} className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </div>
      </div>
    </div>
  );
}

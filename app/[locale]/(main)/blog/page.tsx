import { BlogCard } from "@/components/blog/BlogCard";
import { getCmsBlogList } from "@/services/cms";
import { getLanguageIdByCode } from "@/services/language";
import { getPageMetadata } from "@/services/seo";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getPageMetadata(locale, "blog");
}

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

const formatDate = (
  value: string | undefined,
  locale: string,
  t: (key: string) => string,
) => {
  if (!value) return t("unknownDate");
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return t("unknownDate");
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const estimateReadTime = (
  value: string,
  t: (key: string, values?: Record<string, string | number | Date>) => string,
) => {
  const words = stripHtml(value).split(" ").filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return t("minRead", { minutes });
};

const BlogPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Blog" });
  const langId = await getLanguageIdByCode(locale);
  const blogs = (await getCmsBlogList({ lang: langId })).filter(
    (item) => item.status !== "inactive" && !item.isDeleted,
  );
  const posts = blogs.map((blog) => ({
    id: blog._id,
    title: blog.title,
    description: stripHtml(blog.description),
    date: formatDate(blog.createdAt || blog.updatedAt, locale, t),
    category: blog.category || t("generalCategory"),
    imageUrl: blog.image || "/banner-blog.svg",
    readTime: estimateReadTime(blog.description, t),
    slug: `${slugify(blog.title)}--${blog._id}`,
  }));

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <div className="relative">
        <Image
          src="/banner-blog.svg"
          alt={t("bannerAlt")}
          width={1500}
          height={1000}
          className="w-full h-auto"
        />
      </div>

      {/* Blog Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;

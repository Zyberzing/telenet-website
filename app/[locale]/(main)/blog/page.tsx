import { BlogCard } from "@/components/blog/BlogCard";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Blog | Telenet",
  description: "Latest news, updates, and insights from Telenet.",
};

const BLOG_POSTS = [
  {
    id: "1",
    title: "The Future of 5G Connectivity",
    description:
      "Explore how 5G technology is revolutionizing the way we connect, work, and live. From faster speeds to lower latency, discover the benefits of the next generation of mobile networks.",
    date: "October 15, 2023",
    category: "Technology",
    imageUrl:
      "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=2070&auto=format&fit=crop",
    readTime: "5 min read",
    slug: "future-of-5g-connectivity",
  },
  {
    id: "2",
    title: "Top 10 Tips for Remote Work Success",
    description:
      "Working from home? Check out our top tips for staying productive, maintaining work-life balance, and making the most of your remote work setup.",
    date: "October 22, 2023",
    category: "Lifestyle",
    imageUrl:
      "https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?q=80&w=2070&auto=format&fit=crop", // Replaced with a working image
    readTime: "4 min read",
    slug: "top-10-tips-remote-work",
  },
  {
    id: "3",
    title: "Understanding Your Internet Speed",
    description:
      "Confused about Mbps and Gbps? We break down everything you need to know about internet speeds and how to choose the right plan for your needs.",
    date: "November 5, 2023",
    category: "Guides",
    imageUrl:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2070&auto=format&fit=crop",
    readTime: "6 min read",
    slug: "understanding-internet-speed",
  },
  {
    id: "4",
    title: "Cybersecurity Best Practices for 2024",
    description:
      "Stay safe online with our comprehensive guide to cybersecurity. Learn how to protect your personal information and avoid common online threats.",
    date: "November 12, 2023",
    category: "Security",
    imageUrl:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop",
    readTime: "7 min read",
    slug: "cybersecurity-best-practices-2024",
  },
  // {
  //   id: "5",
  //   title: "The Evolution of Smart Homes",
  //   description: "From smart speakers to automated lighting, smart home technology is becoming more accessible. Discover the latest trends and gadgets for your home.",
  //   date: "November 20, 2023",
  //   category: "Smart Home",
  //   imageUrl: "https://images.unsplash.com/photo-1581276879432-15a19d654956?q=80&w=2070&auto=format&fit=crop", // Replaced with a working image
  //   readTime: "5 min read",
  //   slug: "evolution-of-smart-homes",
  // },
  {
    id: "5",
    title: "How to Optimize Your Wi-Fi Signal",
    description:
      "Experiencing slow internet in certain rooms? Learn simple tricks to boost your Wi-Fi signal and ensure coverage throughout your entire home.",
    date: "December 1, 2023",
    category: "Tips & Tricks",
    imageUrl:
      "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?q=80&w=2070&auto=format&fit=crop",
    readTime: "3 min read",
    slug: "optimize-wifi-signal",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <div className="relative">
        <Image
          src="/banner-blog.svg"
          alt="banner"
          width={1500}
          height={1000}
          className="w-full h-auto"
        />
      </div>

      {/* Blog Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {BLOG_POSTS.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/Button";
import { CalendarIcon, Clock, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// Mock data - in a real app this would come from an API or CMS
const BLOG_POSTS = [
    {
        id: "1",
        title: "The Future of 5G Connectivity",
        description: "Explore how 5G technology is revolutionizing the way we connect, work, and live. From faster speeds to lower latency, discover the benefits of the next generation of mobile networks.",
        content: `
      <p>5G is not just about faster internet speeds on your smartphone. It represents a fundamental shift in how we connect to the world around us. With its low latency and high capacity, 5G is enabling a new wave of innovation across industries.</p>
      <h3>Revolutionizing Industries</h3>
      <p>From healthcare to manufacturing, 5G is powering remote surgeries, autonomous vehicles, and smart factories. The ability to transmit massive amounts of data in real-time is unlocking possibilities that were previously unimaginable.</p>
      <h3>Enhanced Mobile Broadband</h3>
      <p>For consumers, 5G means seamless streaming of 4K and 8K video, immersive VR and AR experiences, and lightning-fast downloads. It's about staying connected wherever you are, without buffering or lag.</p>
      <h3>The Road Ahead</h3>
      <p>As 5G networks continue to expand, we can expect even more transformative applications to emerge. The future of connectivity is here, and it's faster and more reliable than ever before.</p>
    `,
        date: "October 15, 2023",
        category: "Technology",
        imageUrl: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=2070&auto=format&fit=crop",
        readTime: "5 min read",
        slug: "future-of-5g-connectivity",
    },
    {
        id: "2",
        title: "Top 10 Tips for Remote Work Success",
        description: "Working from home? Check out our top tips for staying productive, maintaining work-life balance, and making the most of your remote work setup.",
        content: `
      <p>Remote work has become the new norm for many, but it comes with its own set of challenges. Here are our top tips to help you thrive in a home office environment.</p>
      <h3>1. Create a Dedicated Workspace</h3>
      <p>Set up a specific area in your home for work. This helps mentally separate your professional life from your personal life.</p>
      <h3>2. Stick to a Schedule</h3>
      <p>Maintain regular working hours to ensure you stay productive and avoid burnout.</p>
      <h3>3. Take Regular Breaks</h3>
      <p>Step away from your screen every hour to stretch and rest your eyes.</p>
      <h3>4. Stay Connected</h3>
      <p>Use communication tools to stay in touch with your team and avoid feelings of isolation.</p>
    `,
        date: "October 22, 2023",
        category: "Lifestyle",
        imageUrl: "https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?q=80&w=2070&auto=format&fit=crop",
        readTime: "4 min read",
        slug: "top-10-tips-remote-work",
    },
    {
        id: "3",
        title: "Understanding Your Internet Speed",
        description: "Confused about Mbps and Gbps? We break down everything you need to know about internet speeds and how to choose the right plan for your needs.",
        content: `
      <p>When shopping for an internet plan, you'll see a lot of numbers thrown around. But what do they actually mean?</p>
      <h3>Mbps vs. Gbps</h3>
      <p>Mbps stands for Megabits per second, while Gbps stands for Gigabits per second. 1 Gbps is equal to 1000 Mbps.</p>
      <h3>Upload vs. Download Speed</h3>
      <p>Download speed determines how fast you can pull data from the internet (e.g., streaming video), while upload speed determines how fast you can send data (e.g., video conferencing).</p>
      <h3>Choosing the Right Plan</h3>
      <p>Consider your household's usage. If you have multiple devices streaming 4K video simultaneously, you'll need a higher speed plan than a single user who mainly checks email.</p>
    `,
        date: "November 5, 2023",
        category: "Guides",
        imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2070&auto=format&fit=crop",
        readTime: "6 min read",
        slug: "understanding-internet-speed",
    },
    {
        id: "4",
        title: "Cybersecurity Best Practices for 2024",
        description: "Stay safe online with our comprehensive guide to cybersecurity. Learn how to protect your personal information and avoid common online threats.",
        content: `
      <p>In an increasingly digital world, cybersecurity is more important than ever. Here's how to stay safe.</p>
      <h3>Use Strong Passwords</h3>
      <p>Create unique, complex passwords for each of your accounts and use a password manager to keep track of them.</p>
      <h3>Enable Two-Factor Authentication (2FA)</h3>
      <p>Add an extra layer of security to your accounts by requiring a second form of verification.</p>
      <h3>Beware of Phishing Scams</h3>
      <p>Be cautious of unsolicited emails or messages asking for personal information.</p>
      <h3>Keep Software Updated</h3>
      <p>Regularly update your operating system and applications to patch security vulnerabilities.</p>
    `,
        date: "November 12, 2023",
        category: "Security",
        imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop",
        readTime: "7 min read",
        slug: "cybersecurity-best-practices-2024",
    },
    // {
    //     id: "5",
    //     title: "The Evolution of Smart Homes",
    //     description: "From smart speakers to automated lighting, smart home technology is becoming more accessible. Discover the latest trends and gadgets for your home.",
    //     content: `
    //   <p>Smart homes are no longer a thing of the future. They are here, and they are making our lives easier and more efficient.</p>
    //   <h3>Voice Control</h3>
    //   <p>Control your lights, thermostat, and music with simple voice commands.</p>
    //   <h3>Energy Efficiency</h3>
    //   <p>Smart thermostats and lighting systems can help you save energy and reduce your utility bills.</p>
    //   <h3>Enhanced Security</h3>
    //   <p>Smart cameras and doorbells allow you to monitor your home from anywhere in the world.</p>
    // `,
    //     date: "November 20, 2023",
    //     category: "Smart Home",
    //     imageUrl: "https://images.unsplash.com/photo-1558002038-1091a166111c?q=80&w=2070&auto=format&fit=crop",
    //     readTime: "5 min read",
    //     slug: "evolution-of-smart-homes",
    // },
    {
        id: "5",
        title: "How to Optimize Your Wi-Fi Signal",
        description: "Experiencing slow internet in certain rooms? Learn simple tricks to boost your Wi-Fi signal and ensure coverage throughout your entire home.",
        content: `
      <p>Dead zones and slow speeds can be frustrating. Here's how to get the most out of your Wi-Fi.</p>
      <h3>Router Placement</h3>
      <p>Place your router in a central location, away from obstructions and interference.</p>
      <h3>Update Firmware</h3>
      <p>Ensure your router is running the latest firmware for optimal performance and security.</p>
      <h3>Use a Wi-Fi Extender or Mesh System</h3>
      <p>If you have a large home, consider using a Wi-Fi extender or a mesh system to eliminate dead zones.</p>
    `,
        date: "December 1, 2023",
        category: "Tips & Tricks",
        imageUrl: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?q=80&w=2070&auto=format&fit=crop",
        readTime: "3 min read",
        slug: "optimize-wifi-signal",
    },
];

interface BlogDetailPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = BLOG_POSTS.find((p) => p.slug === slug);

    if (!post) {
        return {
            title: "Post Not Found",
        };
    }

    return {
        title: `${post.title} | Telenet Blog`,
        description: post.description,
    };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
    const { slug } = await params;
    const post = BLOG_POSTS.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

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
                    <Button asChild variant="ghost" className="mb-8 -ml-4 hover:bg-transparent hover:text-primary">
                        <Link href="/blog" className="flex items-center">
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

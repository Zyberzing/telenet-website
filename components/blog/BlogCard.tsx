import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/Card";
import { CalendarIcon, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  imageUrl: string;
  readTime: string;
  slug: string;
}

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-300 pt-0">
      <div className="relative h-64 w-full">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
          {post.category}
        </div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center text-muted-foreground text-xs mb-2 space-x-4">
          <div className="flex items-center">
            <CalendarIcon className="w-3 h-3 mr-1" />
            {post.date}
          </div>
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {post.readTime}
          </div>
        </div>
        <h3 className="text-xl font-bold leading-tight line-clamp-2 hover:text-primary transition-colors">
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h3>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-sm line-clamp-3">
          {post.description}
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-primary text-primary-foreground">
          <Link href={`/blog/${post.slug}`}>
            Read More
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

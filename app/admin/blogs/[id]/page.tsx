"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api, Blog } from "@/lib/api";

export default function ViewBlogPage() {
  const params = useParams();
  const id = params.id as string;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await api.blogs.getById(id);
        setBlog(data);
      } catch (error) {
        console.error("Failed to fetch blog:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] px-4">
        <div className="text-gray-500">Loading blog post...</div>
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 px-4 text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Post not found</h1>
        <p className="text-gray-500">
          The blog post you are looking for does not exist.
        </p>
        <Link href="/admin/blogs" className="text-blue-600 hover:underline">
          ← Back to blogs
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12">
      {/* Hero image */}
      {blog.heroImagePath && (
        <div className="w-full h-56 sm:h-80 lg:h-96 bg-gray-100 rounded-xl overflow-hidden mb-6 sm:mb-8 relative">
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}${blog.heroImagePath}`}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Category and date */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-gray-500 mb-4">
        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
          {blog.category}
        </span>
        <span>•</span>
        <span>
          {blog.publishedAt
            ? new Date(blog.publishedAt).toLocaleDateString()
            : new Date(blog.createdAt).toLocaleDateString()}
        </span>
        <span>•</span>
        <span>{blog.published ? "Published" : "Draft"}</span>
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 break-words">
        {blog.title}
      </h1>

      {/* Excerpt */}
      <div className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-200 italic">
        {blog.excerpt}
      </div>

      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="mb-6 sm:mb-8 flex flex-wrap gap-2">
          {blog.tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Content */}
      <div
        className="prose prose-sm sm:prose-base lg:prose-lg max-w-none overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* Back button */}
      <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
        <Link
          href="/admin/blogs"
          className="text-blue-600 hover:underline inline-flex items-center gap-2 text-sm sm:text-base"
        >
          ← Back to blogs
        </Link>
      </div>
    </article>
  );
}
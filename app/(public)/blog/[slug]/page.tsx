// app/blog/[slug]/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { api, Blog } from "@/lib/api";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState<Blog[]>([]);
  
  // Newsletter state
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await api.blogs.get(slug);
        setBlog(data);

        // Fetch related posts (same category, excluding current, only published)
        const allPosts = await api.blogs.list(false);
        const related = allPosts
          .filter(
            (p) =>
              p.published && p.id !== data.id && p.category === data.category,
          )
          .slice(0, 3);
        setRelatedPosts(related);
      } catch (error) {
        console.error("Blog not found:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSubscribeMessage({ type: 'error', text: 'Please enter a valid email address' });
      setTimeout(() => setSubscribeMessage(null), 3000);
      return;
    }

    setSubscribing(true);
    setSubscribeMessage(null);

    try {
      await api.subscribers.subscribe(email);
      setSubscribeMessage({ type: 'success', text: 'Successfully subscribed to newsletter!' });
      setEmail("");
      setTimeout(() => setSubscribeMessage(null), 5000);
    } catch (error: any) {
      console.error("Subscription failed:", error);
      if (error.message?.includes('Unique constraint') || error.message?.includes('already subscribed')) {
        setSubscribeMessage({ type: 'error', text: 'This email is already subscribed!' });
      } else {
        setSubscribeMessage({ type: 'error', text: error.message || 'Failed to subscribe. Please try again.' });
      }
      setTimeout(() => setSubscribeMessage(null), 5000);
    } finally {
      setSubscribing(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Recent";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </main>
    );
  }

  if (notFound || !blog) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Post not found
          </h1>
          <p className="text-gray-500 mb-4">
            The blog post you are looking for does not exist.
          </p>
          <Link href="/blogs" className="text-blue-600 hover:underline">
            ← Back to blogs
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-16 py-12">
        {/* Category and date */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
            {blog.category}
          </span>
          <span>•</span>
          <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
          {blog.title}
        </h1>

        {/* Hero image */}
        {blog.heroImagePath && (
          <div className="relative w-full h-56 md:h-72 lg:h-96 rounded-2xl overflow-hidden mb-8 shadow-sm">
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}${blog.heroImagePath}`}
              alt={blog.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Excerpt as intro */}
        {blog.excerpt && (
          <div className="text-base md:text-lg text-gray-600 italic mb-8 pb-8 border-b border-gray-200">
            {blog.excerpt}
          </div>
        )}

        {/* Article content */}
        <article
          className="prose prose-sm md:prose-base lg:prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-ul:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Tags section */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Back button */}
        <div className="mt-8 pt-4">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium transition"
          >
            ← Back to all blogs
          </Link>
        </div>
      </div>

      {/* Related posts section */}
      {relatedPosts.length > 0 && (
        <section className="bg-[#f5f0e8] py-12 px-6 sm:px-8 lg:px-16 mt-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-extrabold text-gray-900 text-center mb-8">
              Other Related Blog
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition group"
                >
                  <div className="relative w-full h-40">
                    {post.heroImagePath ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}${post.heroImagePath}`}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-sm font-bold text-gray-900 mb-2 leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed mb-3 flex-1 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-[10px] text-gray-400">
                        {formatDate(post.publishedAt || post.createdAt)}
                      </span>
                      <span className="text-[10px] font-bold text-[var(--color-primary)] hover:underline">
                        Read More
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter section - FUNCTIONAL */}
      <section className="bg-[#1a3a2a] py-12 px-6 sm:px-8 lg:px-16">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-white text-sm font-semibold mb-5 leading-relaxed">
            Subscribe to our Newsletter to get Updates to our Latest Collection
          </p>
          
          {/* Message display */}
          {subscribeMessage && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${
              subscribeMessage.type === 'success' 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {subscribeMessage.text}
            </div>
          )}
          
          <form onSubmit={handleSubscribe} className="flex rounded-full overflow-hidden border border-white/20 bg-white/10 backdrop-blur">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={subscribing}
              className="flex-1 px-5 py-3 text-sm bg-transparent text-white placeholder-white/50 focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={subscribing}
              className="bg-[var(--color-primary)] text-black font-bold px-6 py-3 text-sm hover:bg-[var(--color-primary-dark)] transition whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {subscribing ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
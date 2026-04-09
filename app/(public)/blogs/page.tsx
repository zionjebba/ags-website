// app/blogs/page.tsx
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { api, Blog } from "@/lib/api";

export default function BlogsListPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Newsletter state
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await api.blogs.list(false); // public view
        setBlogs(data.filter((blog) => blog.published));
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

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
      setEmail(""); // Clear the input
      setTimeout(() => setSubscribeMessage(null), 5000);
    } catch (error: any) {
      console.error("Subscription failed:", error);
      // Handle duplicate email case
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

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading articles...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Our Blog
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Insights, news, and updates from the Africa-Diaspora Startups
            Investment Forum
          </p>
        </div>

        {/* Blog grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.slug}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Hero image */}
              <div className="relative w-full h-48 bg-gray-100">
                {blog.heroImagePath ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}${blog.heroImagePath}`}
                    alt={blog.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-4xl">📝</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-full">
                    {blog.category}
                  </span>
                  <span className="text-xs text-gray-400">
                    {blog.publishedAt
                      ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : new Date(blog.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-gray-900 mb-2 leading-snug line-clamp-2 group-hover:text-blue-600 transition">
                  {blog.title}
                </h2>

                <p className="text-sm text-gray-600 line-clamp-3">
                  {blog.excerpt}
                </p>

                <div className="mt-4 inline-flex items-center text-sm font-medium text-blue-600">
                  Read More
                  <svg
                    className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {blogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No blog posts available yet. Check back soon!
            </p>
          </div>
        )}
      </div>

      {/* Newsletter section - FUNCTIONAL */}
      <section className="bg-[#1a3a2a] py-12 px-6 sm:px-8 lg:px-16 mt-12">
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
"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";

const categories = ["Events", "News", "Insights", "Announcements"];

interface FormState {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  content: string;
  tags: string[];
  published: boolean;
}

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [form, setForm] = useState<FormState>({
    title: "",
    slug: "",
    excerpt: "",
    category: "Events",
    content: "",
    tags: [],
    published: false,
  });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        console.log("Fetching blog with ID:", id);

        let foundBlog;
        try {
          foundBlog = await api.blogs.getById(id);
        } catch {
          const allBlogs = await api.blogs.list(true);
          foundBlog = allBlogs.find((blog) => blog.id === id);
        }

        if (!foundBlog) {
          setNotFound(true);
          return;
        }

        console.log("Fetched blog data:", foundBlog);

        setForm({
          title: foundBlog.title,
          slug: foundBlog.slug,
          excerpt: foundBlog.excerpt,
          category: foundBlog.category,
          content: foundBlog.content,
          tags: foundBlog.tags || [],
          published: foundBlog.published,
        });
      } catch (error) {
        console.error("Failed to fetch blog:", error);
        setNotFound(true);
      } finally {
        setFetching(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setForm({ ...form, title, slug });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setHeroFile(e.target.files[0]);
    }
  };

  const handleSave = async (publish?: boolean) => {
    setLoading(true);
    try {
      const newPublishedStatus =
        publish !== undefined ? publish : form.published;

      if (heroFile) {
        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("slug", form.slug);
        formData.append("excerpt", form.excerpt);
        formData.append("category", form.category);
        formData.append("content", form.content);
        form.tags.forEach((tag) => {
          formData.append("tags[]", tag);
        });

        formData.append("published", newPublishedStatus ? "true" : "false");
        formData.append("hero", heroFile);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/blogs/${id}`,
          {
            method: "PUT",
            credentials: "include",
            body: formData,
          },
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || "Failed to update blog");
        }
      } else {
        const updateData = {
          title: form.title,
          slug: form.slug,
          excerpt: form.excerpt,
          category: form.category,
          content: form.content,
          tags: form.tags,
          published: newPublishedStatus,
        };

        console.log("Sending JSON update:", updateData);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/blogs/${id}`,
          {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
          },
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || "Failed to update blog");
        }
      }

      console.log("Update successful!");
      router.push("/admin/blogs");
    } catch (error) {
      console.error("Failed to save blog:", error);
      alert(
        error instanceof Error ? error.message : "Failed to save blog post",
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center min-h-[400px] px-4">
        <div className="text-gray-500">Loading blog post...</div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 px-4">
        <p className="text-gray-900 font-semibold">Blog post not found</p>
        <button
          onClick={() => router.push("/admin/blogs")}
          className="text-sm text-blue-600 hover:underline"
        >
          Back to blog posts
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit blog post</h1>
          <p className="text-sm text-gray-500 mt-1 font-mono break-all">{form.slug}</p>
        </div>
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold w-fit ${
            form.published
              ? "bg-green-50 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {form.published ? "Published" : "Draft"}
        </span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 flex flex-col gap-5">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Title
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleTitleChange}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Slug
          </label>
          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono text-gray-500 focus:outline-none focus:border-gray-400"
          />
          <p className="text-xs text-gray-400 mt-1 break-all">URL: /blog/{form.slug}</p>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Excerpt
          </label>
          <textarea
            name="excerpt"
            value={form.excerpt}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400"
            placeholder="Brief summary of the blog post..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400"
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Hero Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
            <p className="text-xs text-gray-400 mt-1">
              Leave empty to keep current image
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={form.tags.join(", ")}
            onChange={(e) => {
              const tagsString = e.target.value;
              const tagsArray = tagsString
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag !== "");
              setForm({ ...form, tags: tagsArray });
            }}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400"
            placeholder="tech, startup, africa, investment"
          />
          <p className="text-xs text-gray-400 mt-1">
            Separate tags with commas
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Content (HTML)
          </label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={16}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400 resize-none font-mono"
          />
          <p className="text-xs text-gray-400 mt-1">
            Use HTML tags for formatting: &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;,
            &lt;li&gt;, etc.
          </p>
        </div>

        <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            onClick={() => router.push("/admin/blogs")}
            className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 w-full sm:w-auto order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={loading}
            className="border border-gray-300 text-gray-700 text-sm font-medium px-5 py-2 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 w-full sm:w-auto order-3 sm:order-2"
          >
            Save draft
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={loading}
            className="bg-[#0f172a] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[#1e293b] transition disabled:opacity-50 w-full sm:w-auto order-1 sm:order-3"
          >
            {loading ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
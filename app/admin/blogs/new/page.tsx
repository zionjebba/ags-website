"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const categories = ["Events", "News", "Insights", "Announcements"];

export default function NewBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    category: "Events",
    content: "",
    tags: "",
    published: false,
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setForm({ ...form, title, slug });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setHeroFile(e.target.files[0]);
    }
  };

  const handleSave = async (publish: boolean) => {
    // Validate
    if (!form.title.trim()) {
      alert("Title is required");
      return;
    }
    if (!form.slug.trim()) {
      alert("Slug is required");
      return;
    }
    if (!form.excerpt.trim()) {
      alert("Excerpt is required");
      return;
    }
    if (!form.content.trim()) {
      alert("Content is required");
      return;
    }

    setLoading(true);
    try {
      // Convert tags from comma-separated string to array of strings
      const tagsArray = form.tags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag !== "");

      // First, upload the image if there is one
      let heroImagePath = null;
      if (heroFile) {
        const imageFormData = new FormData();
        imageFormData.append("hero", heroFile);
        
        const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/upload`, {
          method: "POST",
          credentials: "include",
          body: imageFormData,
        });
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          heroImagePath = uploadResult.data.path;
        }
      }

      // Then create the blog with JSON data
      const blogData = {
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt,
        category: form.category,
        content: form.content,
        tags: tagsArray,  // Send as array, not string
        published: publish,  // Send as boolean, not string
        heroImagePath: heroImagePath,
      };

      console.log("Sending blog data:", blogData);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/blogs`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogData),
      });

      const result = await response.json();
      console.log("Response status:", response.status);
      console.log("Response body:", result);

      if (!response.ok) {
        throw new Error(result.error?.message || JSON.stringify(result.error) || "Failed to create blog");
      }

      router.push("/admin/blogs");
    } catch (error) {
      console.error("Failed to create blog:", error);
      alert(error instanceof Error ? error.message : "Failed to create blog post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">New blog post</h1>
        <p className="text-sm text-gray-500 mt-1">Create a new blog post</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-5">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleTitleChange}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Slug *</label>
          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono text-gray-500"
            required
          />
          <p className="text-xs text-gray-400 mt-1">URL: /blog/{form.slug || "..."}</p>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Excerpt *</label>
          <textarea
            name="excerpt"
            value={form.excerpt}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Category *</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Hero Image</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Tags (comma separated)</label>
          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
            placeholder="tech, startup, africa"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Content (HTML) *</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={12}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono"
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button onClick={() => router.back()} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">
            Cancel
          </button>
          <button onClick={() => handleSave(false)} disabled={loading} className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium">
            {loading ? "Saving..." : "Save Draft"}
          </button>
          <button onClick={() => handleSave(true)} disabled={loading} className="bg-[#0f172a] text-white px-4 py-2 rounded-lg text-sm font-semibold">
            {loading ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
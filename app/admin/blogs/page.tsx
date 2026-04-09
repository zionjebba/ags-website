"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { api, Blog } from "@/lib/api";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Blog | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await api.blogs.list(true);
      setBlogs(data);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      alert("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    setTogglingId(id);
    try {
      await api.blogs.togglePublish(id, currentStatus);
      await fetchBlogs();
    } catch (error) {
      console.error("Failed to update blog status:", error);
      alert("Failed to update blog status");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.blogs.delete(deleteTarget.id);
      await fetchBlogs();
      setDeleteTarget(null);
    } catch (error) {
      console.error("Failed to delete blog:", error);
      alert("Failed to delete blog");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] px-4">
        <div className="text-gray-500">Loading blogs...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Blog posts</h1>
          <p className="text-sm text-gray-500 mt-1">
            {blogs.filter((b) => b.published).length} published ·{" "}
            {blogs.filter((b) => !b.published).length} drafts
          </p>
        </div>
        <Link href="/admin/blogs/new" className="w-full sm:w-auto">
          <button className="bg-[#0f172a] text-white text-sm font-semibold px-4 py-2.5 sm:py-2 rounded-lg hover:bg-[#1e293b] transition w-full sm:w-auto">
            + New post
          </button>
        </Link>
      </div>

      {/* Mobile card view */}
      <div className="block lg:hidden space-y-4">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white rounded-xl border border-gray-200 p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium text-gray-900 flex-1 mr-2 text-base">
                {blog.title}
              </h3>
              <button
                onClick={() => handleTogglePublish(blog.id, blog.published)}
                disabled={togglingId === blog.id}
                className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold cursor-pointer hover:opacity-80 transition whitespace-nowrap ${
                  blog.published
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-500"
                } ${togglingId === blog.id ? "opacity-50 cursor-wait" : ""}`}
              >
                {togglingId === blog.id
                  ? "Updating..."
                  : blog.published
                    ? "Published"
                    : "Draft"}
              </button>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                <span className="text-gray-500">Category:</span>
                <span className="text-gray-600">{blog.category}</span>
              </div>
              <div className="flex justify-between flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                <span className="text-gray-500">Date:</span>
                <span className="text-gray-600">
                  {blog.publishedAt
                    ? new Date(blog.publishedAt).toLocaleDateString()
                    : new Date(blog.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <div className="flex gap-4 mt-4 pt-3 border-t border-gray-100">
              <Link
                href={`/admin/blogs/${blog.id}`}
                className="text-sm text-blue-600 hover:underline font-medium py-1"
              >
                View
              </Link>
              <Link
                href={`/admin/blogs/${blog.id}/edit`}
                className="text-sm text-green-600 hover:underline font-medium py-1"
              >
                Edit
              </Link>
              <button
                onClick={() => setDeleteTarget(blog)}
                className="text-sm text-red-500 hover:underline font-medium py-1"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table view */}
      <div className="hidden lg:block bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Title
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Category
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Status
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Date
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr
                key={blog.id}
                className="border-b border-gray-50 hover:bg-gray-50 transition"
              >
                <td className="px-5 py-4 font-medium text-gray-900 max-w-xs truncate">
                  {blog.title}
                </td>
                <td className="px-5 py-4 text-gray-600">{blog.category}</td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => handleTogglePublish(blog.id, blog.published)}
                    disabled={togglingId === blog.id}
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold cursor-pointer hover:opacity-80 transition ${
                      blog.published
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    } ${togglingId === blog.id ? "opacity-50 cursor-wait" : ""}`}
                  >
                    {togglingId === blog.id
                      ? "Updating..."
                      : blog.published
                        ? "Published"
                        : "Draft"}
                  </button>
                </td>
                <td className="px-5 py-4 text-gray-500">
                  {blog.publishedAt
                    ? new Date(blog.publishedAt).toLocaleDateString()
                    : new Date(blog.createdAt).toLocaleDateString()}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/blogs/${blog.id}`}
                      className="text-xs text-blue-600 hover:underline font-medium"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/blogs/${blog.id}/edit`}
                      className="text-xs text-green-600 hover:underline font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(blog)}
                      className="text-xs text-red-500 hover:underline font-medium"
                    >
                      Delete
                    </button>
                  </div>
                 </td>
               </tr>
            ))}
          </tbody>
        </table>
      </div>

      {blogs.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
          No blog posts found. Create your first post!
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 bg-black/45 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeleteTarget(null);
          }}
        >
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 mx-4 sm:mx-0">
            <h2 className="text-base font-bold text-gray-900 mb-2">
              Delete blog post
            </h2>
            <p className="text-sm text-gray-600 mb-1">
              Are you sure you want to delete:
            </p>
            <p className="text-sm font-semibold text-gray-900 mb-4 break-words">
              &ldquo;{deleteTarget.title}&rdquo;
            </p>
            <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-6">
              <p className="text-xs text-red-700 font-medium">
                This will permanently delete this blog post. This action cannot
                be undone.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 w-full sm:w-auto order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="bg-red-600 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50 w-full sm:w-auto order-1 sm:order-2"
              >
                {deleting ? "Deleting..." : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
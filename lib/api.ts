const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error?.message || "Something went wrong");
  }

  const json = await res.json();
  return json.data;
}

// Type definitions
interface EventData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  venue?: string;
  phone?: string;
  email?: string;
  ticketPlans: Array<{ name: string; price: number }>;
  status?: "draft" | "active" | "ended";
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  heroImagePath: string | null;
  published: boolean;
  publishedAt: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogData {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  category: string;
  tags?: string[];
  published?: boolean;
  heroImagePath?: string;
}

interface PartnerApplyData {
  name: string;
  email: string;
  company: string;
  phone: string;
  goal: string;
}

interface BookingInitData {
  eventId: string;
  name: string;
  email: string;
  phone: string;
  userType: "investor" | "partner" | "startup";
  plan: string;
  amount: number;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  venue: string | null;
  phone: string | null;
  email: string | null;
  heroImagePath: string | null;
  aboutImagePath: string | null;
  image?: string;
  ticketPlans: Array<{ name: string; price: number }>;
  status: "draft" | "active" | "ended";
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Booking {
  id: string;
  eventId: string;
  event: { title: string; slug: string };
  userType: "individual" | "corporate";
  name: string;
  email: string;
  phone: string;
  company: string | null;
  plan: string;
  amount: number;
  paymentRef: string;
  paymentStatus: "pending" | "completed" | "failed";
  paymentVerifiedAt: string | null;
  paymentMethod: string | null;
  transactionId: string | null;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  userType?: string;
}

export interface SubscriberCounts {
  all: number;
  startup: number;
  investor: number;
  partner: number;
}

export interface Partner {
  id: string;
  name: string;
  company: string;
  email: string;
  goal: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  message?: string;
}

export const api = {
  // Auth
  auth: {
    login: (email: string, password: string) =>
      request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    logout: () => request("/auth/logout", { method: "POST" }),
    me: () => request("/auth/me"),
  },

  // Dashboard
  dashboard: {
    stats: () => request("/admin/dashboard/stats"),
    recentBookings: () => request("/admin/dashboard/recent-bookings"),
    revenueChart: (period: "daily" | "weekly" | "monthly") =>
      request(`/admin/dashboard/revenue-chart?period=${period}`),
  },

  // Events
  events: {
    list: (adminView?: boolean, params?: string): Promise<Event[]> =>
      request(
        adminView
          ? `/admin/events${params ? `?${params}` : ""}`
          : `/events${params ? `?${params}` : ""}`,
      ),
    get: (slug: string): Promise<Event> => request(`/events/${slug}`),
    create: (data: EventData): Promise<Event> =>
      request("/admin/events", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<EventData>): Promise<Event> =>
      request(`/admin/events/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string): Promise<{ message: string }> =>
      request(`/admin/events/${id}`, { method: "DELETE" }),
  },

  // Bookings
  bookings: {
    list: (params?: string): Promise<Booking[]> =>
      request(`/admin/bookings${params ? `?${params}` : ""}`),
    get: (id: string): Promise<Booking> => request(`/admin/bookings/${id}`),
    updateStatus: (id: string, status: string): Promise<Booking> =>
      request(`/admin/bookings/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      }),
    initialize: (
      data: BookingInitData,
    ): Promise<{ authorizationUrl: string; reference: string }> =>
      request("/bookings/initialize", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    verify: (reference: string): Promise<Booking> =>
      request(`/bookings/verify/${reference}`),
  },

  // Partners
 partners: {
  list: (params?: string): Promise<Partner[]> =>
    request(`/admin/partners${params ? `?${params}` : ''}`),
  updateStatus: (id: string, status: 'approved' | 'rejected', message?: string) =>
    request(`/admin/partners/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, message }),
    }),
  apply: (data: PartnerApplyData) =>
    request('/partners/apply', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
},

  // Subscribers
subscribers: {
  list: () => request("/subscribers"),
  delete: (id: string) => request(`/subscribers/${id}`, { method: "DELETE" }),
  subscribe: (email: string, userType: string = 'all') =>
    request("/subscribers", {
      method: "POST",
      body: JSON.stringify({ email, userType }),
    }),
  getCounts: () => request("/subscribers/counts"),
},
  // Blogs - CORRECTED VERSION
  blogs: {
    // Public: Get published blogs
    list: (adminView?: boolean): Promise<Blog[]> =>
      request(adminView ? "/admin/blogs" : "/blogs"),

    // Public: Get blog by slug (only published)
    get: (slug: string): Promise<Blog> => request(`/blogs/${slug}`),

    // Admin: Get blog by ID (includes drafts)
    getById: (id: string): Promise<Blog> => request(`/admin/blogs/${id}`),

    // Admin: Create blog with image upload
    create: async (formData: FormData): Promise<Blog> => {
      const response = await fetch(`${API_URL}/admin/blogs`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Failed to create blog");
      }

      const json = await response.json();
      return json.data;
    },

    // Admin: Update blog with optional image upload
    update: async (id: string, formData: FormData): Promise<Blog> => {
      const response = await fetch(`${API_URL}/admin/blogs/${id}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Failed to update blog");
      }

      const json = await response.json();
      return json.data;
    },

    // Admin: Toggle publish status (separate endpoint or use update)
    togglePublish: async (
      id: string,
      currentStatus: boolean,
    ): Promise<Blog> => {
      // Create FormData with only the published field
      const formData = new FormData();
      formData.append("published", String(!currentStatus));

      const response = await fetch(`${API_URL}/admin/blogs/${id}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.error?.message || "Failed to toggle publish status",
        );
      }

      const json = await response.json();
      return json.data;
    },

    // Admin: Delete blog (soft delete)
    delete: (id: string): Promise<{ message: string }> =>
      request(`/admin/blogs/${id}`, { method: "DELETE" }),
  },

  // Newsletter
  newsletter: {
    send: (subject: string, content: string, userType?: string) =>
      request("/admin/newsletter/send", {
        method: "POST",
        body: JSON.stringify({ subject, content, userType }),
      }),
  },
};

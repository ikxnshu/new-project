import create from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

/**
 * Why Zustand?
 * - Simplicity: tiny API, easy to reason about.
 * - Small footprint: no boilerplate required (vs Redux).
 * - Supports async actions and middlewares directly.
 * - Great for small-to-medium apps where full Redux is overkill.
 *
 * Caching strategy implemented:
 * - In-memory cache (usersCache/productsCache) keyed by query params (limit,skip,q,category).
 * - Persisted cache via localStorage (using zustand persist middleware) so navigating away and back
 *   avoids refetching until user refreshes or cache invalidation occurs.
 * - Cache TTL could be added; for this sample it's a simple manual invalidation when refetchWithForce is used.
 */

type User = any;
type Product = any;

type UsersState = {
  users: User[];
  usersTotal: number;
  usersLoading: boolean;
  usersCache: Record<string, { data: User[]; total: number }>;
  fetchUsers: (opts?: { q?: string; limit?: number; skip?: number; force?: boolean }) => Promise<void>;
  fetchUserById: (id: string | string | number) => Promise<User | null>;
};

type ProductsState = {
  products: Product[];
  productsTotal: number;
  productsLoading: boolean;
  productsCache: Record<string, { data: Product[]; total: number }>;
  categories: string[];
  fetchProducts: (opts?: { q?: string; limit?: number; skip?: number; category?: string; force?: boolean }) => Promise<void>;
  fetchProductById: (id: string | number) => Promise<Product | null>;
  fetchCategories: () => Promise<void>;
};

type AuthState = {
  token: string;
  user: any | null;
  setAuth: (payload: { token?: string; user?: any | null }) => void;
  clearAuth: () => void;
};

export const useStore = create(
  persist<
    AuthState & UsersState & ProductsState,
    any
  >((set, get) => ({
    // Auth
    token: "",
    user: null,
    setAuth: ({ token, user }) => set((s) => ({ ...s, token: token ?? s.token, user: user ?? s.user })),
    clearAuth: () => set({ token: "", user: null }),

    // Users
    users: [],
    usersTotal: 0,
    usersLoading: false,
    usersCache: {},
    fetchUsers: async ({ q, limit = 10, skip = 0, force = false } = {}) => {
      const key = `q=${q || ""}|l=${limit}|s=${skip}`;
      const cache = get().usersCache;
      if (!force && cache[key]) {
        set({ users: cache[key].data, usersTotal: cache[key].total });
        return;
      }
      set({ usersLoading: true });
      try {
        let url = "";
        if (q) {
          url = `https://dummyjson.com/users/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`;
        } else {
          url = `https://dummyjson.com/users?limit=${limit}&skip=${skip}`;
        }
        const res = await axios.get(url);
        const data = res.data;
        set((s) => {
          const nextCache = { ...s.usersCache, [key]: { data: data.users || data, total: data.total || data.users?.length || 0 } };
          return { users: data.users || data, usersTotal: data.total || (data.users?.length ?? 0), usersCache: nextCache };
        });
      } catch (err) {
        console.error("fetchUsers error", err);
      } finally {
        set({ usersLoading: false });
      }
    },
    fetchUserById: async (id) => {
      // Simple fetch without caching for single item (could be added)
      try {
        const res = await axios.get(`https://dummyjson.com/users/${id}`);
        return res.data;
      } catch (err) {
        console.error("fetchUserById error", err);
        return null;
      }
    },

    // Products
    products: [],
    productsTotal: 0,
    productsLoading: false,
    productsCache: {},
    categories: [],
    fetchProducts: async ({ q, limit = 10, skip = 0, category, force = false } = {}) => {
      const key = `q=${q || ""}|l=${limit}|s=${skip}|cat=${category || ""}`;
      const cache = get().productsCache;
      if (!force && cache[key]) {
        set({ products: cache[key].data, productsTotal: cache[key].total });
        return;
      }
      set({ productsLoading: true });
      try {
        let url = "";
        if (category) {
          url = `https://dummyjson.com/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`;
        } else if (q) {
          url = `https://dummyjson.com/products/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`;
        } else {
          url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
        }
        const res = await axios.get(url);
        const data = res.data;
        set((s) => {
          const nextCache = { ...s.productsCache, [key]: { data: data.products || data, total: data.total || (data.products?.length ?? 0) } };
          return { products: data.products || data, productsTotal: data.total || (data.products?.length ?? 0), productsCache: nextCache };
        });
      } catch (err) {
        console.error("fetchProducts error", err);
      } finally {
        set({ productsLoading: false });
      }
    },
    fetchProductById: async (id) => {
      try {
        const res = await axios.get(`https://dummyjson.com/products/${id}`);
        return res.data;
      } catch (err) {
        console.error("fetchProductById error", err);
        return null;
      }
    },
    fetchCategories: async () => {
      try {
        const res = await axios.get(`https://dummyjson.com/products/categories`);
        set({ categories: res.data });
      } catch (err) {
        console.error("fetchCategories error", err);
      }
    }
  }), { name: "dummyjson-admin-store" })
);
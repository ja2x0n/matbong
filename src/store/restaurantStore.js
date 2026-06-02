import { create } from "zustand";
import { restaurantApi } from "../services/restaurantApi";

const AUTH_USER_KEY = "matbong_auth_user";
const ACCOUNTS = [
  { id: "adminMatbong", password: "1234", role: "admin", label: "관리자" },
  { id: "userMatbong", password: "1234", role: "user", label: "일반 사용자" },
];

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_USER_KEY));
  } catch {
    return null;
  }
}

function isCurrentlyOpen(restaurant) {
  if (restaurant.isOpen === false) return false;
  if (!restaurant.startTime || !restaurant.endTime) return true;

  const now = new Date();
  const day = ["일", "월", "화", "수", "목", "금", "토"][now.getDay()];

  if (restaurant.closedDays?.includes(day)) return false;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [startHour, startMinute] = restaurant.startTime.split(":").map(Number);
  const [endHour, endMinute] = restaurant.endTime.split(":").map(Number);
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
}

export function filterRestaurants(restaurants, filters) {
  const query = filters.query.trim().toLowerCase();

  const filtered = restaurants.filter((restaurant) => {
    const matchesQuery =
      !query ||
      restaurant.name.toLowerCase().includes(query) ||
      restaurant.description.toLowerCase().includes(query) ||
      restaurant.tags.some((tag) => tag.toLowerCase().includes(query));

    const matchesCategory =
      filters.category === "all" ||
      (filters.category === "best"
        ? restaurant.isBest
        : restaurant.category === filters.category);

    const matchesOpen = !filters.openNow || isCurrentlyOpen(restaurant);

    return matchesQuery && matchesCategory && matchesOpen;
  });

  return filtered.sort((a, b) => {
    if (filters.sortBy === "latest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }

    if (a.rating === 0 && b.rating !== 0) return 1;
    if (a.rating !== 0 && b.rating === 0) return -1;
    return b.rating - a.rating;
  });
}

export const useRestaurantStore = create((set, get) => ({
  restaurants: [],
  selectedRestaurantId: null,
  loading: false,
  error: "",
  currentUser: getStoredUser(),
  adminToken: getStoredUser()?.role === "admin" ? "local-admin" : null,
  filters: {
    query: "",
    category: "all",
    sortBy: "rating",
    openNow: false,
  },

  loadRestaurants: async () => {
    set({ loading: true, error: "" });

    try {
      const restaurants = await restaurantApi.getRestaurants();
      set({ restaurants, loading: false });
    } catch {
      set({
        loading: false,
        error: "맛집 데이터를 불러오지 못했습니다.",
      });
    }
  },

  setFilter: (key, value) => {
    set((state) => ({
      selectedRestaurantId: null,
      filters: {
        ...state.filters,
        [key]: value,
      },
    }));
  },

  resetFilters: () => {
    set({
      selectedRestaurantId: null,
      filters: {
        query: "",
        category: "all",
        sortBy: "rating",
        openNow: false,
      },
    });
  },

  selectRestaurant: (restaurantId) => {
    set({ selectedRestaurantId: restaurantId });
  },

  clearSelectedRestaurant: () => {
    set({ selectedRestaurantId: null });
  },

  createRestaurant: async (payload) => {
    const created = await restaurantApi.createRestaurant(payload);
    set((state) => ({
      restaurants: [created, ...state.restaurants],
      selectedRestaurantId: created.id,
    }));
  },

  updateRestaurant: async (id, payload) => {
    const updated = await restaurantApi.updateRestaurant(id, payload);
    set((state) => ({
      restaurants: state.restaurants.map((restaurant) =>
        restaurant.id === id ? updated : restaurant
      ),
    }));
  },

  deleteRestaurant: async (id) => {
    await restaurantApi.deleteRestaurant(id);
    set((state) => ({
      restaurants: state.restaurants.filter((restaurant) => restaurant.id !== id),
      selectedRestaurantId:
        state.selectedRestaurantId === id ? null : state.selectedRestaurantId,
    }));
  },

  loginAccount: (id, password) => {
    const account = ACCOUNTS.find(
      (candidate) => candidate.id === id && candidate.password === password
    );

    if (!account) {
      return null;
    }

    const user = {
      id: account.id,
      role: account.role,
      label: account.label,
    };

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    set({
      currentUser: user,
      adminToken: user.role === "admin" ? `local-admin-${Date.now()}` : null,
    });
    return user;
  },

  logoutAccount: () => {
    localStorage.removeItem(AUTH_USER_KEY);
    set({ currentUser: null, adminToken: null, pickedLocation: null });
  },
}));

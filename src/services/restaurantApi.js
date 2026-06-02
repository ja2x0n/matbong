import { initialRestaurants } from "../data/restaurants";
import { httpClient } from "./httpClient";

const STORAGE_KEY = "matbong_restaurants";
const API_ENABLED = Boolean(import.meta.env.VITE_API_BASE_URL);

function readLocalRestaurants() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : initialRestaurants;
}

function writeLocalRestaurants(restaurants) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(restaurants));
}

// Backend 연결 전까지 같은 호출 형태를 유지하기 위한 로컬 API 어댑터.
export const restaurantApi = {
  async getRestaurants() {
    if (!API_ENABLED) return readLocalRestaurants();

    try {
      const { data } = await httpClient.get("/restaurants");
      return data;
    } catch {
      return readLocalRestaurants();
    }
  },

  async createRestaurant(payload) {
    if (!API_ENABLED) {
      const restaurants = readLocalRestaurants();
      const created = {
        ...payload,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        isBest: Number(payload.rating) >= 4.5,
        isOpen: true,
      };

      writeLocalRestaurants([created, ...restaurants]);
      return created;
    }

    try {
      const { data } = await httpClient.post("/restaurants", payload);
      return data;
    } catch {
      const restaurants = readLocalRestaurants();
      const created = {
        ...payload,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        isBest: Number(payload.rating) >= 4.5,
        isOpen: true,
      };

      writeLocalRestaurants([created, ...restaurants]);
      return created;
    }
  },

  async updateRestaurant(id, payload) {
    if (!API_ENABLED) {
      const restaurants = readLocalRestaurants();
      const updated = restaurants.map((restaurant) =>
        restaurant.id === id
          ? {
              ...restaurant,
              ...payload,
              isBest: Number(payload.rating) >= 4.5,
            }
          : restaurant
      );

      writeLocalRestaurants(updated);
      return updated.find((restaurant) => restaurant.id === id);
    }

    try {
      const { data } = await httpClient.patch(`/restaurants/${id}`, payload);
      return data;
    } catch {
      const restaurants = readLocalRestaurants();
      const updated = restaurants.map((restaurant) =>
        restaurant.id === id
          ? {
              ...restaurant,
              ...payload,
              isBest: Number(payload.rating) >= 4.5,
            }
          : restaurant
      );

      writeLocalRestaurants(updated);
      return updated.find((restaurant) => restaurant.id === id);
    }
  },

  async deleteRestaurant(id) {
    if (!API_ENABLED) {
      const restaurants = readLocalRestaurants();
      writeLocalRestaurants(
        restaurants.filter((restaurant) => restaurant.id !== id)
      );
      return;
    }

    try {
      await httpClient.delete(`/restaurants/${id}`);
    } catch {
      const restaurants = readLocalRestaurants();
      writeLocalRestaurants(
        restaurants.filter((restaurant) => restaurant.id !== id)
      );
    }
  },
};

import { CATEGORY_LABELS } from "../../data/restaurants";

export function getCategoryLabel(category) {
  return CATEGORY_LABELS[category] || "기타";
}

export function getRatingText(rating) {
  return Number(rating).toFixed(1);
}

export function getClosedDayText(closedDays = []) {
  return closedDays.length > 0 ? `${closedDays.join(", ")} 휴무` : "연중 운영";
}

export function createMapUrl(restaurant) {
  return `https://map.kakao.com/link/to/${encodeURIComponent(
    restaurant.name
  )},${restaurant.lat},${restaurant.lng}`;
}

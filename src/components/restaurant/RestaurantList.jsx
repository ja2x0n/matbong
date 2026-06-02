import { RestaurantCard } from "./RestaurantCard";
import styles from "./RestaurantList.module.css";

export function RestaurantList({
  restaurants,
  selectedRestaurantId,
  onSelectRestaurant,
}) {
  if (restaurants.length === 0) {
    return (
      <div className={styles.empty}>
        <strong>조건에 맞는 맛집이 없습니다.</strong>
        <span>검색어나 필터를 조금 넓혀서 다시 찾아보세요.</span>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {restaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          restaurant={restaurant}
          selected={restaurant.id === selectedRestaurantId}
          onSelect={onSelectRestaurant}
        />
      ))}
    </div>
  );
}

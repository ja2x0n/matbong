import {
  createMapUrl,
  getCategoryLabel,
  getClosedDayText,
  getRatingText,
} from "../../features/restaurants/restaurantUtils";
import styles from "./RestaurantCard.module.css";

export function RestaurantCard({ restaurant, selected, onSelect }) {
  return (
    <article
      className={`${styles.card} ${styles[restaurant.category] || ""} ${
        selected ? styles.selected : ""
      }`}
      onClick={() => onSelect(restaurant.id)}
    >
      <div className={styles.topLine}>
        <span className={styles.category}>{getCategoryLabel(restaurant.category)}</span>
        {restaurant.isBest && <span className={styles.best}>BEST</span>}
      </div>

      <h3>{restaurant.name}</h3>
      <p>{restaurant.description}</p>

      <div className={styles.meta}>
        <strong>★ {getRatingText(restaurant.rating)}</strong>
        <span>{restaurant.hours}</span>
        <span>{getClosedDayText(restaurant.closedDays)}</span>
      </div>

      <div className={styles.tags}>
        {restaurant.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <a
        href={createMapUrl(restaurant)}
        target="_blank"
        rel="noreferrer"
        onClick={(event) => event.stopPropagation()}
      >
        카카오맵 길찾기
      </a>
    </article>
  );
}

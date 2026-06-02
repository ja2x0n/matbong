import { CATEGORIES } from "../../data/restaurants";
import { useRestaurantStore } from "../../store/restaurantStore";
import styles from "./FilterBar.module.css";

export function FilterBar() {
  const filters = useRestaurantStore((state) => state.filters);
  const setFilter = useRestaurantStore((state) => state.setFilter);
  const resetFilters = useRestaurantStore((state) => state.resetFilters);

  return (
    <section className={styles.panel} aria-label="맛집 검색 필터">
      <div className={styles.searchLine}>
        <label className={styles.searchBox}>
          <span>오늘 뭐 먹지?</span>
          <input
            value={filters.query}
            onChange={(event) => setFilter("query", event.target.value)}
            placeholder="상호명, 메뉴, 태그 검색"
          />
        </label>

        <select
          value={filters.sortBy}
          onChange={(event) => setFilter("sortBy", event.target.value)}
          aria-label="정렬"
        >
          <option value="rating">별점 높은 순</option>
          <option value="latest">최신 등록 순</option>
        </select>

        <button
          className={filters.openNow ? styles.openActive : styles.openButton}
          onClick={() => setFilter("openNow", !filters.openNow)}
        >
          지금 영업 중
        </button>

        <button className={styles.resetButton} onClick={resetFilters}>
          초기화
        </button>
      </div>

      <div className={styles.categories}>
        {CATEGORIES.map((category) => (
          <button
            key={category.value}
            className={`${styles.categoryButton} ${
              styles[`filter_${category.value}`] || ""
            } ${filters.category === category.value ? styles.selected : ""}`}
            onClick={() => setFilter("category", category.value)}
          >
            {category.label}
          </button>
        ))}
      </div>
    </section>
  );
}

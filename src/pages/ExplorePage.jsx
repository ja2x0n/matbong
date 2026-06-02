import { useEffect, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { FilterBar } from "../components/restaurant/FilterBar";
import { RestaurantList } from "../components/restaurant/RestaurantList";
import { KakaoMap } from "../components/map/KakaoMap";
import {
  filterRestaurants,
  useRestaurantStore,
} from "../store/restaurantStore";
import styles from "./ExplorePage.module.css";

export function ExplorePage() {
  const allRestaurants = useRestaurantStore((state) => state.restaurants);
  const filters = useRestaurantStore((state) => state.filters);
  const selectedRestaurantId = useRestaurantStore(
    (state) => state.selectedRestaurantId
  );
  const currentUser = useRestaurantStore((state) => state.currentUser);
  const loading = useRestaurantStore((state) => state.loading);
  const error = useRestaurantStore((state) => state.error);
  const loadRestaurants = useRestaurantStore((state) => state.loadRestaurants);
  const selectRestaurant = useRestaurantStore((state) => state.selectRestaurant);

  useEffect(() => {
    loadRestaurants();
  }, [loadRestaurants]);

  const restaurants = useMemo(
    () => filterRestaurants(allRestaurants, filters),
    [allRestaurants, filters]
  );

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (currentUser.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return (
    <main className={styles.page}>
      <section className={styles.mapSection}>
        <div className={styles.mapHeader}>
          <div>
            <span>의성 맛집 지도</span>
            <h1>지도로 먼저 보고, 아래에서 골라보세요.</h1>
          </div>
          <p>지도를 클릭하면 지도 확대/축소가 활성화됩니다.</p>
        </div>
        <KakaoMap
          restaurants={restaurants}
          selectedRestaurantId={selectedRestaurantId}
          onSelectRestaurant={selectRestaurant}
        />
      </section>

      <FilterBar />

      {error && <p className={styles.error}>{error}</p>}

      <section className={styles.listPanel}>
        <div className={styles.listHeader}>
          <span>{loading ? "불러오는 중" : "맛집 리스트"}</span>
          <strong>{restaurants.length}곳</strong>
        </div>
        <RestaurantList
          restaurants={restaurants}
          selectedRestaurantId={selectedRestaurantId}
          onSelectRestaurant={selectRestaurant}
        />
      </section>
    </main>
  );
}

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "../components/common/Button";
import { RestaurantForm } from "../components/admin/RestaurantForm";
import { KakaoMap } from "../components/map/KakaoMap";
import { useRestaurantStore } from "../store/restaurantStore";
import { getCategoryLabel } from "../features/restaurants/restaurantUtils";
import styles from "./AdminPage.module.css";

export function AdminPage() {
  const [message, setMessage] = useState("");
  const [pickedLocation, setPickedLocation] = useState(null);
  const currentUser = useRestaurantStore((state) => state.currentUser);
  const restaurants = useRestaurantStore((state) => state.restaurants);
  const selectedRestaurantId = useRestaurantStore(
    (state) => state.selectedRestaurantId
  );
  const loadRestaurants = useRestaurantStore((state) => state.loadRestaurants);
  const selectRestaurant = useRestaurantStore((state) => state.selectRestaurant);
  const logoutAccount = useRestaurantStore((state) => state.logoutAccount);
  const createRestaurant = useRestaurantStore((state) => state.createRestaurant);
  const deleteRestaurant = useRestaurantStore((state) => state.deleteRestaurant);
  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    loadRestaurants();
  }, [loadRestaurants]);

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/explore" replace />;
  }

  async function handleCreate(payload) {
    await createRestaurant(payload);
    setPickedLocation(null);
    setMessage("매장이 등록되었습니다.");
  }

  async function handleDelete(id) {
    await deleteRestaurant(id);
    setMessage("매장이 삭제되었습니다.");
  }

  return (
    <main className={styles.page}>
      {message && <p className={styles.message}>{message}</p>}

      <section className={styles.mapSection}>
        <div className={styles.mapHeader}>
          <div>
            <span>매장 관리</span>
            <h1>지도에서 위치를 선택하고 매장을 등록하세요.</h1>
          </div>
          <p>지도 클릭 시 매장 정보 입력창이 열립니다.</p>
        </div>
        <KakaoMap
          restaurants={restaurants}
          selectedRestaurantId={selectedRestaurantId}
          onSelectRestaurant={selectRestaurant}
          pickMode
          pickedLocation={pickedLocation}
          onPickLocation={setPickedLocation}
        />
      </section>

      <section className={styles.listPanel}>
        <div className={styles.sectionTitle}>
          <div>
            <span>PLACE LIST</span>
            <h2>등록된 매장</h2>
          </div>
          <Button variant="ghost" onClick={logoutAccount}>
            로그아웃
          </Button>
        </div>

        <div className={styles.table}>
          {restaurants.map((restaurant) => (
            <article key={restaurant.id}>
              <div>
                <strong>{restaurant.name}</strong>
                <span>
                  {getCategoryLabel(restaurant.category)} · ★{" "}
                  {restaurant.rating.toFixed(1)}
                </span>
              </div>
              <Button
                variant="danger"
                onClick={() => handleDelete(restaurant.id)}
              >
                삭제
              </Button>
            </article>
          ))}
            </div>
      </section>

      {pickedLocation && (
        <div className={styles.modalOverlay} role="presentation">
          <section className={styles.modal} role="dialog" aria-modal="true">
            <div className={styles.modalHeader}>
              <div>
                <span>NEW PLACE</span>
                <h2>매장 정보 작성</h2>
              </div>
              <button onClick={() => setPickedLocation(null)} type="button">
                닫기
              </button>
            </div>
            <RestaurantForm
              location={pickedLocation}
              onSubmit={handleCreate}
              onCancel={() => setPickedLocation(null)}
            />
          </section>
        </div>
      )}
    </main>
  );
}

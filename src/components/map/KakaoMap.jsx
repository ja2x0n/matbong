import { useEffect, useRef, useState } from "react";
import {
  createMapUrl,
  getCategoryLabel,
  getRatingText,
} from "../../features/restaurants/restaurantUtils";
import styles from "./KakaoMap.module.css";

const DEFAULT_CENTER = { lat: 36.29964541276965, lng: 128.5806936739593 };

export function KakaoMap({
  restaurants,
  selectedRestaurantId,
  onSelectRestaurant,
  pickMode = false,
  pickedLocation,
  onPickLocation,
  compact = false,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapFallback, setMapFallback] = useState(false);
  const [mapFocused, setMapFocused] = useState(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const fallbackTimer = window.setTimeout(() => {
      if (!window.kakao?.maps && !mapRef.current) {
        setMapFallback(true);
      }
    }, 1800);

    if (!window.kakao?.maps) {
      return () => window.clearTimeout(fallbackTimer);
    }

    window.kakao.maps.load(() => {
      mapRef.current = new window.kakao.maps.Map(containerRef.current, {
        center: new window.kakao.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng),
        level: 2,
        maxLevel: 5,
      });
      mapRef.current.setZoomable(false);
      setMapReady(true);
      window.clearTimeout(fallbackTimer);
    });

    return () => window.clearTimeout(fallbackTimer);
  }, []);

  useEffect(() => {
    if (!mapReady || !mapRef.current || !window.kakao || !pickMode) return;

    const listener = window.kakao.maps.event.addListener(
      mapRef.current,
      "click",
      (mouseEvent) => {
        const latlng = mouseEvent.latLng;
        onPickLocation?.({
          lat: latlng.getLat(),
          lng: latlng.getLng(),
        });
      }
    );

    return () => window.kakao.maps.event.removeListener(listener);
  }, [mapReady, onPickLocation, pickMode]);

  useEffect(() => {
    if (!mapReady || !mapRef.current || !window.kakao) return;

    mapRef.current.setZoomable(mapFocused);
  }, [mapFocused, mapReady]);

  useEffect(() => {
    function handleDocumentClick(event) {
      if (!mapFocused) return;
      if (!event.target.closest(`.${styles.mapShell}`)) {
        setMapFocused(false);
      }
    }

    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, [mapFocused]);

  useEffect(() => {
    if (!mapReady || !mapRef.current || !window.kakao) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const bounds = new window.kakao.maps.LatLngBounds();
    let selectedExists = false;

    restaurants.forEach((restaurant) => {
      const position = new window.kakao.maps.LatLng(restaurant.lat, restaurant.lng);
      const marker = new window.kakao.maps.Marker({
        map: mapRef.current,
        position,
      });

      bounds.extend(position);

      window.kakao.maps.event.addListener(marker, "click", () => {
        onSelectRestaurant(restaurant.id);
        openInfoWindow(restaurant, marker);
      });

      markersRef.current.push(marker);

      if (restaurant.id === selectedRestaurantId) {
        selectedExists = true;
        mapRef.current.setCenter(position);
        openInfoWindow(restaurant, marker);
      }
    });

    if ((!selectedRestaurantId || !selectedExists) && infoWindowRef.current) {
      infoWindowRef.current.close();
    }

    if (restaurants.length > 1) {
      mapRef.current.setBounds(bounds);
    }

    if (restaurants.length === 1) {
      mapRef.current.setCenter(
        new window.kakao.maps.LatLng(restaurants[0].lat, restaurants[0].lng)
      );
      mapRef.current.setLevel(2);
    }
  }, [mapReady, restaurants, selectedRestaurantId, onSelectRestaurant]);

  function openInfoWindow(restaurant, marker) {
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }

    infoWindowRef.current = new window.kakao.maps.InfoWindow({
      zIndex: 10,
      removable: true,
      content: `
        <div class="${styles.infoWindow}">
          <div class="${styles.infoTop}">
            <span>${getCategoryLabel(restaurant.category)}</span>
            ${restaurant.isBest ? "<strong>BEST</strong>" : ""}
          </div>
          <h3>${restaurant.name}</h3>
          <p>${restaurant.description}</p>
          <div class="${styles.infoRating}">★ ${getRatingText(restaurant.rating)} · ${restaurant.hours}</div>
          <a href="${createMapUrl(restaurant)}" target="_blank" rel="noreferrer">길찾기</a>
        </div>
      `,
    });

    infoWindowRef.current.open(mapRef.current, marker);
  }

  function toggleMapFocus(event) {
    if (pickMode) return;
    if (event.target.closest("button, a")) return;
    setMapFocused((focused) => !focused);
  }

  function blurMap() {
    setMapFocused(false);
  }

  return (
    <div
      className={`${styles.mapShell} ${compact ? styles.compactShell : ""} ${
        mapFocused ? styles.mapFocused : ""
      }`}
      tabIndex={0}
      onClick={toggleMapFocus}
      onBlur={blurMap}
    >
      <div
        ref={containerRef}
        className={`${styles.map} ${compact ? styles.compactMap : ""} ${
          mapFallback ? styles.hiddenMap : ""
        }`}
      />
      {mapFallback && (
        <FallbackMap
          restaurants={restaurants}
          selectedRestaurantId={selectedRestaurantId}
          onSelectRestaurant={onSelectRestaurant}
          pickMode={pickMode}
          pickedLocation={pickedLocation}
          onPickLocation={onPickLocation}
          compact={compact}
        />
      )}
      {!mapReady && !mapFallback && (
        <div className={styles.mapLoading}>
          <strong>지도를 불러오는 중입니다</strong>
          <span>잠시만 기다려주세요.</span>
        </div>
      )}
      <div className={styles.mapBadge}>
        <strong>{restaurants.length}</strong>
        <span>{pickMode ? "지도에서 위치 선택" : "곳 표시 중"}</span>
      </div>
      {!mapFocused && !pickMode && (
        <div className={styles.focusGuide}>지도 클릭 후 확대/축소</div>
      )}
    </div>
  );
}

function FallbackMap({
  restaurants,
  selectedRestaurantId,
  onSelectRestaurant,
  pickMode,
  pickedLocation,
  onPickLocation,
  compact,
}) {
  function handlePick(event) {
    if (!pickMode) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const xRatio = (event.clientX - rect.left) / rect.width;
    const yRatio = (event.clientY - rect.top) / rect.height;

    onPickLocation?.({
      lat: DEFAULT_CENTER.lat + (0.5 - yRatio) * 0.01,
      lng: DEFAULT_CENTER.lng + (xRatio - 0.5) * 0.01,
    });
  }

  return (
    <div
      className={`${styles.fallbackMap} ${compact ? styles.compactMap : ""} ${
        pickMode ? styles.pickableMap : ""
      }`}
      onClick={handlePick}
    >
      <div className={styles.fallbackRoadOne} />
      <div className={styles.fallbackRoadTwo} />
      <div className={styles.fallbackDistrict}>의성 도리원</div>
      {pickMode && (
        <div className={styles.pickGuide}>
          지도에서 맛집 위치를 클릭하세요
        </div>
      )}
      {pickedLocation && (
        <div className={styles.pickedPin}>
          <span>+</span>
          <strong>새 맛집 위치</strong>
        </div>
      )}
      {restaurants.map((restaurant, index) => (
        <button
          key={restaurant.id}
          className={`${styles.fallbackMarker} ${
            restaurant.id === selectedRestaurantId ? styles.activeMarker : ""
          }`}
          style={{
            left: `${22 + (index % 2) * 38 + index * 3}%`,
            top: `${24 + (index % 3) * 18}%`,
          }}
          onClick={(event) => {
            event.stopPropagation();
            onSelectRestaurant(restaurant.id);
          }}
          aria-label={`${restaurant.name} 위치 선택`}
        >
          <span>{index + 1}</span>
          <strong>{restaurant.name}</strong>
        </button>
      ))}
    </div>
  );
}

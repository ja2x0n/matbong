import { useState } from "react";
import { CATEGORIES, TAGS } from "../../data/restaurants";
import { Button } from "../common/Button";
import styles from "./RestaurantForm.module.css";

const categoryOptions = CATEGORIES.filter(
  (category) => !["all", "best"].includes(category.value)
);

const initialForm = {
  name: "",
  description: "",
  review: "",
  category: "korean",
  rating: "4.5",
  startTime: "11:00",
  endTime: "21:00",
  closedDays: [],
  tags: [],
};

export function RestaurantForm({ location, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialForm);

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function toggleArrayField(name, value, limit) {
    setForm((current) => {
      const exists = current[name].includes(value);
      const nextValue = exists
        ? current[name].filter((item) => item !== value)
        : [...current[name], value].slice(0, limit);

      return { ...current, [name]: nextValue };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    await onSubmit({
      ...form,
      rating: Number(form.rating),
      lat: location.lat,
      lng: location.lng,
      hours: `${form.startTime} ~ ${form.endTime}`,
    });

    setForm(initialForm);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.locationSummary}>
        <strong>선택한 위치</strong>
        <span>
          위도 {location.lat.toFixed(6)} · 경도 {location.lng.toFixed(6)}
        </span>
      </div>

      <div className={styles.grid}>
        <label>
          상호명
          <input
            required
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="예: 봉양식당"
          />
        </label>

        <label>
          카테고리
          <select
            value={form.category}
            onChange={(event) => updateField("category", event.target.value)}
          >
            {categoryOptions.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          별점
          <input
            min="1"
            max="5"
            step="0.1"
            type="number"
            value={form.rating}
            onChange={(event) => updateField("rating", event.target.value)}
          />
        </label>

        <label>
          영업 시작
          <input
            type="time"
            value={form.startTime}
            onChange={(event) => updateField("startTime", event.target.value)}
          />
        </label>

        <label>
          영업 종료
          <input
            type="time"
            value={form.endTime}
            onChange={(event) => updateField("endTime", event.target.value)}
          />
        </label>
      </div>

      <label>
        설명
        <textarea
          required
          value={form.description}
          onChange={(event) => updateField("description", event.target.value)}
          placeholder="사용자가 보고 바로 이해할 수 있게 짧게 적어주세요."
        />
      </label>

      <label>
        리뷰 메모
        <textarea
          value={form.review}
          onChange={(event) => updateField("review", event.target.value)}
          placeholder="대표 메뉴, 분위기, 방문 팁을 적어주세요."
        />
      </label>

      <fieldset>
        <legend>휴무일</legend>
        <div className={styles.chips}>
          {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
            <button
              key={day}
              type="button"
              className={form.closedDays.includes(day) ? styles.active : ""}
              onClick={() => toggleArrayField("closedDays", day)}
            >
              {day}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>태그 최대 3개</legend>
        <div className={styles.chips}>
          {TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              className={form.tags.includes(tag) ? styles.active : ""}
              onClick={() => toggleArrayField("tags", tag, 3)}
            >
              {tag}
            </button>
          ))}
        </div>
      </fieldset>

      <div className={styles.actions}>
        <Button variant="ghost" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit">매장 등록</Button>
      </div>
    </form>
  );
}

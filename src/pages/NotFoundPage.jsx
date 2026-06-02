import { Link } from "react-router-dom";
import styles from "./NotFoundPage.module.css";

export function NotFoundPage() {
  return (
    <main className={styles.page}>
      <h1>페이지를 찾을 수 없습니다.</h1>
      <p>주소를 다시 확인하거나 맛집 찾기 화면으로 돌아가세요.</p>
      <Link to="/">맛집 찾기로 이동</Link>
    </main>
  );
}

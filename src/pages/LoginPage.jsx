import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";
import { useRestaurantStore } from "../store/restaurantStore";
import styles from "./LoginPage.module.css";

export function LoginPage() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const currentUser = useRestaurantStore((state) => state.currentUser);
  const loginAccount = useRestaurantStore((state) => state.loginAccount);
  const navigate = useNavigate();

  if (currentUser?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (currentUser?.role === "user") {
    return <Navigate to="/explore" replace />;
  }

  function handleLogin(event) {
    event.preventDefault();
    const user = loginAccount(loginId, password);

    if (!user) {
      setMessage("아이디 또는 비밀번호가 맞지 않습니다.");
      return;
    }

    setLoginId("");
    setPassword("");
    navigate(user.role === "admin" ? "/admin" : "/explore", { replace: true });
  }

  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <span>MATBONG LOGIN</span>
        <h1>맛봉 시작하기</h1>
        <p>계정 권한에 따라 맛집 탐색 화면과 매장 관리 화면으로 이동합니다.</p>

        <form className={styles.form} onSubmit={handleLogin}>
          <input
            value={loginId}
            onChange={(event) => setLoginId(event.target.value)}
            placeholder="아이디"
            autoComplete="username"
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="비밀번호"
            autoComplete="current-password"
          />
          {message && <strong>{message}</strong>}
          <div className={styles.accountGuide}>
            <span>관리자 adminMatbong / 1234</span>
            <span>일반 userMatbong / 1234</span>
          </div>
          <Button type="submit">로그인</Button>
        </form>
      </section>
    </main>
  );
}

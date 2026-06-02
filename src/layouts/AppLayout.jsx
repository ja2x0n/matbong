import { NavLink, Outlet } from "react-router-dom";
import logo from "../assets/logo.png";
import { useRestaurantStore } from "../store/restaurantStore";
import styles from "./AppLayout.module.css";

export function AppLayout() {
    const currentUser = useRestaurantStore((state) => state.currentUser);
    const logoutAccount = useRestaurantStore((state) => state.logoutAccount);

    return (
        <div className={styles.shell}>
            <header className={styles.header}>
                <NavLink
                    to={
                        currentUser?.role === "admin"
                            ? "/admin"
                            : currentUser
                            ? "/explore"
                            : "/"
                    }
                    className={styles.brand}
                    aria-label="맛봉 홈"
                >
                    <img src={logo} alt="MatBong" />
                    <div>
                        <strong>MatBong</strong>
                        <span>의성 맛집 지도</span>
                    </div>
                </NavLink>

                <nav className={styles.nav} aria-label="주요 메뉴">
                    {currentUser?.role === "user" && (
                        <NavLink
                            to="/explore"
                            className={({ isActive }) =>
                                isActive ? styles.active : ""
                            }
                        >
                            맛집 찾기
                        </NavLink>
                    )}
                    {currentUser?.role === "admin" && (
                        <NavLink
                            to="/admin"
                            className={({ isActive }) =>
                                isActive ? styles.active : ""
                            }
                        >
                            맛집 관리
                        </NavLink>
                    )}
                    {currentUser && (
                        <button
                            className={styles.logoutButton}
                            onClick={logoutAccount}
                            type="button"
                        >
                            로그아웃
                        </button>
                    )}
                </nav>
            </header>

            <Outlet />
        </div>
    );
}

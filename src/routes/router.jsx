import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout.jsx";
import { LoginPage } from "../pages/LoginPage.jsx";
import { ExplorePage } from "../pages/ExplorePage.jsx";
import { AdminPage } from "../pages/AdminPage.jsx";
import { NotFoundPage } from "../pages/NotFoundPage.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <LoginPage /> },
      { path: "explore", element: <ExplorePage /> },
      { path: "admin", element: <AdminPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

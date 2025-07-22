import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Pages, styles & components
import "./styles/index.css";
import "./styles/App.css";
import TabBar from "./components/Tabbar.jsx";
import Welcome from "./pages/welcome_page.jsx";
import Form from "./pages/Form.jsx";
import Data from "./pages/Data_display.jsx";

// Main App component with routing
function App() {
  const location = useLocation();
  const background = location.state?.background || null;

  const hideTabBarRoutes = ["/welcome", "/login", "/register"];
  const shouldHideTabBar = hideTabBarRoutes.includes(location.pathname);

  return (
    <>
      <div
        className={shouldHideTabBar ? "" : "pb-16"}
        style={{ width: "84vw", minHeight: "94vh" }}
      >
        <Routes location={background || location}>
          <Route path="/" element={<Navigate to="/welcome" />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/form" element={<Form />} />
          <Route path="/data" element={<Data />} />
        </Routes>
      </div>
      {!shouldHideTabBar && <TabBar />}
    </>
  );
}

// Mount app to DOM
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          className: "bg-white text-sm font-medium shadow-md rounded-md p-3",
          success: {
            className: "bg-green-100 text-green-800",
          },
          error: {
            className: "bg-red-100 text-red-800",
          },
        }}
      />
    </Router>
  </StrictMode>
);

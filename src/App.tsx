import { Suspense } from "react";
import { useRoutes, Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import ProfilePage from "./components/ProfilePage";
import GroomClubSidebar from "./components/GroomClubSidebar";
import GroomClubHeader from "./components/GroomClubHeader";
import StaffLoginPage from "./components/StaffLoginPage";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div className="flex h-screen bg-neutral-100">
        {!isLoginPage && <GroomClubSidebar />}
        <div
          className={`flex-1 flex flex-col overflow-hidden ${isLoginPage ? "w-full" : ""}`}
        >
          {!isLoginPage && <GroomClubHeader />}
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/login" element={<StaffLoginPage />} />
              {import.meta.env.VITE_TEMPO === "true" && (
                <Route path="/tempobook/*" />
              )}
            </Routes>
            {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
          </main>
        </div>
      </div>
    </Suspense>
  );
}

export default App;

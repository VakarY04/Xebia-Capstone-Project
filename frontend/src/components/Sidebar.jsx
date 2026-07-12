import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useSidebar } from "../context/SidebarContext.jsx";
import {
  ChartIcon,
  ChevronRightIcon,
  DashboardIcon,
  DetailsIcon,
  LogoMark,
  LogoutIcon,
  PlanIcon,
  SettingsIcon,
} from "./AppIcons.jsx";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { to: "/meal-plan", label: "Workout and Meals", icon: PlanIcon },
  { to: "/my-details", label: "My Details", icon: DetailsIcon },
  { to: "/stats", label: "Stats", icon: ChartIcon },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { collapsed, mobileOpen, closeMobileSidebar } = useSidebar();
  const navigate = useNavigate();

  const handleLogout = () => {
    closeMobileSidebar();
    logout();
    navigate("/");
  };

  const handleOpenProfile = () => {
    closeMobileSidebar();
    navigate("/profile");
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-white/10 bg-slate-950 text-white shadow-[0_24px_80px_rgba(15,23,42,0.38)] transition-all duration-300 ${
        collapsed ? "w-24" : "w-72"
      } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-6">
          <LogoMark className="h-12 w-12 shrink-0" />
          {!collapsed ? (
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold tracking-tight">
                FitAI Coach
              </h1>
              <p className="truncate text-sm text-slate-300/80">
                AI Fitness and Nutrition
              </p>
            </div>
          ) : null}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeMobileSidebar}
              title={collapsed ? item.label : null}
              className={({ isActive }) =>
                `sidebar-link ${collapsed ? "justify-center px-0" : ""} ${
                  isActive ? "sidebar-link-active" : "sidebar-link-idle"
                }`
              }
            >
              <span className="sidebar-link-icon">
                <item.icon />
              </span>
              {!collapsed ? <span className="truncate">{item.label}</span> : null}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-3 border-t border-white/10 px-4 py-4">
          {!collapsed ? (
            <button
              type="button"
              onClick={handleOpenProfile}
              className="w-full rounded-3xl bg-white/5 px-4 py-4 text-left transition hover:bg-white/10"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Account
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-sm font-semibold">
                  {user?.name?.slice(0, 2)?.toUpperCase() || "AF"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    {user?.name || "AI Fit User"}
                  </p>
                  <p className="truncate text-xs text-slate-300/80">
                    {user?.email || "Signed in"}
                  </p>
                </div>
                <ChevronRightIcon className="h-4 w-4 text-slate-500" />
              </div>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleOpenProfile}
              title="Profile"
              className="sidebar-link sidebar-link-idle w-full justify-center px-0"
            >
              <span className="sidebar-link-icon">
                <DetailsIcon />
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={handleLogout}
            title={collapsed ? "Log out" : null}
            className={`sidebar-link sidebar-link-idle w-full ${
              collapsed ? "justify-center px-0" : ""
            }`}
          >
            <span className="sidebar-link-icon">
              <LogoutIcon />
            </span>
            {!collapsed ? <span>Log Out</span> : null}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

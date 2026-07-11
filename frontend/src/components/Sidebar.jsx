import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "🏠" },
  { to: "/my-details", label: "My Details", icon: "📝" },
  { to: "/stats", label: "Stats", icon: "📊" },
  { to: "/profile", label: "Profile", icon: "⚙️" },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="w-64 min-h-screen bg-slate-900 border-r border-white/10 flex flex-col justify-between fixed left-0 top-0">
      <div>
        <div className="px-6 py-6 border-b border-white/10">
          <h1 className="text-xl font-bold text-white">
            AI <span className="text-primary">Fit</span>
          </h1>
          {user && (
            <p className="text-slate-400 text-sm mt-1 truncate">
              Hi, {user.name?.split(" ")[0]}
            </p>
          )}
        </div>

        <nav className="mt-4 flex flex-col gap-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-primary/20 text-primary"
                    : "text-slate-300 hover:bg-white/5"
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="mx-3 mb-6 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition text-left"
      >
        🚪 Log out
      </button>
    </aside>
  );
};

export default Sidebar;

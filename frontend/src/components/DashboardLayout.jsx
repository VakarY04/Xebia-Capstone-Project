import Sidebar from "./Sidebar.jsx";
import { useSidebar } from "../context/SidebarContext.jsx";

const DashboardLayout = ({ children }) => {
  const { collapsed, mobileOpen, toggleSidebar, closeMobileSidebar } =
    useSidebar();

  return (
    <div className="min-h-screen bg-app-page">
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          onClick={closeMobileSidebar}
          aria-label="Close navigation"
        />
      ) : null}

      <Sidebar />

      <main
        className={`min-h-screen transition-[margin] duration-300 ${
          collapsed ? "lg:ml-24" : "lg:ml-72"
        }`}
        onClick={(event) => {
          const toggleTarget = event.target.closest("[data-sidebar-toggle='true']");
          if (toggleTarget) {
            toggleSidebar();
          }
        }}
      >
        <div className="mx-auto flex min-h-screen w-full max-w-[1500px] flex-col px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;


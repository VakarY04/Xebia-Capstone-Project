import { CalendarIcon, MenuIcon } from "./AppIcons.jsx";

const AppHeader = ({ title, subtitle, actions }) => {
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="flex items-start gap-3">
        <button
          type="button"
          className="app-icon-button"
          data-sidebar-toggle="true"
          aria-label="Toggle navigation"
        >
          <MenuIcon />
        </button>

        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="app-date-chip">
          <CalendarIcon />
          <span>{today}</span>
        </div>
        {actions}
      </div>
    </div>
  );
};

export default AppHeader;

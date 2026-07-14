import { Link } from "react-router-dom";
import { LogoMark } from "./AppIcons.jsx";

const AppBrand = ({
  as: Component = "div",
  to,
  compact = false,
  subtitle = "Fitness & Nutrition",
  className = "",
  titleClassName = "",
  subtitleClassName = "",
  logoClassName = "",
  onClick,
}) => {
  const content = (
    <>
      <LogoMark className={`h-11 w-11 shrink-0 ${logoClassName}`.trim()} />
      {!compact ? (
        <div className="min-w-0">
          <p
            className={`truncate text-lg font-semibold uppercase tracking-[0.22em] text-[var(--app-text)] ${titleClassName}`.trim()}
          >
            AI FIT
          </p>
          <p
            className={`truncate text-xs font-medium tracking-[0.18em] text-[var(--app-text-secondary)] ${subtitleClassName}`.trim()}
          >
            {subtitle}
          </p>
        </div>
      ) : null}
    </>
  );

  const classes = `flex items-center gap-3 text-left ${className}`.trim();

  if (Component === Link || to) {
    return (
      <Link to={to || "/"} className={classes} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <Component className={classes} onClick={onClick}>
      {content}
    </Component>
  );
};

export default AppBrand;

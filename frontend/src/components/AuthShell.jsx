import { Link } from "react-router-dom";
import AppBrand from "./AppBrand.jsx";

const AuthShell = ({ title, subtitle, children, footer }) => (
  <div className="auth-screen">
    <div className="glow-blob left-[-5rem] top-16 h-56 w-56 bg-primary/20 animate-floatSlow" />
    <div className="glow-blob right-[-4rem] bottom-20 h-64 w-64 bg-primary/10 animate-floatSlower" />

    <div className="auth-card">
      <AppBrand as={Link} to="/" className="mb-8" />

      <div className="mb-6">
        <h1 className="text-3xl font-normal tracking-tight text-[var(--app-text)]">
          {title}
        </h1>
        <p className="mt-2 text-sm font-normal text-[var(--app-text-secondary)]">
          {subtitle}
        </p>
      </div>

      {children}

      {footer ? (
        <div className="mt-6 text-center text-sm text-[var(--app-text-secondary)]">
          {footer}
        </div>
      ) : null}
    </div>
  </div>
);

export default AuthShell;

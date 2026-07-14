import AppBrand from "./AppBrand.jsx";
import OnboardingProgress from "./OnboardingProgress.jsx";

const OnboardingShell = ({
  step,
  total = 4,
  title,
  description,
  children,
  action,
}) => (
  <div className="onboarding-screen">
    <div className="glow-blob left-[-4rem] top-24 h-52 w-52 bg-primary/20 animate-floatSlow" />
    <div className="glow-blob right-[-4rem] bottom-20 h-60 w-60 bg-primary/12 animate-floatSlower" />

    <div className="onboarding-card">
      <AppBrand className="mb-8 justify-center" />
      <OnboardingProgress step={step} total={total} />

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-normal tracking-tight text-[var(--app-text)]">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 text-sm font-normal leading-6 text-[var(--app-text-secondary)]">
            {description}
          </p>
        ) : null}
      </div>

      {children}

      {action ? <div className="mt-10 flex justify-center">{action}</div> : null}
    </div>
  </div>
);

export default OnboardingShell;

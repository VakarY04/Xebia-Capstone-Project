const OnboardingProgress = ({ step, total = 4 }) => (
  <div className="w-full max-w-xs mb-8">
    <p className="text-primary text-sm mb-2 text-center">
      Step {step} of {total}
    </p>
    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
      <div
        className="h-full bg-primary transition-all duration-300"
        style={{ width: `${(step / total) * 100}%` }}
      />
    </div>
  </div>
);

export default OnboardingProgress;

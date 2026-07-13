const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const IconWrap = ({ children, className = "w-5 h-5" }) => (
  <svg {...iconProps} className={className}>
    {children}
  </svg>
);

export const LogoMark = ({ className = "w-10 h-10" }) => (
  <div
    className={`overflow-hidden rounded-full border border-white/10 bg-dark-surface shadow-[0_18px_40px_rgba(0,0,0,0.32)] ${className}`}
  >
    <img
      src="/images/ai-fit-logo.png"
      alt="AI FIT logo"
      className="h-full w-full object-cover"
    />
  </div>
);

export const MenuIcon = () => (
  <IconWrap>
    <path d="M4 7h16" />
    <path d="M4 12h16" />
    <path d="M4 17h16" />
  </IconWrap>
);

export const CalendarIcon = () => (
  <IconWrap>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M16 3v4" />
    <path d="M8 3v4" />
    <path d="M3 10h18" />
  </IconWrap>
);

export const DashboardIcon = () => (
  <IconWrap>
    <rect x="4" y="4" width="7" height="7" rx="1.5" />
    <rect x="13" y="4" width="7" height="11" rx="1.5" />
    <rect x="4" y="13" width="7" height="7" rx="1.5" />
    <rect x="13" y="17" width="7" height="3" rx="1.5" />
  </IconWrap>
);

export const PlanIcon = () => (
  <IconWrap>
    <path d="M5 6h14" />
    <path d="M5 12h14" />
    <path d="M5 18h9" />
    <path d="M17 18h2" />
  </IconWrap>
);

export const DetailsIcon = () => (
  <IconWrap>
    <path d="M8 7h12" />
    <path d="M8 12h12" />
    <path d="M8 17h8" />
    <circle cx="5" cy="7" r="1" fill="currentColor" stroke="none" />
    <circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="5" cy="17" r="1" fill="currentColor" stroke="none" />
  </IconWrap>
);

export const ChartIcon = () => (
  <IconWrap>
    <path d="M4 19h16" />
    <path d="M7 16v-4" />
    <path d="M12 16V8" />
    <path d="M17 16v-7" />
  </IconWrap>
);

export const SettingsIcon = () => (
  <IconWrap>
    <circle cx="12" cy="12" r="3.5" />
    <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 0 1-4 0v-.2a1 1 0 0 0-.7-.9 1 1 0 0 0-1.1.2l-.1.1a2 2 0 0 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 0 1 0-4h.2a1 1 0 0 0 .9-.7 1 1 0 0 0-.2-1.1l-.1-.1a2 2 0 0 1 2.8-2.8l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9V4a2 2 0 0 1 4 0v.2a1 1 0 0 0 .7.9 1 1 0 0 0 1.1-.2l.1-.1a2 2 0 0 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6h.2a2 2 0 0 1 0 4h-.2a1 1 0 0 0-.9.6Z" />
  </IconWrap>
);

export const FlameIcon = () => (
  <IconWrap>
    <path d="M12 3c1.5 2.4 3 4.3 3 6.5A3.5 3.5 0 0 1 8 9c0-1.6.8-3 2.2-4.7" />
    <path d="M12 9c3.1 2.2 5 4.5 5 7.2A5 5 0 0 1 7 16.2c0-1.9 1.1-3.8 3.1-5.8" />
  </IconWrap>
);

export const ProteinIcon = () => (
  <IconWrap>
    <path d="M7 14c0-3.3 2.7-6 6-6 2 0 3.7.9 4.8 2.4" />
    <path d="M6 18c1.4 1.9 3.5 3 6 3 4.4 0 8-3.6 8-8 0-.7-.1-1.3-.2-2" />
    <path d="M5 11l2.4 2.4L11 9.8" />
  </IconWrap>
);

export const WaterIcon = () => (
  <IconWrap>
    <path d="M12 3c3.6 4.7 5.5 7.5 5.5 10a5.5 5.5 0 1 1-11 0c0-2.5 1.9-5.3 5.5-10Z" />
  </IconWrap>
);

export const StreakIcon = () => (
  <IconWrap>
    <path d="M13 3 6 14h5l-1 7 7-11h-5l1-7Z" />
  </IconWrap>
);

export const WorkoutIcon = () => (
  <IconWrap>
    <path d="M4 10v4" />
    <path d="M20 10v4" />
    <path d="M7 8v8" />
    <path d="M17 8v8" />
    <path d="M10 12h4" />
    <path d="M7 12h10" />
  </IconWrap>
);

export const MealIcon = () => (
  <IconWrap>
    <path d="M7 4v8" />
    <path d="M10 4v8" />
    <path d="M7 8h3" />
    <path d="M15 4v16" />
    <path d="M18 4c1.1 1.3 2 2.8 2 4.5S19.1 12 18 13.5" />
  </IconWrap>
);

export const CheckIcon = ({ className = "w-4 h-4" }) => (
  <IconWrap className={className}>
    <path d="m5 12 4 4L19 6" />
  </IconWrap>
);

export const ChevronRightIcon = ({ className = "w-4 h-4" }) => (
  <IconWrap className={className}>
    <path d="m9 6 6 6-6 6" />
  </IconWrap>
);

export const ChevronDownIcon = ({ className = "w-4 h-4" }) => (
  <IconWrap className={className}>
    <path d="m6 9 6 6 6-6" />
  </IconWrap>
);

export const CameraIcon = () => (
  <IconWrap>
    <path d="M4 8h3l2-2h6l2 2h3v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
    <circle cx="12" cy="13" r="3.5" />
  </IconWrap>
);

export const LockIcon = () => (
  <IconWrap>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 1 1 8 0v3" />
  </IconWrap>
);

export const LogoutIcon = () => (
  <IconWrap>
    <path d="M10 17v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1" />
    <path d="m14 16 4-4-4-4" />
    <path d="M9 12h9" />
  </IconWrap>
);

export const SparkleIcon = ({ className = "w-5 h-5" }) => (
  <IconWrap className={className}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
    <path d="M12 8a4 4 0 0 0 4 4 4 4 0 0 0-4 4 4 4 0 0 0-4-4 4 4 0 0 0 4-4Z" />
  </IconWrap>
);

export const ShieldIcon = ({ className = "w-5 h-5" }) => (
  <IconWrap className={className}>
    <path d="M12 3.5 5 6v5.5c0 4.2 2.9 7.4 7 9 4.1-1.6 7-4.8 7-9V6l-7-2.5Z" />
    <path d="M9 12.2l2 2 4-4.2" />
  </IconWrap>
);

export const SyncIcon = ({ className = "w-5 h-5" }) => (
  <IconWrap className={className}>
    <path d="M4 12a8 8 0 0 1 13.66-5.66L20 8" />
    <path d="M20 4v4h-4" />
    <path d="M20 12a8 8 0 0 1-13.66 5.66L4 16" />
    <path d="M4 20v-4h4" />
  </IconWrap>
);

export const HomeGymIcon = ({ className = "w-5 h-5" }) => (
  <IconWrap className={className}>
    <path d="M3 10.5 12 4l9 6.5" />
    <path d="M5.5 9.5V19a1 1 0 0 0 1 1H9v-5h6v5h2.5a1 1 0 0 0 1-1V9.5" />
  </IconWrap>
);

export const TrashIcon = () => (
  <IconWrap>
    <path d="M4 7h16" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />
    <path d="M9 7V4h6v3" />
  </IconWrap>
);

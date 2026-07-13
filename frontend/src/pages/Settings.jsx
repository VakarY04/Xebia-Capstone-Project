import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import AppHeader from "../components/AppHeader.jsx";
import {
  CameraIcon,
  ChevronRightIcon,
  LockIcon,
  LogoutIcon,
  TrashIcon,
} from "../components/AppIcons.jsx";
import DashboardLayout from "../components/DashboardLayout.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const resizeImageToBase64 = (file, maxSize = 240) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        if (width > height && width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        } else if (height >= width && height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }

        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = reject;
      img.src = event.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const getDateKey = (value) => new Date(value).toDateString();

const buildDailyLogSummary = (logs) => {
  const grouped = new Map();

  logs.forEach((log) => {
    const key = getDateKey(log.date);
    const current = grouped.get(key) || {
      date: log.date,
      workoutCompleted: false,
    };

    current.date = new Date(log.date) > new Date(current.date) ? log.date : current.date;
    current.workoutCompleted = current.workoutCompleted || Boolean(log.workoutCompleted);
    grouped.set(key, current);
  });

  return [...grouped.values()].sort((a, b) => new Date(a.date) - new Date(b.date));
};

const InfoRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-3 border-b border-slate-100 py-3 last:border-b-0">
    <span className="text-sm text-slate-500">{label}</span>
    <span className="text-right text-sm font-medium text-slate-900">{value || "-"}</span>
  </div>
);

const ActionButton = ({ icon, label, onClick, tone = "default" }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex w-full items-center justify-between rounded-3xl border px-4 py-4 text-left transition ${
      tone === "danger"
        ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
        : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50"
    }`}
  >
    <span className="flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
        {icon}
      </span>
      <span className="text-sm font-medium">{label}</span>
    </span>
    <ChevronRightIcon className="h-4 w-4" />
  </button>
);

const Settings = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [logs, setLogs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [avatarError, setAvatarError] = useState("");

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api
      .get("/logs")
      .then((res) => setLogs(res.data))
      .catch(() => {});
  }, []);

  const summarizedLogs = useMemo(() => buildDailyLogSummary(logs), [logs]);

  const accountStats = useMemo(() => {
    const workoutsCompleted = logs.filter((log) => log.workoutCompleted).length;
    const daysActive = summarizedLogs.length;
    const sorted = [...summarizedLogs].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    let streak = 0;
    for (const entry of sorted) {
      if (!entry.workoutCompleted) {
        break;
      }
      streak += 1;
    }

    return { workoutsCompleted, daysActive, streak };
  }, [logs, summarizedLogs]);

  const bmi = useMemo(() => {
    if (!user?.heightCm || !user?.weightKg) {
      return null;
    }

    const heightMeters = user.heightCm / 100;
    return (user.weightKg / (heightMeters * heightMeters)).toFixed(1);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleAvatarSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setAvatarError("");
    setUploading(true);

    try {
      const base64 = await resizeImageToBase64(file);
      const res = await api.put("/users/avatar", { avatar: base64 });
      updateUser({ avatar: res.data.avatar });
    } catch {
      setAvatarError("Could not upload that image. Please try another file.");
    } finally {
      setUploading(false);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setPwError("");
    setPwSuccess("");

    if (pwForm.newPassword.length < 6) {
      setPwError("New password must be at least 6 characters.");
      return;
    }

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError("New passwords do not match.");
      return;
    }

    setPwSaving(true);

    try {
      await api.put("/users/password", {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwSuccess("Password updated successfully.");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPwError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setPwSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      return;
    }

    setDeleting(true);
    try {
      await api.delete("/users/me");
      logout();
      navigate("/");
    } finally {
      setDeleting(false);
    }
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "-";

  return (
    <DashboardLayout>
      <AppHeader
        title="Settings"
        subtitle="Manage your profile, progress context, and account actions."
      />

      <div className="mt-6 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <section className="app-grid-panel overflow-hidden p-0">
            <div className="h-28 bg-gradient-to-r from-primary via-primary-light to-primary-dark" />
            <div className="px-6 pb-6">
              <div className="-mt-14 flex items-end justify-between gap-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-[30px] border-4 border-white bg-slate-100 text-3xl font-semibold text-slate-700 shadow-lg"
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    user?.name?.[0]?.toUpperCase() || "A"
                  )}
                  <span className="absolute inset-0 flex items-center justify-center bg-slate-950/50 opacity-0 transition group-hover:opacity-100">
                    <CameraIcon />
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/my-details")}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Edit details
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarSelect}
                className="hidden"
              />

              <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">
                {user?.name || "AI FIT User"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {user?.experienceLevel
                  ? `${user.experienceLevel[0].toUpperCase()}${user.experienceLevel.slice(1)} level`
                  : "Profile in progress"}
              </p>

              {avatarError ? (
                <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {avatarError}
                </p>
              ) : null}

              {uploading ? (
                <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                  Uploading avatar...
                </p>
              ) : null}

              <div className="mt-5">
                <InfoRow label="Email" value={user?.email} />
                <InfoRow label="Gender" value={user?.gender} />
                <InfoRow label="Age" value={user?.age} />
                <InfoRow label="Member since" value={memberSince} />
              </div>
            </div>
          </section>

          <section className="app-grid-panel">
            <h2 className="app-section-title">Account Stats</h2>
            <p className="app-section-subtitle">Pulled from your current logs and activity history.</p>
            <div className="mt-6 grid gap-3">
              <div className="app-info-tile flex items-center justify-between">
                <span className="text-sm text-slate-500">Workouts completed</span>
                <span className="text-2xl font-semibold tracking-tight text-slate-950">
                  {accountStats.workoutsCompleted}
                </span>
              </div>
              <div className="app-info-tile flex items-center justify-between">
                <span className="text-sm text-slate-500">Days active</span>
                <span className="text-2xl font-semibold tracking-tight text-slate-950">
                  {accountStats.daysActive}
                </span>
              </div>
              <div className="app-info-tile flex items-center justify-between">
                <span className="text-sm text-slate-500">Current streak</span>
                <span className="text-2xl font-semibold tracking-tight text-slate-950">
                  {accountStats.streak}
                </span>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="app-grid-panel">
            <h2 className="app-section-title">Profile Overview</h2>
            <p className="app-section-subtitle">The fields below drive your plan generation and dashboard recommendations.</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="app-info-tile">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Goal</p>
                <p className="mt-3 text-lg font-semibold text-slate-950">{user?.goal || "-"}</p>
              </div>
              <div className="app-info-tile">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Workout location</p>
                <p className="mt-3 text-lg font-semibold text-slate-950">{user?.workoutLocation || "-"}</p>
              </div>
              <div className="app-info-tile md:col-span-2">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Available days</p>
                <p className="mt-3 text-lg font-semibold text-slate-950">
                  {user?.availableDays?.length ? user.availableDays.join(", ") : "-"}
                </p>
              </div>
              <div className="app-info-tile md:col-span-2">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Injuries or conditions</p>
                <p className="mt-3 text-sm font-medium leading-6 text-slate-700">
                  {user?.injuriesOrConditions || "None recorded"}
                </p>
              </div>
            </div>
          </section>

          <section className="app-grid-panel">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="app-section-title">Body Stats</h2>
                <p className="app-section-subtitle">Keep these updated for more useful recommendations and plan regeneration.</p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/my-details")}
                className="text-sm font-semibold text-primary transition hover:text-primary-dark"
              >
                Update
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="app-info-tile">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Height</p>
                <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                  {user?.heightCm ? `${user.heightCm} cm` : "-"}
                </p>
              </div>
              <div className="app-info-tile">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Weight</p>
                <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                  {user?.weightKg ? `${user.weightKg} kg` : "-"}
                </p>
              </div>
              <div className="app-info-tile">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">BMI</p>
                <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                  {bmi || "-"}
                </p>
              </div>
              <div className="app-info-tile">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Onboarding</p>
                <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                  {user?.onboardingComplete ? "Done" : "Pending"}
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="app-grid-panel">
            <h2 className="app-section-title">Account Actions</h2>
            <p className="app-section-subtitle">Security and session management stay here.</p>
            <div className="mt-6 space-y-3">
              <ActionButton
                icon={<LockIcon />}
                label="Change password"
                onClick={() => {
                  setShowPasswordForm((value) => !value);
                  setPwError("");
                  setPwSuccess("");
                }}
              />
              <ActionButton icon={<LogoutIcon />} label="Log out" onClick={handleLogout} />
            </div>

            {showPasswordForm ? (
              <form onSubmit={handleChangePassword} className="mt-4 space-y-3 rounded-[28px] bg-slate-50 p-4">
                {pwError ? (
                  <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                    {pwError}
                  </div>
                ) : null}
                {pwSuccess ? (
                  <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
                    {pwSuccess}
                  </div>
                ) : null}
                <input
                  type="password"
                  placeholder="Current password"
                  value={pwForm.currentPassword}
                  onChange={(event) =>
                    setPwForm({ ...pwForm, currentPassword: event.target.value })
                  }
                  className="input-field-light w-full px-4 py-3"
                  required
                />
                <input
                  type="password"
                  placeholder="New password"
                  value={pwForm.newPassword}
                  onChange={(event) =>
                    setPwForm({ ...pwForm, newPassword: event.target.value })
                  }
                  className="input-field-light w-full px-4 py-3"
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={pwForm.confirmPassword}
                  onChange={(event) =>
                    setPwForm({ ...pwForm, confirmPassword: event.target.value })
                  }
                  className="input-field-light w-full px-4 py-3"
                  required
                />
                <button type="submit" disabled={pwSaving} className="btn-primary w-full">
                  {pwSaving ? "Updating..." : "Update Password"}
                </button>
              </form>
            ) : null}
          </section>

          <section className="app-grid-panel border border-red-100">
            <h2 className="app-section-title">Danger Zone</h2>
            <p className="app-section-subtitle">Permanent actions are isolated here to avoid mistakes.</p>
            {!showDeleteConfirm ? (
              <div className="mt-6">
                <ActionButton
                  icon={<TrashIcon />}
                  label="Delete account"
                  onClick={() => setShowDeleteConfirm(true)}
                  tone="danger"
                />
              </div>
            ) : (
              <div className="mt-6 rounded-[28px] border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-medium text-red-700">
                  This deletes your account, plans, and logs permanently. Type DELETE to confirm.
                </p>
                <input
                  value={deleteConfirmText}
                  onChange={(event) => setDeleteConfirmText(event.target.value)}
                  placeholder="DELETE"
                  className="input-field-light mt-4 w-full px-4 py-3"
                />
                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmText !== "DELETE" || deleting}
                    className="inline-flex flex-1 items-center justify-center rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deleting ? "Deleting..." : "Permanently Delete"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteConfirmText("");
                    }}
                    className="inline-flex flex-1 items-center justify-center rounded-2xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;


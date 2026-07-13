import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import AppHeader from "../components/AppHeader.jsx";
import { CameraIcon } from "../components/AppIcons.jsx";
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

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [avatarError, setAvatarError] = useState("");

  const handleAvatarSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

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

  return (
    <DashboardLayout>
      <AppHeader
        title="Profile"
        subtitle="Your identity, body context, and quick account links in one place."
      />

      <div className="mt-6 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
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
              <button type="button" onClick={() => navigate("/settings")} className="btn-primary">
                Open settings
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarSelect}
              className="hidden"
            />

            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">{user?.name || "AI FIT User"}</h2>
            <p className="mt-1 text-sm font-medium text-slate-600">{user?.email}</p>

            {uploading ? (
              <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">Uploading avatar...</p>
            ) : null}
            {avatarError ? (
              <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{avatarError}</p>
            ) : null}

            <div className="mt-6 grid gap-3">
              <div className="app-info-tile flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Gender</span>
                <span className="text-sm font-semibold text-slate-900">{user?.gender || "-"}</span>
              </div>
              <div className="app-info-tile flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Age</span>
                <span className="text-sm font-semibold text-slate-900">{user?.age || "-"}</span>
              </div>
              <div className="app-info-tile flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Height</span>
                <span className="text-sm font-semibold text-slate-900">{user?.heightCm ? `${user.heightCm} cm` : "-"}</span>
              </div>
              <div className="app-info-tile flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Weight</span>
                <span className="text-sm font-semibold text-slate-900">{user?.weightKg ? `${user.weightKg} kg` : "-"}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="app-grid-panel">
            <h2 className="app-section-title">Plan Inputs</h2>
            <p className="app-section-subtitle">These details shape the workouts, meals, and recovery days generated for you.</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="app-info-tile">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Goal</p>
                <p className="mt-3 text-lg font-semibold text-slate-950">{user?.goal || "-"}</p>
              </div>
              <div className="app-info-tile">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Experience</p>
                <p className="mt-3 text-lg font-semibold text-slate-950">{user?.experienceLevel || "-"}</p>
              </div>
              <div className="app-info-tile md:col-span-2">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Available days</p>
                <p className="mt-3 text-sm font-medium text-slate-700">
                  {user?.availableDays?.length ? user.availableDays.join(", ") : "-"}
                </p>
              </div>
              <div className="app-info-tile md:col-span-2">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Injuries or conditions</p>
                <p className="mt-3 text-sm font-medium text-slate-700">
                  {user?.injuriesOrConditions || "None recorded"}
                </p>
              </div>
            </div>
          </div>

          <div className="app-grid-panel">
            <h2 className="app-section-title">Quick Links</h2>
            <p className="app-section-subtitle">Jump straight into the places that update the profile and the generated plan.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={() => navigate("/my-details")} className="btn-primary">
                Edit My Details
              </button>
              <button type="button" onClick={() => navigate("/meal-plan")} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                Open Workout and Meals
              </button>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Profile;


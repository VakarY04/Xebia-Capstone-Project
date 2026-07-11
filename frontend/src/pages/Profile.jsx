import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
import DashboardLayout from "../components/DashboardLayout.jsx";

// Resizes/compresses an image file in the browser before we ever send it to
// the backend, so avatars stay small (a few KB) even from a large photo.
const resizeImageToBase64 = (file, maxSize = 240) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [avatarError, setAvatarError] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleAvatarSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarError("");
    setUploading(true);
    try {
      const base64 = await resizeImageToBase64(file);
      const res = await api.put("/users/avatar", { avatar: base64 });
      updateUser({ avatar: res.data.avatar });
    } catch (err) {
      setAvatarError("Couldn't upload that image. Try a different one.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") return;
    setDeleting(true);
    try {
      await api.delete("/users/me");
      logout();
      navigate("/");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold text-white mb-1">Profile</h2>
      <p className="text-slate-400 mb-8 text-sm">
        Your account details and settings.
      </p>

      <div className="max-w-lg bg-dark-card border border-white/10 rounded-2xl p-6 flex flex-col gap-5">
        {/* Avatar + name */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary flex items-center justify-center text-2xl font-bold text-primary bg-primary/20 hover:opacity-80 transition group"
            title="Change profile picture"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              user?.name?.[0]?.toUpperCase() || "?"
            )}
            <span className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-white transition">
              {uploading ? "..." : "Edit"}
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarSelect}
            className="hidden"
          />
          <div>
            <p className="text-white font-semibold text-lg">{user?.name}</p>
            <p className="text-slate-400 text-sm">{user?.email}</p>
          </div>
        </div>
        {avatarError && (
          <p className="text-red-400 text-xs -mt-3">{avatarError}</p>
        )}

        <div className="border-t border-white/10 pt-5">
          <p className="text-slate-400 text-sm mb-1">Onboarding status</p>
          <p className="text-white">
            {user?.onboardingComplete ? "✅ Complete" : "⏳ Incomplete"}
          </p>
        </div>

        <div className="border-t border-white/10 pt-5">
          <p className="text-slate-400 text-sm mb-3">Manage</p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate("/my-details")}
              className="text-left px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 hover:translate-x-1 text-white text-sm transition-all"
            >
              📝 Edit my details & preferences
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-left px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 hover:translate-x-1 text-white text-sm transition-all"
            >
              🔄 Regenerate my plan
            </button>
          </div>
        </div>

        <div className="border-t border-white/10 pt-5">
          <button
            onClick={handleLogout}
            className="px-4 py-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium transition"
          >
            🚪 Log out
          </button>
        </div>

        {/* Danger zone */}
        <div className="border-t border-red-500/20 pt-5">
          <p className="text-red-400 text-sm font-semibold mb-2">
            Danger Zone
          </p>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-3 rounded-lg border border-red-500/40 hover:bg-red-500/10 text-red-400 text-sm font-medium transition"
            >
              🗑️ Delete Account
            </button>
          ) : (
            <div className="bg-red-500/5 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-300 text-sm mb-3">
                This permanently deletes your account, your onboarding
                details, your plans, and all logs. This cannot be undone.
                Type <strong>DELETE</strong> to confirm.
              </p>
              <input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="input-field w-full mb-3 px-3 py-2 rounded-lg text-sm"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== "DELETE" || deleting}
                  className="bg-red-500 hover:bg-red-600 disabled:opacity-40 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                >
                  {deleting ? "Deleting..." : "Permanently Delete"}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText("");
                  }}
                  className="text-slate-400 hover:text-white text-sm px-4 py-2 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;

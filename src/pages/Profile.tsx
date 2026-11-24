import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { User, Star, Heart, Bookmark, Settings, LogOut, Edit, Camera } from "lucide-react";

const font = "'Share Tech Mono', monospace";

const FACTION_LABELS: Record<string, string> = {
  jedi: "Jedi Order",
  sith: "Sith Empire",
  rebel: "Rebel Alliance",
  empire: "Galactic Empire",
  mandalorian: "Mandalorian Clans",
  neutral: "Neutral / Independent",
};

const FACTION_COLORS: Record<string, { primary: string; secondary: string }> = {
  jedi: { primary: "#3b82f6", secondary: "#dbeafe" },
  sith: { primary: "#ef4444", secondary: "#fef2f2" },
  rebel: { primary: "#eab308", secondary: "#fef9c3" },
  empire: { primary: "#6b7280", secondary: "#f3f4f6" },
  mandalorian: { primary: "#14b8a6", secondary: "#ccfbf1" },
  neutral: { primary: "#0d9488", secondary: "#ccfbf1" },
};

export default function ProfilePage() {
  const { user, session, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "favorites" | "reviews" | "settings">("overview");
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.name || "",
    bio: "",
    faction: user?.faction || "neutral",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.name || "",
        bio: user.bio || "",
        faction: user.faction || "neutral",
      });
    }
  }, [user]);

  const handleSave = async () => {
    // TODO: Call API to update profile
    setEditing(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const factionColors = FACTION_COLORS[formData.faction] || FACTION_COLORS.neutral;

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--background)", fontFamily: font }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center", color: "var(--muted-foreground)" }}
        >
          <User style={{ width: 64, height: 64, margin: "0 auto 16px", opacity: 0.5 }} />
          <p style={{ fontSize: 16, textTransform: "uppercase", letterSpacing: "0.1em" }}>NO ACTIVE SESSION</p>
          <p style={{ fontSize: 12, marginTop: 8 }}>PLEASE ESTABLISH TERMINAL LINK</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", fontFamily: font }}>
      {/* Header */}
      <div
        style={{
          background: `linear-gradient(180deg, ${factionColors.primary}20 0%, transparent 100%)`,
          borderBottom: "1px solid var(--border)",
          padding: "32px 24px",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", gap: 24, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ position: "relative", width: 120, height: 120, flexShrink: 0 }}>
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: `3px solid ${factionColors.primary}` }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${factionColors.primary} 0%, ${factionColors.secondary} 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 40,
                  fontWeight: "bold",
                  color: "white",
                  textTransform: "uppercase",
                  border: `3px solid ${factionColors.primary}`,
                }}
              >
                {user.name?.charAt(0).toUpperCase() || "?"}
              </div>
            )}
            {editing && (
              <button
                onClick={() => {}}
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "var(--primary)",
                  border: "2px solid var(--background)",
                  color: "var(--primary-foreground)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Camera style={{ width: 18, height: 18 }} />
              </button>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <h1 style={{ fontSize: 32, color: "var(--foreground)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {user.name}
              </h1>
              {editing && (
                <button
                  onClick={() => setEditing(false)}
                  style={{ padding: "6px 12px", background: "var(--muted)", border: "1px solid var(--border)", color: "var(--foreground)", fontFamily: font, fontSize: 10, cursor: "pointer" }}
                >
                  CANCEL
                </button>
              )}
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  style={{ padding: "6px 12px", background: "transparent", border: "1px solid var(--border)", color: "var(--primary)", fontFamily: font, fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                >
                  <Edit style={{ width: 12, height: 12 }} /> EDIT
                </button>
              )}
            </div>
            <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span
                style={{
                  padding: "4px 12px",
                  background: factionColors.primary,
                  color: "white",
                  borderRadius: 9999,
                  fontSize: 10,
                  fontFamily: font,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                {FACTION_LABELS[formData.faction]}
              </span>
              <span style={{ fontSize: 11, color: "var(--muted-foreground)", fontFamily: font }}>
                RECRUITED: {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "UNKNOWN"}
              </span>
              {session && (
                <span style={{ fontSize: 11, color: "var(--muted-foreground)", fontFamily: font }}>
                  SESSION EXPIRES: {new Date(session.expiresAt).toLocaleDateString()}
                </span>
              )}
            </div>
            {formData.bio && (
              <p style={{ marginTop: 12, fontSize: 13, color: "var(--foreground)", lineHeight: 1.6, maxWidth: 500 }}>
                {formData.bio}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ borderBottom: "1px solid var(--border)", background: "var(--card)", position: "sticky", top: 0, zIndex: 10 }}>
        <nav style={{ maxWidth: 900, margin: "0 auto", display: "flex", gap: 4, padding: "0 24px" }}>
          {[
            { id: "overview", label: "OVERVIEW", icon: User },
            { id: "favorites", label: "FAVORITES", icon: Heart },
            { id: "reviews", label: "REVIEWS", icon: Star },
            { id: "settings", label: "SETTINGS", icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              style={{
                padding: "14px 20px",
                background: activeTab === tab.id ? "var(--primary)" : "transparent",
                border: "none",
                borderBottom: activeTab === tab.id ? `2px solid var(--primary)` : "2px solid transparent",
                color: activeTab === tab.id ? "var(--primary-foreground)" : "var(--muted-foreground)",
                fontFamily: font,
                fontSize: 10,
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.2s",
              }}
            >
              <tab.icon style={{ width: 14, height: 14 }} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <OverviewTab user={user} factionColors={factionColors} />
            </motion.div>
          )}
          {activeTab === "favorites" && (
            <motion.div key="favorites" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <FavoritesTab userId={user.id} />
            </motion.div>
          )}
          {activeTab === "reviews" && (
            <motion.div key="reviews" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <ReviewsTab userId={user.id} />
            </motion.div>
          )}
          {activeTab === "settings" && (
            <motion.div key="settings" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <SettingsTab user={user} formData={formData} setFormData={setFormData} editing={editing} onSave={handleSave} onSignOut={handleSignOut} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function OverviewTab({ user, factionColors }: { user: any; factionColors: { primary: string; secondary: string } }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
      <StatCard label="RANK" value="RECRUIT" icon={Star} color={factionColors.primary} />
      <StatCard label="XP" value="0" icon={Bookmark} color={factionColors.primary} />
      <StatCard label="REVIEWS" value="0" icon={Star} color={factionColors.primary} />
      <StatCard label="FAVORITES" value="0" icon={Heart} color={factionColors.primary} />
    </div>
  );
}

function FavoritesTab({ userId }: { userId: string }) {
  return (
    <div style={{ textAlign: "center", padding: 60, color: "var(--muted-foreground)" }}>
      <Heart style={{ width: 48, height: 48, margin: "0 auto 16px", opacity: 0.5 }} />
      <h3 style={{ fontSize: 16, color: "var(--foreground)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
        NO FAVORITES LOGGED
      </h3>
      <p style={{ fontSize: 12, maxWidth: 300, margin: "0 auto" }}>
        MARK PLANETS, FILMS, AND CHARACTERS AS FAVORITES TO SEE THEM HERE
      </p>
    </div>
  );
}

function ReviewsTab({ userId }: { userId: string }) {
  return (
    <div style={{ textAlign: "center", padding: 60, color: "var(--muted-foreground)" }}>
      <Star style={{ width: 48, height: 48, margin: "0 auto 16px", opacity: 0.5 }} />
      <h3 style={{ fontSize: 16, color: "var(--foreground)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
        NO REVIEWS SUBMITTED
      </h3>
      <p style={{ fontSize: 12, maxWidth: 300, margin: "0 auto" }}>
        WRITE REVIEWS FOR PLANETS, FILMS, AND CHARACTERS TO BUILD YOUR DOSSIER
      </p>
    </div>
  );
}

function SettingsTab({
  user,
  formData,
  setFormData,
  editing,
  onSave,
  onSignOut,
}: {
  user: any;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  editing: boolean;
  onSave: () => void;
  onSignOut: () => void;
}) {
  return (
    <div style={{ maxWidth: 600 }}>
      <section style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 11, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 16, borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>
          PROFILE SETTINGS
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 10, color: "var(--muted-foreground)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              DISPLAY NAME
            </label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              disabled={!editing}
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "var(--muted)",
                border: "1px solid var(--border)",
                borderRadius: 4,
                color: "var(--foreground)",
                fontFamily: font,
                fontSize: 13,
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 10, color: "var(--muted-foreground)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              BIO
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              disabled={!editing}
              rows={4}
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "var(--muted)",
                border: "1px solid var(--border)",
                borderRadius: 4,
                color: "var(--foreground)",
                fontFamily: font,
                fontSize: 13,
                resize: "vertical",
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 10, color: "var(--muted-foreground)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              FACTION ALLEGIANCE
            </label>
            <select
              value={formData.faction}
              onChange={(e) => setFormData({ ...formData, faction: e.target.value })}
              disabled={!editing}
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "var(--muted)",
                border: "1px solid var(--border)",
                borderRadius: 4,
                color: "var(--foreground)",
                fontFamily: font,
                fontSize: 13,
              }}
            >
              <option value="jedi">Jedi Order</option>
              <option value="sith">Sith Empire</option>
              <option value="rebel">Rebel Alliance</option>
              <option value="empire">Galactic Empire</option>
              <option value="mandalorian">Mandalorian Clans</option>
              <option value="neutral">Neutral / Independent</option>
            </select>
          </div>
          {editing && (
            <button onClick={onSave} style={{ padding: "12px", background: "var(--primary)", color: "var(--primary-foreground)", border: "none", borderRadius: 4, fontFamily: font, fontSize: 11, fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer", alignSelf: "flex-start" }}>
              SAVE CHANGES
            </button>
          )}
        </div>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 11, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 16, borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>
          ACCOUNT
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", background: "var(--muted)", border: "1px solid var(--border)", borderRadius: 4 }}>
            <div>
              <p style={{ fontSize: 10, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>EMAIL</p>
              <p style={{ fontSize: 13, color: "var(--foreground)", fontFamily: font }}>{user.email}</p>
            </div>
            <span style={{ fontSize: 10, color: "var(--muted-foreground)", fontFamily: font }}>VERIFIED</span>
          </div>
          <button
            onClick={onSignOut}
            style={{
              padding: "12px 16px",
              background: "transparent",
              border: "1px solid #ef4444",
              color: "#ef4444",
              borderRadius: 4,
              fontFamily: font,
              fontSize: 11,
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              width: "fit-content",
            }}
          >
            <LogOut style={{ width: 14, height: 14 }} /> SIGN OUT
          </button>
        </div>
      </section>

      <section>
        <h3 style={{ fontSize: 11, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 16, borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>
          DANGER ZONE
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", background: "var(--muted)", border: "1px solid var(--border)", borderRadius: 4 }}>
            <div>
              <p style={{ fontSize: 10, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>DELETE ACCOUNT</p>
              <p style={{ fontSize: 12, color: "var(--foreground)", fontFamily: font }}>PERMANENTLY REMOVE ALL YOUR DATA</p>
            </div>
            <button style={{ padding: "8px 16px", background: "transparent", border: "1px solid #ef4444", color: "#ef4444", borderRadius: 4, fontFamily: font, fontSize: 10, cursor: "pointer" }}>
              DELETE
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: React.ComponentType<any>; color: string }) {
  return (
    <div
      style={{
        padding: "24px",
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        borderTop: `3px solid ${color}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <Icon style={{ width: 18, height: 18, color }} />
        <span style={{ fontSize: 9, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.15em" }}>
          {label}
        </span>
      </div>
      <div style={{ fontSize: 32, color: "var(--foreground)", fontWeight: "bold", fontFamily: font, lineHeight: 1 }}>
        {value}
      </div>
    </div>
  );
}
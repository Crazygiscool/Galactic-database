import { pgTable, text, timestamp, boolean, integer, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { userTable } from "./auth";

export const userProfilesTable = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique().references(() => userTable.id, { onDelete: "cascade" }),
  username: text("username").notNull().unique(),
  displayName: text("display_name"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  bannerUrl: text("banner_url"),
  faction: text("faction", { enum: ["jedi", "sith", "rebel", "empire", "mandalorian", "neutral"] }).notNull().default("neutral"),
  joinDate: timestamp("join_date").notNull().defaultNow(),
  xp: integer("xp").notNull().default(0),
  level: integer("level").notNull().default(1),
  titleId: text("title_id"),
  settingsJson: text("settings_json").default("{}"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserProfileSchema = createInsertSchema(userProfilesTable).omit({ id: true, createdAt: true, updatedAt: true, joinDate: true, xp: true, level: true });
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfilesTable.$inferSelect;

// Faction type for UI
export type Faction = "jedi" | "sith" | "rebel" | "empire" | "mandalorian" | "neutral";

export const FACTION_LABELS: Record<Faction, string> = {
  jedi: "Jedi Order",
  sith: "Sith Empire",
  rebel: "Rebel Alliance",
  empire: "Galactic Empire",
  mandalorian: "Mandalorian Clans",
  neutral: "Neutral / Independent",
};

export const FACTION_COLORS: Record<Faction, { primary: string; secondary: string }> = {
  jedi: { primary: "#3b82f6", secondary: "#dbeafe" },      // Blue
  sith: { primary: "#ef4444", secondary: "#fef2f2" },       // Red
  rebel: { primary: "#eab308", secondary: "#fef9c3" },      // Yellow/Gold
  empire: { primary: "#6b7280", secondary: "#f3f4f6" },     // Gray
  mandalorian: { primary: "#14b8a6", secondary: "#ccfbf1" }, // Teal
  neutral: { primary: "#0d9488", secondary: "#ccfbf1" },    // Original cyan
};
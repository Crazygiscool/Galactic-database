import { pgTable, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const customPlanetsTable = pgTable("custom_planets", {
  id: serial("id").primaryKey(),
  planetId: text("planet_id").notNull().unique(),
  customNotes: text("custom_notes"),
  userRating: integer("user_rating"),
  isFavorite: boolean("is_favorite").notNull().default(false),
  customImage: text("custom_image"),
  tags: text("tags"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCustomPlanetSchema = createInsertSchema(customPlanetsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCustomPlanet = z.infer<typeof insertCustomPlanetSchema>;
export type CustomPlanet = typeof customPlanetsTable.$inferSelect;

export const customFilmsTable = pgTable("custom_films", {
  id: serial("id").primaryKey(),
  filmId: text("film_id").notNull().unique(),
  customNotes: text("custom_notes"),
  userRating: integer("user_rating"),
  isFavorite: boolean("is_favorite").notNull().default(false),
  watchedCount: integer("watched_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCustomFilmSchema = createInsertSchema(customFilmsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCustomFilm = z.infer<typeof insertCustomFilmSchema>;
export type CustomFilm = typeof customFilmsTable.$inferSelect;

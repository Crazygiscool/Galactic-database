import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { customPlanetsTable, customFilmsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

// GET /api/custom/planets - List custom planet data
router.get("/planets", async (req, res) => {
  try {
    const planetId = req.query.planetId as string;
    
    if (planetId) {
      // Get single planet's custom data
      const result = await db.select().from(customPlanetsTable)
        .where(eq(customPlanetsTable.planetId, planetId))
        .limit(1);
      res.json(result[0] || null);
    } else {
      // List all custom planet data
      const result = await db.select().from(customPlanetsTable);
      res.json(result);
    }
  } catch (error) {
    console.error("[API] Error fetching custom planets:", error);
    res.status(500).json({ error: "Failed to fetch custom planet data" });
  }
});

// POST /api/custom/planets - Create/update custom planet data
router.post("/planets", async (req, res) => {
  try {
    const { planetId, customNotes, userRating, isFavorite, customImage, tags } = req.body;
    
    if (!planetId) {
      return res.status(400).json({ error: "planetId is required" });
    }

    // Upsert (update if exists, insert if not)
    const existing = await db.select().from(customPlanetsTable)
      .where(eq(customPlanetsTable.planetId, planetId))
      .limit(1);

    if (existing.length > 0) {
      // Update
      const updated = await db.update(customPlanetsTable)
        .set({
          customNotes,
          userRating,
          isFavorite,
          customImage,
          tags,
          updatedAt: new Date(),
        })
        .where(eq(customPlanetsTable.planetId, planetId))
        .returning();
      res.json(updated[0]);
    } else {
      // Insert
      const inserted = await db.insert(customPlanetsTable)
        .values({
          planetId,
          customNotes,
          userRating,
          isFavorite,
          customImage,
          tags,
        })
        .returning();
      res.json(inserted[0]);
    }
  } catch (error) {
    console.error("[API] Error saving custom planet:", error);
    res.status(500).json({ error: "Failed to save custom planet data" });
  }
});

// GET /api/custom/films - List custom film data
router.get("/films", async (req, res) => {
  try {
    const filmId = req.query.filmId as string;
    
    if (filmId) {
      const result = await db.select().from(customFilmsTable)
        .where(eq(customFilmsTable.filmId, filmId))
        .limit(1);
      res.json(result[0] || null);
    } else {
      const result = await db.select().from(customFilmsTable);
      res.json(result);
    }
  } catch (error) {
    console.error("[API] Error fetching custom films:", error);
    res.status(500).json({ error: "Failed to fetch custom film data" });
  }
});

// POST /api/custom/films - Create/update custom film data
router.post("/films", async (req, res) => {
  try {
    const { filmId, customNotes, userRating, isFavorite, watchedCount } = req.body;
    
    if (!filmId) {
      return res.status(400).json({ error: "filmId is required" });
    }

    const existing = await db.select().from(customFilmsTable)
      .where(eq(customFilmsTable.filmId, filmId))
      .limit(1);

    if (existing.length > 0) {
      const updated = await db.update(customFilmsTable)
        .set({
          customNotes,
          userRating,
          isFavorite,
          watchedCount,
          updatedAt: new Date(),
        })
        .where(eq(customFilmsTable.filmId, filmId))
        .returning();
      res.json(updated[0]);
    } else {
      const inserted = await db.insert(customFilmsTable)
        .values({
          filmId,
          customNotes,
          userRating,
          isFavorite,
          watchedCount,
        })
        .returning();
      res.json(inserted[0]);
    }
  } catch (error) {
    console.error("[API] Error saving custom film:", error);
    res.status(500).json({ error: "Failed to save custom film data" });
  }
});

export default router;

import { Router, type IRouter, type Request, type Response } from "express";
import { auth } from "@workspace/db/auth";
import { toNodeHandler } from "better-auth/node";

const router: IRouter = Router();

// Better Auth handler for all auth routes
const authHandler = toNodeHandler(auth);

// Handle all auth routes
router.all("/auth/*", (req: Request, res: Response) => {
  return authHandler(req, res);
});

// Additional helper endpoints
router.get("/auth/session", async (req: Request, res: Response) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });
    res.json(session);
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
});

router.post("/auth/sign-out", async (req: Request, res: Response) => {
  try {
    await auth.api.signOut({
      headers: req.headers as any,
    });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: "Failed to sign out" });
  }
});

export default router;
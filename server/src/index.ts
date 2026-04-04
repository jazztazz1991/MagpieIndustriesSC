import "dotenv/config";
import express from "express";
import cors from "cors";
import { healthRouter } from "./routes/health.js";
import { authRouter } from "./routes/auth.js";
import { friendsRouter } from "./routes/friends.js";
import { eventsRouter } from "./routes/events.js";
import { groupsRouter } from "./routes/groups.js";
import { activityRouter } from "./routes/activity.js";
import { commentsRouter } from "./routes/comments.js";
import { orgsRouter } from "./routes/orgs.js";
import { fleetRouter } from "./routes/fleet.js";
import { operationsRouter } from "./routes/operations.js";
import { treasuryRouter } from "./routes/treasury.js";
import { recruitmentRouter } from "./routes/recruitment.js";
import { orgGuidesRouter } from "./routes/org-guides.js";
import { orgAnnouncementsRouter } from "./routes/org-announcements.js";
import { orgActivityRouter } from "./routes/org-activity.js";
import { adminRouter } from "./routes/admin.js";
import { reportsRouter } from "./routes/reports.js";
import { suggestionsRouter } from "./routes/suggestions.js";
import { craftRecipesRouter } from "./routes/craft-recipes.js";
import { missionRecipesRouter } from "./routes/mission-recipes.js";
import { gameDataRouter } from "./routes/game-data.js";
import { inventoryNotesRouter } from "./routes/inventory-notes.js";
import { wikeloRouter } from "./routes/wikelo.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());

// Routes
app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/friends", friendsRouter);
app.use("/api/events", eventsRouter);
app.use("/api/groups", groupsRouter);
app.use("/api/activity", activityRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/orgs", orgsRouter);
app.use("/api/orgs/:orgId/fleet", fleetRouter);
app.use("/api/orgs/:orgId/operations", operationsRouter);
app.use("/api/orgs/:orgId/treasury", treasuryRouter);
app.use("/api/recruitment", recruitmentRouter);
app.use("/api/orgs/:orgId/guides", orgGuidesRouter);
app.use("/api/orgs/:orgId/announcements", orgAnnouncementsRouter);
app.use("/api/orgs/:orgId/activity", orgActivityRouter);
app.use("/api/admin", adminRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/suggestions", suggestionsRouter);
app.use("/api/craft-recipes", craftRecipesRouter);
app.use("/api/mission-recipes", missionRecipesRouter);
app.use("/api/game-data", gameDataRouter);
app.use("/api/inventory-notes", inventoryNotesRouter);
app.use("/api/wikelo", wikeloRouter);

app.listen(PORT, () => {
  console.log(`[server] Running on http://localhost:${PORT}`);
});
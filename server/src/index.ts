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

app.listen(PORT, () => {
  console.log(`[server] Running on http://localhost:${PORT}`);
});

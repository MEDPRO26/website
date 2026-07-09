import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "rental ending reminders",
  { hourUTC: 8, minuteUTC: 0 },
  internal.rentalReminders.checkEndingRentals
);

crons.interval(
  "expire stale supplier assignments",
  { minutes: 1 },
  internal.supplierTimeouts.expireStaleAssignments
);

crons.interval(
  "cleanup stale presence sessions",
  { hours: 1 },
  internal.presence.cleanupStaleSessions
);

export default crons;

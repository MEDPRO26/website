import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "rental ending reminders",
  { hourUTC: 8, minuteUTC: 0 },
  internal.rentalReminders.checkEndingRentals
);

export default crons;

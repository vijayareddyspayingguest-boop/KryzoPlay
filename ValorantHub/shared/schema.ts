import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const tournaments = pgTable("tournaments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("upcoming"),
  prizePool: text("prize_pool").notNull(),
  entryFee: integer("entry_fee").notNull().default(0),
  maxParticipants: integer("max_participants").notNull(),
  currentParticipants: integer("current_participants").notNull().default(0),
  format: text("format").notNull(),
  rules: text("rules").array().notNull().default(sql`ARRAY[]::text[]`),
  schedule: text("schedule").notNull(),
  prizeDistribution: text("prize_distribution").notNull(),
});

export const insertTournamentSchema = createInsertSchema(tournaments).omit({
  id: true,
  currentParticipants: true,
});

export type InsertTournament = z.infer<typeof insertTournamentSchema>;
export type Tournament = typeof tournaments.$inferSelect;

export const teams = pgTable("teams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  tag: text("tag").notNull(),
  captainId: varchar("captain_id").notNull().references(() => users.id),
  tournamentsEntered: integer("tournaments_entered").notNull().default(0),
  tournamentsWon: integer("tournaments_won").notNull().default(0),
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
  tournamentsEntered: true,
  tournamentsWon: true,
});

export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Team = typeof teams.$inferSelect;

export const teamMembers = pgTable("team_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  teamId: varchar("team_id").notNull().references(() => teams.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  role: text("role").notNull().default("member"),
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  id: true,
});

export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;

export const tournamentRegistrations = pgTable("tournament_registrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tournamentId: varchar("tournament_id").notNull().references(() => tournaments.id),
  teamId: varchar("team_id").references(() => teams.id),
  userId: varchar("user_id").references(() => users.id),
  registeredAt: timestamp("registered_at").notNull().defaultNow(),
});

export const insertTournamentRegistrationSchema = createInsertSchema(tournamentRegistrations).omit({
  id: true,
  registeredAt: true,
});

export type InsertTournamentRegistration = z.infer<typeof insertTournamentRegistrationSchema>;
export type TournamentRegistration = typeof tournamentRegistrations.$inferSelect;

export const matches = pgTable("matches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tournamentId: varchar("tournament_id").notNull().references(() => tournaments.id),
  round: integer("round").notNull(),
  position: integer("position").notNull(),
  team1Id: varchar("team1_id").references(() => teams.id),
  team2Id: varchar("team2_id").references(() => teams.id),
  team1Score: integer("team1_score"),
  team2Score: integer("team2_score"),
  winnerId: varchar("winner_id").references(() => teams.id),
  status: text("status").notNull().default("pending"),
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
});

export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type Match = typeof matches.$inferSelect;

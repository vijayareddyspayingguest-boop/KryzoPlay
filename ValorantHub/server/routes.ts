import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertTournamentSchema,
  insertTeamSchema,
  insertTournamentRegistrationSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Tournament routes
  app.get("/api/tournaments", async (req, res) => {
    try {
      const tournaments = await storage.getTournaments();
      res.json(tournaments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tournaments" });
    }
  });

  app.get("/api/tournaments/:id", async (req, res) => {
    try {
      const tournament = await storage.getTournament(req.params.id);
      if (!tournament) {
        return res.status(404).json({ error: "Tournament not found" });
      }
      res.json(tournament);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tournament" });
    }
  });

  app.post("/api/tournaments", async (req, res) => {
    try {
      const validatedData = insertTournamentSchema.parse(req.body);
      const tournament = await storage.createTournament(validatedData);
      res.status(201).json(tournament);
    } catch (error) {
      res.status(400).json({ error: "Invalid tournament data" });
    }
  });

  // Tournament registration routes
  app.get("/api/tournaments/:id/registrations", async (req, res) => {
    try {
      const registrations = await storage.getTournamentRegistrations(req.params.id);
      res.json(registrations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch registrations" });
    }
  });

  app.post("/api/tournaments/:id/register", async (req, res) => {
    try {
      const validatedData = insertTournamentRegistrationSchema.parse({
        tournamentId: req.params.id,
        ...req.body
      });
      const registration = await storage.registerForTournament(validatedData);
      res.status(201).json(registration);
    } catch (error) {
      res.status(400).json({ error: "Failed to register for tournament" });
    }
  });

  app.delete("/api/tournaments/:tournamentId/unregister/:userId", async (req, res) => {
    try {
      const success = await storage.unregisterFromTournament(
        req.params.tournamentId,
        req.params.userId
      );
      if (!success) {
        return res.status(404).json({ error: "Registration not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to unregister from tournament" });
    }
  });

  // Match routes
  app.get("/api/tournaments/:id/matches", async (req, res) => {
    try {
      const matches = await storage.getMatches(req.params.id);
      res.json(matches);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch matches" });
    }
  });

  // Team routes
  app.get("/api/teams", async (req, res) => {
    try {
      const { userId } = req.query;
      if (userId && typeof userId === "string") {
        const teams = await storage.getTeamsByUser(userId);
        return res.json(teams);
      }
      const teams = await storage.getTeams();
      res.json(teams);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch teams" });
    }
  });

  app.get("/api/teams/:id", async (req, res) => {
    try {
      const team = await storage.getTeam(req.params.id);
      if (!team) {
        return res.status(404).json({ error: "Team not found" });
      }
      res.json(team);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch team" });
    }
  });

  app.post("/api/teams", async (req, res) => {
    try {
      const validatedData = insertTeamSchema.parse(req.body);
      const team = await storage.createTeam(validatedData);
      res.status(201).json(team);
    } catch (error) {
      res.status(400).json({ error: "Invalid team data" });
    }
  });

  app.delete("/api/teams/:id", async (req, res) => {
    try {
      const success = await storage.deleteTeam(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Team not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete team" });
    }
  });

  // Team member routes
  app.get("/api/teams/:id/members", async (req, res) => {
    try {
      const members = await storage.getTeamMembers(req.params.id);
      
      const membersWithDetails = await Promise.all(
        members.map(async (member) => {
          const user = await storage.getUser(member.userId);
          return {
            ...member,
            username: user?.username || "Unknown"
          };
        })
      );
      
      res.json(membersWithDetails);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch team members" });
    }
  });

  app.delete("/api/teams/:teamId/members/:userId", async (req, res) => {
    try {
      const success = await storage.removeTeamMember(
        req.params.teamId,
        req.params.userId
      );
      if (!success) {
        return res.status(404).json({ error: "Team member not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove team member" });
    }
  });

  // User registration routes
  app.get("/api/users/:userId/registrations", async (req, res) => {
    try {
      const registrations = await storage.getUserTournamentRegistrations(req.params.userId);
      res.json(registrations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user registrations" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

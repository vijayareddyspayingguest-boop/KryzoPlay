import {
  type User,
  type InsertUser,
  type Tournament,
  type InsertTournament,
  type Team,
  type InsertTeam,
  type TeamMember,
  type InsertTeamMember,
  type TournamentRegistration,
  type InsertTournamentRegistration,
  type Match,
  type InsertMatch,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Tournament methods
  getTournaments(): Promise<Tournament[]>;
  getTournament(id: string): Promise<Tournament | undefined>;
  createTournament(tournament: InsertTournament): Promise<Tournament>;
  updateTournament(id: string, tournament: Partial<Tournament>): Promise<Tournament | undefined>;
  
  // Team methods
  getTeams(): Promise<Team[]>;
  getTeam(id: string): Promise<Team | undefined>;
  getTeamsByUser(userId: string): Promise<Team[]>;
  createTeam(team: InsertTeam): Promise<Team>;
  updateTeam(id: string, team: Partial<Team>): Promise<Team | undefined>;
  deleteTeam(id: string): Promise<boolean>;
  
  // Team member methods
  getTeamMembers(teamId: string): Promise<TeamMember[]>;
  addTeamMember(member: InsertTeamMember): Promise<TeamMember>;
  removeTeamMember(teamId: string, userId: string): Promise<boolean>;
  
  // Tournament registration methods
  getTournamentRegistrations(tournamentId: string): Promise<TournamentRegistration[]>;
  getUserTournamentRegistrations(userId: string): Promise<TournamentRegistration[]>;
  registerForTournament(registration: InsertTournamentRegistration): Promise<TournamentRegistration>;
  unregisterFromTournament(tournamentId: string, userId: string): Promise<boolean>;
  
  // Match methods
  getMatches(tournamentId: string): Promise<Match[]>;
  getMatch(id: string): Promise<Match | undefined>;
  createMatch(match: InsertMatch): Promise<Match>;
  updateMatch(id: string, match: Partial<Match>): Promise<Match | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private tournaments: Map<string, Tournament>;
  private teams: Map<string, Team>;
  private teamMembers: Map<string, TeamMember>;
  private tournamentRegistrations: Map<string, TournamentRegistration>;
  private matches: Map<string, Match>;

  constructor() {
    this.users = new Map();
    this.tournaments = new Map();
    this.teams = new Map();
    this.teamMembers = new Map();
    this.tournamentRegistrations = new Map();
    this.matches = new Map();
    
    this.seedData();
  }

  private seedData() {
    const user1: User = {
      id: "user-1",
      username: "Player123",
      password: "hashed_password",
    };
    this.users.set(user1.id, user1);

    const tournament1: Tournament = {
      id: "tournament-1",
      name: "Valorant Knockout Cup",
      description: "Teams battle it out in single elimination rounds. Only the strongest will survive to claim victory.",
      status: "live",
      prizePool: "₹5,000",
      entryFee: 0,
      maxParticipants: 64,
      currentParticipants: 32,
      format: "Single Elimination",
      rules: [
        "All matches are Best of 3",
        "Standard competitive ruleset",
        "No cheating or exploits allowed",
        "Teams must check-in 15 minutes before match time"
      ],
      schedule: "Starting January 15, 2025 at 6:00 PM IST",
      prizeDistribution: JSON.stringify([
        { place: "1st Place", prize: "₹2,500" },
        { place: "2nd Place", prize: "₹1,500" },
        { place: "3rd Place", prize: "₹1,000" }
      ]),
    };

    const tournament2: Tournament = {
      id: "tournament-2",
      name: "Vanguard Showdown",
      description: "Double elimination tournament with the best teams competing for glory.",
      status: "upcoming",
      prizePool: "₹10,000",
      entryFee: 0,
      maxParticipants: 128,
      currentParticipants: 48,
      format: "Double Elimination",
      rules: [
        "Best of 5 for finals",
        "Standard competitive ruleset",
        "No cheating or exploits allowed"
      ],
      schedule: "Starting January 20, 2025 at 7:00 PM IST",
      prizeDistribution: JSON.stringify([
        { place: "1st Place", prize: "₹5,000" },
        { place: "2nd Place", prize: "₹3,000" },
        { place: "3rd Place", prize: "₹2,000" }
      ]),
    };

    const tournament3: Tournament = {
      id: "tournament-3",
      name: "Champions Arena",
      description: "The ultimate showdown for champions. Prove your worth!",
      status: "upcoming",
      prizePool: "₹15,000",
      entryFee: 100,
      maxParticipants: 128,
      currentParticipants: 64,
      format: "Single Elimination",
      rules: [
        "Best of 3 matches",
        "Entry fee required",
        "Professional conduct required"
      ],
      schedule: "Starting January 25, 2025 at 8:00 PM IST",
      prizeDistribution: JSON.stringify([
        { place: "1st Place", prize: "₹7,500" },
        { place: "2nd Place", prize: "₹5,000" },
        { place: "3rd Place", prize: "₹2,500" }
      ]),
    };

    this.tournaments.set(tournament1.id, tournament1);
    this.tournaments.set(tournament2.id, tournament2);
    this.tournaments.set(tournament3.id, tournament3);

    const team1: Team = {
      id: "team-1",
      name: "Phantom Strikers",
      tag: "PHTM",
      captainId: user1.id,
      tournamentsEntered: 12,
      tournamentsWon: 4,
    };
    this.teams.set(team1.id, team1);

    const teamMember1: TeamMember = {
      id: "tm-1",
      teamId: team1.id,
      userId: user1.id,
      role: "captain",
    };
    this.teamMembers.set(teamMember1.id, teamMember1);

    const registration1: TournamentRegistration = {
      id: "reg-1",
      tournamentId: tournament1.id,
      teamId: team1.id,
      userId: null,
      registeredAt: new Date(),
    };
    this.tournamentRegistrations.set(registration1.id, registration1);

    const match1: Match = {
      id: "match-1",
      tournamentId: tournament1.id,
      round: 1,
      position: 1,
      team1Id: team1.id,
      team2Id: "team-2",
      team1Score: 13,
      team2Score: 8,
      winnerId: team1.id,
      status: "completed",
    };
    this.matches.set(match1.id, match1);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getTournaments(): Promise<Tournament[]> {
    return Array.from(this.tournaments.values());
  }

  async getTournament(id: string): Promise<Tournament | undefined> {
    return this.tournaments.get(id);
  }

  async createTournament(insertTournament: InsertTournament): Promise<Tournament> {
    const id = randomUUID();
    const tournament: Tournament = { 
      id,
      name: insertTournament.name,
      description: insertTournament.description,
      status: insertTournament.status || "upcoming",
      prizePool: insertTournament.prizePool,
      entryFee: insertTournament.entryFee || 0,
      maxParticipants: insertTournament.maxParticipants,
      currentParticipants: 0,
      format: insertTournament.format,
      rules: insertTournament.rules || [],
      schedule: insertTournament.schedule,
      prizeDistribution: insertTournament.prizeDistribution,
    };
    this.tournaments.set(id, tournament);
    return tournament;
  }

  async updateTournament(id: string, updates: Partial<Tournament>): Promise<Tournament | undefined> {
    const tournament = this.tournaments.get(id);
    if (!tournament) return undefined;
    
    const updated = { ...tournament, ...updates };
    this.tournaments.set(id, updated);
    return updated;
  }

  async getTeams(): Promise<Team[]> {
    return Array.from(this.teams.values());
  }

  async getTeam(id: string): Promise<Team | undefined> {
    return this.teams.get(id);
  }

  async getTeamsByUser(userId: string): Promise<Team[]> {
    const userTeamMemberships = Array.from(this.teamMembers.values())
      .filter(tm => tm.userId === userId);
    
    return userTeamMemberships
      .map(tm => this.teams.get(tm.teamId))
      .filter((team): team is Team => team !== undefined);
  }

  async createTeam(insertTeam: InsertTeam): Promise<Team> {
    const id = randomUUID();
    const team: Team = { 
      ...insertTeam, 
      id,
      tournamentsEntered: 0,
      tournamentsWon: 0
    };
    this.teams.set(id, team);
    
    const captainMember: TeamMember = {
      id: randomUUID(),
      teamId: id,
      userId: insertTeam.captainId,
      role: "captain",
    };
    this.teamMembers.set(captainMember.id, captainMember);
    
    return team;
  }

  async updateTeam(id: string, updates: Partial<Team>): Promise<Team | undefined> {
    const team = this.teams.get(id);
    if (!team) return undefined;
    
    const updated = { ...team, ...updates };
    this.teams.set(id, updated);
    return updated;
  }

  async deleteTeam(id: string): Promise<boolean> {
    const deleted = this.teams.delete(id);
    
    Array.from(this.teamMembers.entries())
      .filter(([, tm]) => tm.teamId === id)
      .forEach(([tmId]) => this.teamMembers.delete(tmId));
    
    return deleted;
  }

  async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    return Array.from(this.teamMembers.values())
      .filter(tm => tm.teamId === teamId);
  }

  async addTeamMember(insertMember: InsertTeamMember): Promise<TeamMember> {
    const id = randomUUID();
    const member: TeamMember = { 
      id,
      teamId: insertMember.teamId,
      userId: insertMember.userId,
      role: insertMember.role || "member"
    };
    this.teamMembers.set(id, member);
    return member;
  }

  async removeTeamMember(teamId: string, userId: string): Promise<boolean> {
    const member = Array.from(this.teamMembers.entries())
      .find(([, tm]) => tm.teamId === teamId && tm.userId === userId);
    
    if (!member) return false;
    
    return this.teamMembers.delete(member[0]);
  }

  async getTournamentRegistrations(tournamentId: string): Promise<TournamentRegistration[]> {
    return Array.from(this.tournamentRegistrations.values())
      .filter(reg => reg.tournamentId === tournamentId);
  }

  async getUserTournamentRegistrations(userId: string): Promise<TournamentRegistration[]> {
    return Array.from(this.tournamentRegistrations.values())
      .filter(reg => reg.userId === userId || (reg.teamId && this.isUserInTeam(userId, reg.teamId)));
  }

  private isUserInTeam(userId: string, teamId: string): boolean {
    return Array.from(this.teamMembers.values())
      .some(tm => tm.teamId === teamId && tm.userId === userId);
  }

  async registerForTournament(insertRegistration: InsertTournamentRegistration): Promise<TournamentRegistration> {
    const id = randomUUID();
    const registration: TournamentRegistration = { 
      id,
      tournamentId: insertRegistration.tournamentId,
      teamId: insertRegistration.teamId || null,
      userId: insertRegistration.userId || null,
      registeredAt: new Date()
    };
    this.tournamentRegistrations.set(id, registration);
    
    const tournament = this.tournaments.get(insertRegistration.tournamentId);
    if (tournament) {
      tournament.currentParticipants += 1;
      this.tournaments.set(tournament.id, tournament);
    }
    
    return registration;
  }

  async unregisterFromTournament(tournamentId: string, userId: string): Promise<boolean> {
    const registration = Array.from(this.tournamentRegistrations.entries())
      .find(([, reg]) => reg.tournamentId === tournamentId && reg.userId === userId);
    
    if (!registration) return false;
    
    const deleted = this.tournamentRegistrations.delete(registration[0]);
    
    if (deleted) {
      const tournament = this.tournaments.get(tournamentId);
      if (tournament && tournament.currentParticipants > 0) {
        tournament.currentParticipants -= 1;
        this.tournaments.set(tournament.id, tournament);
      }
    }
    
    return deleted;
  }

  async getMatches(tournamentId: string): Promise<Match[]> {
    return Array.from(this.matches.values())
      .filter(match => match.tournamentId === tournamentId)
      .sort((a, b) => a.round - b.round || a.position - b.position);
  }

  async getMatch(id: string): Promise<Match | undefined> {
    return this.matches.get(id);
  }

  async createMatch(insertMatch: InsertMatch): Promise<Match> {
    const id = randomUUID();
    const match: Match = { 
      id,
      tournamentId: insertMatch.tournamentId,
      round: insertMatch.round,
      position: insertMatch.position,
      team1Id: insertMatch.team1Id || null,
      team2Id: insertMatch.team2Id || null,
      team1Score: insertMatch.team1Score || null,
      team2Score: insertMatch.team2Score || null,
      winnerId: insertMatch.winnerId || null,
      status: insertMatch.status || "pending"
    };
    this.matches.set(id, match);
    return match;
  }

  async updateMatch(id: string, updates: Partial<Match>): Promise<Match | undefined> {
    const match = this.matches.get(id);
    if (!match) return undefined;
    
    const updated = { ...match, ...updates };
    this.matches.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();

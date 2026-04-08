import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserByEmail } from "./users";

// Simple hash function for passwords (in production, use bcrypt)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "ummie-secret-salt");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

function generateToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

// Store active sessions
const sessions = new Map<string, { userId: string; expiresAt: number }>();

export const register = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const { name, email, password } = args;

    // Check if user already exists
    const existingUser = await getUserByEmail(ctx, email);
    if (existingUser) {
      throw new Error("An account already exists with this email");
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Check if this is the first user (make them admin)
    const allUsers = await ctx.db.query("users").collect();
    const isFirstUser = allUsers.length === 0;

    // Create user
    const userId = await ctx.db.insert("users", {
      email,
      name,
      hashedPassword,
      role: isFirstUser ? "admin" : "customer",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Generate token
    const token = generateToken();
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

    // Store session
    await ctx.db.insert("sessions", {
      token,
      userId,
      expiresAt,
      createdAt: Date.now(),
    });

    return {
      success: true,
      token,
      user: {
        id: userId,
        email,
        name,
        role: isFirstUser ? "admin" : "customer",
      },
    };
  },
});

export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const { email, password } = args;

    // Find user by email
    const user = await getUserByEmail(ctx, email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Check password
    const hashedPassword = await hashPassword(password);
    if (user.hashedPassword !== hashedPassword) {
      throw new Error("Invalid email or password");
    }

    // Generate token
    const token = generateToken();
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

    // Store session
    await ctx.db.insert("sessions", {
      token,
      userId: user._id,
      expiresAt,
      createdAt: Date.now(),
    });

    return {
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  },
});

export const logout = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const { token } = args;

    // Find and delete session
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", token))
      .first();

    if (session) {
      await ctx.db.delete(session._id);
    }

    return { success: true };
  },
});

export const verifyToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const { token } = args;

    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      return null;
    }

    const user = await ctx.db.get(session.userId);
    if (!user) {
      return null;
    }

    return {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  },
});

export const getCurrentUser = query({
  args: { token: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.token) return null;

    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      return null;
    }

    const user = await ctx.db.get(session.userId);
    if (!user) {
      return null;
    }

    return {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  },
});

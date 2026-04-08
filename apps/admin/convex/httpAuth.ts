import { httpAction } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { getUserByEmail } from "./users";

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

export const registerHttp = httpAction(async (ctx, request) => {
  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const { name, email, password } = body;

    const result = await ctx.runMutation(api.authMutations.register, { name, email, password });
    
    return new Response(JSON.stringify(result), { status: 200, headers: corsHeaders });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Registration failed" }),
      { status: 500, headers: corsHeaders }
    );
  }
});

export const loginHttp = httpAction(async (ctx, request) => {
  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const { email, password } = body;

    const result = await ctx.runMutation(api.authMutations.login, { email, password });

    return new Response(JSON.stringify(result), { status: 200, headers: corsHeaders });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Login failed" }),
      { status: 500, headers: corsHeaders }
    );
  }
});

export const logoutHttp = httpAction(async (ctx, request) => {
  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const { token } = body;

    const result = await ctx.runMutation(api.authMutations.logout, { token });

    return new Response(JSON.stringify(result), { status: 200, headers: corsHeaders });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});

import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

// app will be mounted at /api
const app = new Hono();

console.log('🚀 Starting Hono server...');

// Enable CORS for all routes with more permissive settings
app.use("*", cors({
  origin: (origin) => {
    console.log('CORS Origin:', origin);
    return true; // Allow all origins for now
  },
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  maxAge: 86400,
}));

// Add logging middleware
app.use("*", async (c, next) => {
  console.log(`${c.req.method} ${c.req.url}`);
  await next();
});

// Simple health check endpoint
app.get("/", (c) => {
  console.log('Health check endpoint hit');
  return c.json({ 
    status: "ok", 
    message: "Desbrav API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// Test endpoint
app.get("/test", (c) => {
  console.log('Test endpoint hit');
  return c.json({ 
    message: "Test endpoint working",
    timestamp: new Date().toISOString()
  });
});

// Mount tRPC router at /trpc
app.use(
  "/trpc/*",
  trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
    createContext,
    onError: ({ error, path }) => {
      console.error(`❌ tRPC Error on ${path}:`, error);
    },
  })
);

// Catch all 404s
app.notFound((c) => {
  console.log(`❌ 404 Not Found: ${c.req.method} ${c.req.url}`);
  return c.json({ error: "Not Found", path: c.req.url }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('❌ Server Error:', err);
  return c.json({ error: "Internal Server Error", message: err.message }, 500);
});

console.log('✅ Hono server configured successfully');

export default app;
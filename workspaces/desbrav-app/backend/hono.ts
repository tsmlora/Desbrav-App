import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from 'bun';
import { createBunWebSocket } from 'hono/bun';
import { trpcServer } from '@hono/trpc-server';
import { appRouter } from './trpc/app-router';

const app = new Hono();

app.use('*', cors());

app.use(
  '/api/trpc/*',
  trpcServer({
    router: appRouter,
    endpoint: '/api/trpc',
  })
);

const { upgradeWebSocket, websocket } = createBunWebSocket();

app.get('/ws', upgradeWebSocket((c) => {
  return {
    onOpen(_evt, ws) {
      console.log('WebSocket connection opened');
      ws.send('Hello from Hono with Bun!');
    },
    onMessage(evt, ws) {
      console.log('Message received:', evt.data);
      ws.send(`Echo: ${evt.data}`);
    },
    onClose() {
      console.log('WebSocket connection closed');
    },
  };
}));

const server = serve({
  port: process.env.PORT || 3000,
  fetch: app.fetch,
  websocket,
});

console.log(`Server running on port ${process.env.PORT || 3000}`);

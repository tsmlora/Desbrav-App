import { createTRPCReact } from "@trpc/react-query";
import { createTRPCClient, httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";
import { supabase } from "@/lib/supabase";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  const fallbackUrl = "https://4xdihzka1v67yzbxj8qvn.rork.com";
  
  const baseUrl = envUrl || fallbackUrl;
  console.log('tRPC Base URL:', baseUrl);
  
  return baseUrl;
};

// Create the tRPC client for React components
export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      headers: async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          return {
            authorization: session?.access_token ? `Bearer ${session.access_token}` : '',
          };
        } catch (error) {
          console.error('Error getting session for headers:', error);
          return {};
        }
      },
    }),
  ],
});

// Create a vanilla tRPC client for non-React usage
export const vanillaTrpcClient = createTRPCClient<AppRouter>({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      headers: async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          const headers = {
            authorization: session?.access_token ? `Bearer ${session.access_token}` : '',
          };
          console.log('tRPC Headers:', headers);
          return headers;
        } catch (error) {
          console.error('Error getting session for headers:', error);
          return {};
        }
      },
      fetch: async (url, options) => {
        console.log('tRPC Fetch URL:', url);
        console.log('tRPC Fetch Options:', options);
        
        try {
          const response = await fetch(url, options);
          console.log('tRPC Response Status:', response.status);
          console.log('tRPC Response Headers:', response.headers);
          
          if (!response.ok) {
            const text = await response.text();
            console.error('tRPC Response Error:', text);
            throw new Error(`HTTP ${response.status}: ${text}`);
          }
          
          return response;
        } catch (error) {
          console.error('tRPC Fetch Error:', error);
          throw error;
        }
      },
    }),
  ],
});
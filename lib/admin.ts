import "server-only";
import { init } from "@instantdb/admin";
import schema from "@/instant.schema";

const appId = process.env.NEXT_PUBLIC_INSTANT_APP_ID!;
const adminToken = process.env.INSTANT_ADMIN_TOKEN;

// The admin client is only available when the admin token is configured.
// It's used to verify session tokens stored in the cookie server-side.
export const adminDb =
  adminToken && appId ? init({ appId, adminToken, schema }) : null;

export const SESSION_COOKIE = "instant_session";

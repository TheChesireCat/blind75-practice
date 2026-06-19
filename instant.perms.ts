// InstantDB permissions. Push with `npx instant-cli@latest push perms`.
//
// This is a public demo app (anyone with the app id can read/write).
// Problems are read-only from the client; they are written only via the
// admin token in the seed script. Progress is open so anyone trying the
// app can track practice without signing in.
import type { InstantRules } from "@instantdb/react";

const rules = {
  problems: {
    allow: {
      view: "true",
      create: "false",
      update: "false",
      delete: "false",
    },
  },
  progress: {
    allow: {
      view: "true",
      create: "true",
      update: "true",
      delete: "true",
    },
  },
} satisfies InstantRules;

export default rules;

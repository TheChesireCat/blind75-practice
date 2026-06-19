// InstantDB schema. Push with `npx instant-cli@latest push schema`.
import { i } from "@instantdb/core";

const _schema = i.schema({
  entities: {
    // Reference data: the Blind 75 problems (seeded from data/problems.json).
    problems: i.entity({
      pid: i.number().unique().indexed(),
      no: i.number(),
      type: i.string().indexed(),
      slug: i.string(),
      title: i.string().indexed(),
      difficulty: i.string().indexed(),
      tags: i.json(),
      description: i.string(),
      solution: i.string(),
    }),
    // User practice state, one row per (user, problem).
    progress: i.entity({
      userId: i.string().indexed(),
      pid: i.number().indexed(),
      status: i.string().indexed(), // "todo" | "attempted" | "solved"
      notes: i.string(),
      scratch: i.string(), // user's practice code
      updatedAt: i.number().indexed(),
    }),
  },
  links: {},
  rooms: {},
});

// TypeScript helpers
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;

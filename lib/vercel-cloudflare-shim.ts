type Statement = {
  bind: (...values: unknown[]) => Statement;
  all: <T = Record<string, unknown>>() => Promise<{ results: T[]; success: true }>;
  first: <T = Record<string, unknown>>() => Promise<T | null>;
  run: () => Promise<{ success: false; meta: { platform: "vercel" } }>;
};

function statement(): Statement {
  return {
    bind: () => statement(),
    all: async () => ({ results: [], success: true }),
    first: async () => null,
    run: async () => ({ success: false, meta: { platform: "vercel" } }),
  };
}

/**
 * Vercel does not provide Cloudflare D1 or R2 bindings. This read-safe adapter
 * lets the Next.js application deploy and render public pages there. Mutating
 * backend features remain available on the Cloudflare Sites deployment.
 */
export const env = {
  DB: {
    prepare: (_query: string) => statement(),
    batch: async (statements: Statement[]) =>
      Promise.all(statements.map((item) => item.run())),
  },
  UPLOADS: {
    get: async (_key: string) => null,
    put: async () => {
      throw new Error("File uploads require the Cloudflare R2 deployment.");
    },
  },
};

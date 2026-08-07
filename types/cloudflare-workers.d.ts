declare module "cloudflare:workers" {
  export const env: {
    DB: D1Database;
    UPLOADS: R2Bucket;
  };
}

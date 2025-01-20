declare module "bun" {
  interface Env {
    DB_FILE_NAME: string;
    BETTER_AUTH_SECRET: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GITHUB_CLIENT_ID: string;
    GITHUB_CLIENT_SECRET: string;
  }
}

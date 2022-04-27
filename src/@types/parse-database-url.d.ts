export default function parseDatabaseUrl(url: string): {
  driver: string;
  user?: string;
  password?: string;
  host: string;
  port: string;
};

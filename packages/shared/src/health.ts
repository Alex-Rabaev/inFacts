/** Canonical wire shape for the health endpoint (AD-1). */
export interface HealthStatus {
  status: "ok";
  service: string;
  timestamp: string;
}

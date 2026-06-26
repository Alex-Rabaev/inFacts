import type { HealthStatus } from "@infacts/shared";

const shell: HealthStatus = {
  status: "ok",
  service: "infacts-web",
  timestamp: new Date().toISOString(),
};

export function App() {
  return (
    <main>
      <h1>inFacts</h1>
      <p data-testid="status">
        Shell online — {shell.service} ({shell.status})
      </p>
    </main>
  );
}

export default App;

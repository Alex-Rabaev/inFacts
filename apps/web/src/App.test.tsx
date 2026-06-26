import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the shell", () => {
    render(<App />);
    expect(screen.getByText("inFacts")).toBeInTheDocument();
    expect(screen.getByTestId("status")).toHaveTextContent("Shell online");
  });
});

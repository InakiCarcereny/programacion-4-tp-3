import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { Header } from "@/components/Header";

describe("Header", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
  });

  it("shows the table number from the url", () => {
    window.history.replaceState({}, "", "/?mesa=4");
    render(<Header />);
    expect(screen.getByText("Mesa 4")).toBeInTheDocument();
  });

  it("falls back to counter pickup when there is no table", () => {
    render(<Header />);
    expect(screen.getByText("Retiro en la barra")).toBeInTheDocument();
  });
});

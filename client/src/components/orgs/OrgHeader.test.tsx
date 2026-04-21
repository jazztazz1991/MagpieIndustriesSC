/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { OrgHeader } from "./OrgHeader";

vi.mock("./OrgHeader.module.css", () => ({
  default: new Proxy({}, { get: (_target, prop) => String(prop) }),
}));

const baseOrg = {
  name: "Magpie Industries",
  description: null,
  logoUrl: null,
  bannerUrl: null,
  motd: null,
  memberCount: 1,
  ownerName: "Percy",
  isPublic: true,
};

describe("OrgHeader", () => {
  it("renders the org name", () => {
    render(<OrgHeader org={baseOrg} />);
    expect(screen.getByRole("heading", { name: "Magpie Industries" })).toBeInTheDocument();
  });

  it("shows the description when provided", () => {
    render(<OrgHeader org={{ ...baseOrg, description: "A mining co-op." }} />);
    expect(screen.getByText("A mining co-op.")).toBeInTheDocument();
  });

  it("omits the description when null", () => {
    const { container } = render(<OrgHeader org={baseOrg} />);
    expect(container.querySelector("p")).toBeNull();
  });

  it("pluralizes member count correctly", () => {
    const { rerender } = render(<OrgHeader org={{ ...baseOrg, memberCount: 1 }} />);
    expect(screen.getByText(/1 member($|\s)/)).toBeInTheDocument();

    rerender(<OrgHeader org={{ ...baseOrg, memberCount: 5 }} />);
    expect(screen.getByText(/5 members/)).toBeInTheDocument();
  });

  it("shows Public/Private correctly", () => {
    const { rerender } = render(<OrgHeader org={{ ...baseOrg, isPublic: true }} />);
    expect(screen.getByText("Public")).toBeInTheDocument();

    rerender(<OrgHeader org={{ ...baseOrg, isPublic: false }} />);
    expect(screen.getByText("Private")).toBeInTheDocument();
  });

  it("shows MOTD only when provided", () => {
    const { rerender } = render(<OrgHeader org={baseOrg} />);
    expect(screen.queryByText("MOTD")).toBeNull();

    rerender(<OrgHeader org={{ ...baseOrg, motd: "Mining op tonight 8pm EST" }} />);
    expect(screen.getByText("MOTD")).toBeInTheDocument();
    expect(screen.getByText(/Mining op tonight 8pm EST/)).toBeInTheDocument();
  });

  it("shows initial in logo placeholder when no logoUrl", () => {
    render(<OrgHeader org={baseOrg} />);
    expect(screen.getByText("M")).toBeInTheDocument();
  });

  it("renders the logo image when logoUrl is set", () => {
    render(<OrgHeader org={{ ...baseOrg, logoUrl: "https://example.com/logo.png" }} />);
    const logo = screen.getByRole("img", { name: /Magpie Industries logo/ });
    expect(logo).toHaveAttribute("src", "https://example.com/logo.png");
  });
});

/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Sidebar } from "./Sidebar";

const mockPathname = vi.fn(() => "/orgs/magpies");

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

vi.mock("next/link", () => ({
  default: ({ children, href, onClick, className }: { children: React.ReactNode; href: string; onClick?: () => void; className?: string }) => (
    <a href={href} onClick={onClick} className={className}>{children}</a>
  ),
}));

vi.mock("./Sidebar.module.css", () => ({
  default: new Proxy({}, { get: (_target, prop) => String(prop) }),
}));

describe("Sidebar", () => {
  beforeEach(() => {
    mockPathname.mockReturnValue("/orgs/magpies");
  });

  it("renders all default sections", () => {
    render(<Sidebar slug="magpies" />);
    expect(screen.getByRole("link", { name: /Overview/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Operations/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Fleet/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Treasury/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Guides/ })).toBeInTheDocument();
  });

  it("marks the overview link active when on the org root", () => {
    mockPathname.mockReturnValue("/orgs/magpies");
    render(<Sidebar slug="magpies" />);
    const link = screen.getByRole("link", { name: /Overview/ });
    expect(link.className).toMatch(/linkActive/);
  });

  it("marks the operations link active when on a sub-route", () => {
    mockPathname.mockReturnValue("/orgs/magpies/operations/abc");
    render(<Sidebar slug="magpies" />);
    const link = screen.getByRole("link", { name: /Operations/ });
    expect(link.className).toMatch(/linkActive/);
  });

  it("only one link is active at a time", () => {
    mockPathname.mockReturnValue("/orgs/magpies/fleet");
    render(<Sidebar slug="magpies" />);
    const activeLinks = screen.getAllByRole("link").filter((l) => l.className.includes("linkActive"));
    expect(activeLinks).toHaveLength(1);
    expect(activeLinks[0]).toHaveTextContent(/Fleet/);
  });

  it("shows Settings entry only when isOwner is true", () => {
    const { rerender } = render(<Sidebar slug="magpies" isOwner={false} />);
    expect(screen.queryByRole("link", { name: /Settings/ })).toBeNull();

    rerender(<Sidebar slug="magpies" isOwner={true} />);
    expect(screen.getByRole("link", { name: /Settings/ })).toBeInTheDocument();
  });

  it("links point to the correct routes", () => {
    render(<Sidebar slug="magpies" />);
    expect(screen.getByRole("link", { name: /Overview/ })).toHaveAttribute("href", "/orgs/magpies");
    expect(screen.getByRole("link", { name: /Operations/ })).toHaveAttribute("href", "/orgs/magpies/operations");
    expect(screen.getByRole("link", { name: /Fleet/ })).toHaveAttribute("href", "/orgs/magpies/fleet");
  });

  it("groups sections under labels", () => {
    const { container } = render(<Sidebar slug="magpies" />);
    // Group labels use the sectionLabel class; there's also an "Operations" link
    const groupLabels = Array.from(container.querySelectorAll('[class*="sectionLabel"]')).map((el) => el.textContent);
    expect(groupLabels).toContain("Operations");
    expect(groupLabels).toContain("People");
    expect(groupLabels).toContain("Admin");
  });

  it("mobile header reflects the active section label", () => {
    mockPathname.mockReturnValue("/orgs/magpies/fleet");
    render(<Sidebar slug="magpies" />);
    const mobileHeader = screen.getByRole("button", { expanded: false });
    expect(mobileHeader).toHaveTextContent(/Fleet/);
  });

  it("mobile toggle opens and closes the sidebar", () => {
    render(<Sidebar slug="magpies" />);
    const toggle = screen.getByRole("button");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});

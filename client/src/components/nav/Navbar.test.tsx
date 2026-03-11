/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Navbar from "./Navbar";

// Mock next/link to render a plain anchor
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

// Mock CSS modules
vi.mock("./Navbar.module.css", () => ({
  default: new Proxy({}, { get: (_target, prop) => String(prop) }),
}));

// Mock AuthContext
const mockUseAuth = vi.fn();
vi.mock("@/context/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

describe("Navbar", () => {
  it("shows Sign In and Sign Up when logged out", () => {
    mockUseAuth.mockReturnValue({ user: null, logout: vi.fn() });
    render(<Navbar />);

    expect(screen.getByText("Sign In")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
    expect(screen.queryByText("Logout")).not.toBeInTheDocument();
  });

  it("shows username and Logout when logged in", () => {
    mockUseAuth.mockReturnValue({
      user: { id: "1", username: "TestPilot", role: "REGISTERED" },
      logout: vi.fn(),
    });
    render(<Navbar />);

    expect(screen.getByText("TestPilot")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
    expect(screen.queryByText("Sign In")).not.toBeInTheDocument();
  });

  it("renders all navigation links", () => {
    mockUseAuth.mockReturnValue({ user: null, logout: vi.fn() });
    render(<Navbar />);

    expect(screen.getByText("Mining")).toBeInTheDocument();
    expect(screen.getByText("Salvage")).toBeInTheDocument();
    expect(screen.getByText("Refinery")).toBeInTheDocument();
    expect(screen.getByText("Trade")).toBeInTheDocument();
    expect(screen.getByText("Loadout")).toBeInTheDocument();
    expect(screen.getByText("Profit")).toBeInTheDocument();
    expect(screen.getByText("Ships")).toBeInTheDocument();
    expect(screen.getByText("Wikelo")).toBeInTheDocument();
    expect(screen.getByText("Locations")).toBeInTheDocument();
    expect(screen.getByText("Guide")).toBeInTheDocument();
    expect(screen.getByText("Community")).toBeInTheDocument();
    expect(screen.getByText("Orgs")).toBeInTheDocument();
    expect(screen.getByText("Recruit")).toBeInTheDocument();
  });

  it("renders the logo link to home", () => {
    mockUseAuth.mockReturnValue({ user: null, logout: vi.fn() });
    render(<Navbar />);

    const logo = screen.getByText("Magpie Industries");
    expect(logo).toBeInTheDocument();
    expect(logo.closest("a")).toHaveAttribute("href", "/");
  });

  it("renders hamburger button with correct aria attributes", () => {
    mockUseAuth.mockReturnValue({ user: null, logout: vi.fn() });
    render(<Navbar />);

    const toggle = screen.getByLabelText("Toggle navigation menu");
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("opens mobile menu when hamburger is clicked", () => {
    mockUseAuth.mockReturnValue({ user: null, logout: vi.fn() });
    render(<Navbar />);

    const toggle = screen.getByLabelText("Toggle navigation menu");
    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    // Mobile menu links now appear (duplicating desktop links)
    expect(screen.getAllByText("Mining")).toHaveLength(2);
  });

  it("closes mobile menu when a link is clicked", () => {
    mockUseAuth.mockReturnValue({ user: null, logout: vi.fn() });
    render(<Navbar />);

    const toggle = screen.getByLabelText("Toggle navigation menu");
    fireEvent.click(toggle);
    expect(screen.getAllByText("Mining")).toHaveLength(2);

    // Click a mobile menu link (second instance)
    const mobileLinks = screen.getAllByText("Mining");
    fireEvent.click(mobileLinks[1]);

    // Mobile menu should close — back to 1 instance
    expect(screen.getAllByText("Mining")).toHaveLength(1);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("shows auth links in mobile menu when logged out", () => {
    mockUseAuth.mockReturnValue({ user: null, logout: vi.fn() });
    render(<Navbar />);

    fireEvent.click(screen.getByLabelText("Toggle navigation menu"));

    // Desktop + mobile instances
    expect(screen.getAllByText("Sign In")).toHaveLength(2);
    expect(screen.getAllByText("Sign Up")).toHaveLength(2);
  });

  it("renders search button", () => {
    mockUseAuth.mockReturnValue({ user: null, logout: vi.fn() });
    render(<Navbar />);
    expect(screen.getByLabelText("Search (Ctrl+K)")).toBeInTheDocument();
  });

  it("shows username and logout in mobile menu when logged in", () => {
    const mockLogout = vi.fn();
    mockUseAuth.mockReturnValue({
      user: { id: "1", username: "TestPilot", role: "REGISTERED" },
      logout: mockLogout,
    });
    render(<Navbar />);

    fireEvent.click(screen.getByLabelText("Toggle navigation menu"));

    expect(screen.getAllByText("TestPilot")).toHaveLength(2);
    expect(screen.getAllByText("Logout")).toHaveLength(2);
  });
});

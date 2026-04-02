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

  it("renders dropdown toggle buttons for nav groups", () => {
    mockUseAuth.mockReturnValue({ user: null, logout: vi.fn() });
    render(<Navbar />);

    expect(screen.getByText("Tools")).toBeInTheDocument();
    expect(screen.getByText("Database")).toBeInTheDocument();
    expect(screen.getByText("Guides")).toBeInTheDocument();
    expect(screen.getByText("Community")).toBeInTheDocument();
    expect(screen.getByText("Feedback")).toBeInTheDocument();
  });

  it("opens dropdown to show links when toggle is clicked", () => {
    mockUseAuth.mockReturnValue({ user: null, logout: vi.fn() });
    render(<Navbar />);

    // Click Tools dropdown
    fireEvent.click(screen.getByText("Tools"));

    expect(screen.getByText("Mining Calculator")).toBeInTheDocument();
    expect(screen.getByText("Refinery")).toBeInTheDocument();
    expect(screen.getByText("Loadout")).toBeInTheDocument();
    expect(screen.getByText("Ship Compare")).toBeInTheDocument();
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

  it("opens mobile menu with grouped links when hamburger is clicked", () => {
    mockUseAuth.mockReturnValue({ user: null, logout: vi.fn() });
    render(<Navbar />);

    const toggle = screen.getByLabelText("Toggle navigation menu");
    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    // Mobile menu has group labels (text-transform uppercase is CSS-only)
    expect(screen.getAllByText("Tools").length).toBeGreaterThanOrEqual(2); // dropdown toggle + mobile group label
    expect(screen.getAllByText("Database").length).toBeGreaterThanOrEqual(2);
    // Mobile menu has links
    expect(screen.getByText("Mining Calculator")).toBeInTheDocument();
  });

  it("closes mobile menu when a link is clicked", () => {
    mockUseAuth.mockReturnValue({ user: null, logout: vi.fn() });
    render(<Navbar />);

    const toggle = screen.getByLabelText("Toggle navigation menu");
    fireEvent.click(toggle);

    // Click a mobile link
    fireEvent.click(screen.getByText("Refinery"));

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

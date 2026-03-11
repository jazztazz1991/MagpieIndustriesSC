// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDataSource } from "./useDataSource";

describe("useDataSource", () => {
  it("returns static data immediately when mode is static", () => {
    const staticData = [{ id: 1, name: "Test" }];
    const { result } = renderHook(() =>
      useDataSource(staticData, "/api/test")
    );

    expect(result.current.data).toEqual(staticData);
  });

  it("loading is false for static mode", () => {
    const staticData = [{ id: 1, name: "Test" }];
    const { result } = renderHook(() =>
      useDataSource(staticData, "/api/test")
    );

    expect(result.current.loading).toBe(false);
  });

  it("error is null for static mode", () => {
    const staticData = [{ id: 1, name: "Test" }];
    const { result } = renderHook(() =>
      useDataSource(staticData, "/api/test")
    );

    expect(result.current.error).toBeNull();
  });

  it("provides a refetch function", () => {
    const staticData = [{ id: 1, name: "Test" }];
    const { result } = renderHook(() =>
      useDataSource(staticData, "/api/test")
    );

    expect(typeof result.current.refetch).toBe("function");
  });

  it("returns static data when no apiEndpoint is provided", () => {
    const staticData = { key: "value" };
    const { result } = renderHook(() => useDataSource(staticData));

    expect(result.current.data).toEqual(staticData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});

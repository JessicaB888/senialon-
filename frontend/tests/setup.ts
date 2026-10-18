import { vi } from "vitest";

// Unit tests run outside Next's server graph; production keeps this boundary.
vi.mock("server-only", () => ({}));

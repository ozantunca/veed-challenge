import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => new URLSearchParams("sort=oldest"),
}));

import { VideoSortDropdown } from "@/components/VideoSortDropdown";

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  push.mockClear();
});

describe("VideoSortDropdown", () => {
  it("calls router.push with sort=newest when choosing Newest first", async () => {
    const user = userEvent.setup();
    render(<VideoSortDropdown />);

    await user.click(
      screen.getByRole("button", { name: /sort:\s*oldest first/i }),
    );
    await user.click(screen.getByRole("menuitem", { name: /^newest first$/i }));

    expect(push).toHaveBeenCalledWith("/?sort=newest");
  });
});

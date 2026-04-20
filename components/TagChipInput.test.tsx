import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { TagChipInput } from "@/components/TagChipInput";

afterEach(() => {
  cleanup();
});

describe("TagChipInput", () => {
  it("adds a tag on Enter", () => {
    const onChange = vi.fn();
    render(
      <TagChipInput label="Tags" value={[]} onChange={onChange} />,
    );
    const input = screen.getByPlaceholderText(/add tags/i);
    fireEvent.change(input, { target: { value: "hello" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith(["hello"]);
  });

  it("adds multiple tags separated by comma", () => {
    const onChange = vi.fn();
    render(<TagChipInput value={[]} onChange={onChange} />);
    const input = screen.getByPlaceholderText(/add tags/i);
    fireEvent.change(input, { target: { value: "a,b" } });
    expect(onChange).toHaveBeenCalled();
    const last = onChange.mock.calls.at(-1)?.[0] as string[];
    expect(last).toContain("a");
  });

  it("clears draft on Escape without adding a tag", () => {
    const onChange = vi.fn();
    render(<TagChipInput id="t-tags" value={[]} onChange={onChange} />);
    const input = screen.getByPlaceholderText(/add tags/i);
    fireEvent.change(input, { target: { value: "draft" } });
    fireEvent.keyDown(input, { key: "Escape" });
    expect(onChange).not.toHaveBeenCalled();
    expect((input as HTMLInputElement).value).toBe("");
  });

  it("exposes aria-invalid and describedby when error is set", () => {
    render(
      <TagChipInput
        id="err-tags"
        value={[]}
        onChange={vi.fn()}
        error="Too many tags"
      />,
    );
    const input = screen.getByPlaceholderText(/add tags/i);
    expect(input.getAttribute("aria-invalid")).toBe("true");
    const db = input.getAttribute("aria-describedby");
    expect(db).toContain("err-tags-hint");
    expect(db).toContain("err-tags-error");
    expect(screen.getByText("Too many tags")).toBeTruthy();
  });
});

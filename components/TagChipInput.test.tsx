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
});

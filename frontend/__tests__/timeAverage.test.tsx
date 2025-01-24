import React from "react";
import { render } from "@testing-library/react";
import TimeAverage, { DisplayTime } from "@/components/timeAverage";
import { useAverageTime } from "@/components/hooks/useAverageTime";

jest.mock("@/components/hooks/useAverageTime");

describe("TimeAverage", () => {
  it("should render average time and priority times correctly", () => {
    const mockUseAverageTime = useAverageTime as jest.MockedFunction<
      typeof useAverageTime
    >;
    mockUseAverageTime.mockReturnValue({
      avgTime: 150,
      priorityAvg: { Low: 30, Medium: 90, High: 180 },
    });

    const { getByText, getAllByText } = render(<TimeAverage />);

    expect(getByText("Average time to finish tasks:")).toBeInTheDocument();

    // Use getAllByText to handle multiple elements
    const elements = getAllByText((content, element) => {
      return element?.textContent === "2h30m";
    });
    expect(elements.length).toBeGreaterThan(0);

    expect(getByText("Low")).toBeInTheDocument();
    expect(
      getByText((content, element) => {
        return element?.textContent === "30min";
      }),
    ).toBeInTheDocument();
    expect(getByText("Mid")).toBeInTheDocument();
    expect(
      getByText((content, element) => {
        return element?.textContent === "1h30m";
      }),
    ).toBeInTheDocument();
    expect(getByText("High")).toBeInTheDocument();
    expect(
      getByText((content, element) => {
        return element?.textContent === "3h0m";
      }),
    ).toBeInTheDocument();
  });
});

describe("DisplayTime", () => {
  it("should display minutes correctly", () => {
    const { container } = render(<DisplayTime min={45} />);
    expect(container.textContent).toBe("45min");
  });

  it("should display hours and minutes correctly", () => {
    const { container } = render(<DisplayTime min={125} />);
    expect(container.textContent).toBe("2h5m");
  });

  it("should display priority time correctly", () => {
    const { container } = render(<DisplayTime min={45} isPriority />);
    expect(container.textContent).toBe("45min");
  });
});

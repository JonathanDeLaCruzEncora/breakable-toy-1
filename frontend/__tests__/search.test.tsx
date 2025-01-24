import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  getByTestId,
} from "@testing-library/react";
import Search from "@/components/search";
import { useSearch } from "@/components/hooks/useSearch";
import { getTasks } from "@/components/utils/api";

jest.mock("@/components/hooks/useSearch");
jest.mock("@/components/utils/api");

describe("Search Component", () => {
  const mockUseSearch = useSearch as jest.MockedFunction<typeof useSearch>;
  const mockGetTasks = getTasks as jest.MockedFunction<typeof getTasks>;

  beforeEach(() => {
    mockUseSearch.mockReturnValue({
      setSearchParams: jest.fn(),
      setNumberOfPages: jest.fn(),
      setCurrentPage: jest.fn(),
      setTasks: jest.fn(),
      setLoadingTasks: jest.fn(),
      searchParams: { name: "", state: "All", priority: "All" },
      sortName: 0,
      sortPriority: 0,
      sortDueDate: 0,
    });
  });

  it("should update local search params on input change", () => {
    const { getByTestId } = render(<Search />);
    const input = getByTestId("search-input") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "Test Task" } });
    waitFor(() => {
      expect(input.value).toBe("Test Task");
    });
  });

  it("should update local search params on dropdown change", () => {
    const { getByLabelText, getByRole } = render(<Search />);
    const priorityDropdown = getByLabelText("Priority") as HTMLButtonElement;

    fireEvent.click(priorityDropdown);
    const highOption = getByRole("option", { name: "High" });
    fireEvent.click(highOption);

    expect(priorityDropdown).toHaveTextContent("High");
  });

  it("should display alert icon when search params change", () => {
    (getTasks as jest.Mock).mockResolvedValue({
      tasks: [],
      totalPages: 1,
    });
    const { getByLabelText, getByText, getByTestId } = render(<Search />);
    const input = getByLabelText("Name") as HTMLInputElement;
    const searchButton = getByText("Search");

    fireEvent.change(input, { target: { value: "Test Task" } });
    waitFor(() => {
      expect(getByTestId("alert-icon")).toBeInTheDocument();
    });

    fireEvent.click(searchButton);
    waitFor(() => {
      expect(getByTestId("alert-icon")).not.toBeInTheDocument();
    });
  });
});

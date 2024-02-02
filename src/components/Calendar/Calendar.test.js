import { render, screen, fireEvent } from "@testing-library/react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Calendar from "./index";

jest.mock("axios");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

const mockNavigate = jest.fn();
const mockEventsData = [
  {
    id: 1,
    date: "2023-01-15",
    detail: { title: "Test Event", launchDate: "2023-01-15" },
  },
];

describe("Calendar Component", () => {
  beforeEach(() => {
    useParams.mockReturnValue({ year: "2023", month: "1" });
    useNavigate.mockReturnValue(mockNavigate);
    axios.get.mockResolvedValue({ data: mockEventsData });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the calendar for the current month and year from URL parameters", async () => {
    render(<Calendar />);
    expect(screen.getByText("January 2023")).toBeInTheDocument();
  });

  it("navigates to the next and previous month", () => {
    render(<Calendar />);
    fireEvent.click(screen.getByText("❮")); // Previous month button
    expect(mockNavigate).toHaveBeenCalledWith("/2022/12");
    fireEvent.click(screen.getByText("❯")); // Next month button
    expect(mockNavigate).toHaveBeenCalledWith("/2023/2");
  });

  it("redirects to a valid date if URL parameters are invalid", () => {
    useParams.mockReturnValue({ year: "2023", month: "13" });
    render(<Calendar />);
    expect(mockNavigate).toHaveBeenCalled();
  });
});

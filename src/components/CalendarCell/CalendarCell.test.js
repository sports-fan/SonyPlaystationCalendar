import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { getDate } from "date-fns";
import CalendarCell from "./index";

describe("CalendarCell", () => {
  const mockOnClickEvent = jest.fn();
  const day = new Date(2023, 3, 14);
  const event = {
    detail: {
      imageFilenameThumb: "cell__thumb",
    },
  };

  it("renders correctly without an event", () => {
    render(<CalendarCell day={day} onClickEvent={mockOnClickEvent} />);
    expect(screen.getByText(getDate(day))).toBeInTheDocument();
    expect(screen.queryByAltText("thumb")).toBeNull();
    expect(screen.getByText(getDate(day))).toHaveClass(
      "cell__number--inactive"
    );
  });

  it("renders correctly with an event", () => {
    render(
      <CalendarCell day={day} event={event} onClickEvent={mockOnClickEvent} />
    );
    expect(screen.getByAltText("thumb")).toHaveAttribute(
      "src",
      `/images/${event.detail.imageFilenameThumb}.webp`
    );
    expect(screen.getByText(getDate(day))).toBeInTheDocument();
    expect(screen.getByText(getDate(day))).toHaveClass("cell__number--active");
  });

  it("triggers onClickEvent with the correct day when clicked", () => {
    render(<CalendarCell day={day} onClickEvent={mockOnClickEvent} />);
    fireEvent.click(screen.getByText(getDate(day)));
    expect(mockOnClickEvent).toHaveBeenCalledWith(day);
  });
});

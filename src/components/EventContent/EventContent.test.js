import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import EventContent from "./index";

describe("EventContent", () => {
  const currentEvent = {
    title: "Space Exploration",
    summary: "Join us to explore the vast universe.",
    launchDate: "2023-04-30",
    imageFilenameFull: "space-exploration",
    learnMoreLink: "https://example.com/learn-more",
    purchaseLink: "https://example.com/pre-order",
  };

  it("renders event details correctly", () => {
    render(<EventContent currentEvent={currentEvent} />);

    expect(
      screen.getByText(currentEvent.title.toUpperCase())
    ).toBeInTheDocument();

    expect(screen.getByText(currentEvent.summary)).toBeInTheDocument();

    const eventContentDiv = document.querySelector(".event-content");
    expect(eventContentDiv).toHaveStyle(
      `background-image: url(/images/${currentEvent.imageFilenameFull}.webp)`
    );
  });

  it('renders "Learn More" and "Pre Order Now" links with correct href attributes', () => {
    render(<EventContent currentEvent={currentEvent} />);

    const learnMoreLink = screen.getByText("Learn More").closest("a");
    expect(learnMoreLink).toHaveAttribute("href", currentEvent.learnMoreLink);

    const preOrderLink = screen.getByText("Pre Order Now").closest("a");
    expect(preOrderLink).toHaveAttribute("href", currentEvent.purchaseLink);
  });
});

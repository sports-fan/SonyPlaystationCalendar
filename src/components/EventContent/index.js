import React from "react";
import { format } from "date-fns";

import "./styles.css";

const EventContent = ({ currentEvent }) => {
  return (
    <div className="event-full">
      <div
        className="event-content"
        style={{
          backgroundImage: `url(/images/${currentEvent.imageFilenameFull}.webp)`,
        }}
      >
        <div className="event-main">
          <div className="event-content-title">
            {currentEvent.title.toUpperCase()}
          </div>
          <div className="event-content-summary">{currentEvent.summary}</div>
          <div className="event-content-date">
            Available{" "}
            {format(new Date(currentEvent.launchDate), "MMMM dd yyyy")}
          </div>
        </div>
        <div className="event-action">
          <a
            type="button"
            target="_blank"
            rel="noreferrer"
            className="event-content-learn"
            href={currentEvent.learnMoreLink}
          >
            Learn More
          </a>
          <a
            type="button"
            target="_blank"
            rel="noreferrer"
            className="event-content-order"
            href={currentEvent.purchaseLink}
          >
            Pre Order Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default EventContent;

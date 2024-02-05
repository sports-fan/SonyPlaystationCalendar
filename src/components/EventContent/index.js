import React from "react";
import { format } from "date-fns";

import "./styles.scss";

const EventContent = ({ currentEvent }) => {
  return (
    <div className="event-container">
      <div
        className="event"
        style={{
          backgroundImage: `url(/images/${currentEvent.imageFilenameFull}.webp)`,
        }}
      >
        <div className="event-content">
          <div className="event-content__title">
            {currentEvent.title.toUpperCase()}
          </div>
          <div className="event-content__summary">{currentEvent.summary}</div>
          <div className="event-content__date">
            Available{" "}
            {format(new Date(currentEvent.launchDate), "MMMM dd yyyy")}
          </div>
        </div>
        <div className="event-action">
          <a
            type="button"
            target="_blank"
            rel="noreferrer"
            className="event-action__learn"
            href={currentEvent.learnMoreLink}
          >
            Learn More
          </a>
          <a
            type="button"
            target="_blank"
            rel="noreferrer"
            className="event-action__order"
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

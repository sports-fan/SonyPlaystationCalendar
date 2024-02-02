import React from "react";
import { getDate } from "date-fns";

import "./styles.css";

const CalendarCell = ({ day, event, onClickEvent }) => {
  return (
    <div className="day" onClick={() => onClickEvent(day)}>
      {!!event && (
        <img
          src={`/images/${event.detail.imageFilenameThumb}.webp`}
          alt="thumb"
          className="event-thumb"
        />
      )}
      <div className="day-number">
        <div className={event ? "event-active" : "event-inactive"}>
          {day && getDate(day)}
        </div>
      </div>
    </div>
  );
};

export default CalendarCell;

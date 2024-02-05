import React from "react";
import { getDate } from "date-fns";

import "./styles.scss";

const CalendarCell = ({ day, event, onClickEvent }) => {
  return day !== "" ? (
    <div className="cell" onClick={() => onClickEvent(day)}>
      {!!event && (
        <img
          src={`/images/${event.detail.imageFilenameThumb}.webp`}
          alt="thumb"
          className="cell__thumb"
        />
      )}
      <div className="cell__number">
        <div
          className={event ? "cell__number--active" : "cell__number--inactive"}
        >
          {day && getDate(day)}
        </div>
      </div>
    </div>
  ) : (
    <div />
  );
};

export default CalendarCell;

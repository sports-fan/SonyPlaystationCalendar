import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  getDate,
  getDay,
  getMonth,
  getYear,
} from "date-fns";
import axios from "axios";

import { WEEK_NAMES } from "utils/constants";
import eventsData from "../../utils/events.json";
import EventContent from "components/EventContent";
import CalendarCell from "components/CalendarCell";
import "./styles.css";

const Calendar = () => {
  const { year, month } = useParams();

  const [isValidDate, setIsValidDate] = useState(true);
  const [events, setEvents] = useState([]);
  const [showEvent, setShowEvent] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    if (month > 12 || month < 1) setIsValidDate(false);
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://amock.io/");
        return response.data;
      } catch (error) {
        console.error("Error fetching events", error);
      }
    };

    fetchEvents();
    const validEvents = eventsData.reduce((acc, data) => {
      const isValid =
        getMonth(new Date(data.launchDate)) + 1 === parseInt(month) &&
        getYear(new Date(data.launchDate)) === parseInt(year);

      if (isValid) {
        acc.push({
          date: getDate(data.launchDate),
          detail: data,
        });
      }

      return acc;
    }, []);

    setEvents(validEvents);
    setCurrentEvent({});
    setShowEvent(false);
  }, [month, year]);

  useEffect(() => {
    if (!isValidDate) {
      setIsValidDate(true);
      const date = new Date();
      navigate(`/${getYear(date)}/${getMonth(date) + 1}`);
    }
  }, [isValidDate, navigate]);

  const daysInMonthWithEvent = useMemo(() => {
    const dayOfWeek = getDay(new Date(year, month - 1, 1));
    const days = eachDayOfInterval({
      start: startOfMonth(new Date(year, month - 1)),
      end: endOfMonth(new Date(year, month - 1)),
    });
    const ary = new Array(dayOfWeek).fill("");
    const result = days.reduce((acc, day, i) => {
      if (i + dayOfWeek === 14) acc.push("event");
      acc.push(day);
      return acc;
    }, ary);

    return result;
  }, [year, month]);

  const getMonthName = useCallback(
    (monthNumber) => {
      const date = new Date(year, monthNumber - 1);
      return format(date, "MMMM");
    },
    [year]
  );

  const handleNextMonth = useCallback(() => {
    const newYear = month === "12" ? parseInt(year) + 1 : year;
    const newMonth = month === "12" ? 1 : parseInt(month) + 1;

    navigate(`/${newYear}/${newMonth}`);
  }, [year, month, navigate]);

  const handlePrevMonth = useCallback(() => {
    const newYear = month === "1" ? parseInt(year) - 1 : year;
    const newMonth = month === "1" ? 12 : parseInt(month) - 1;

    navigate(`/${newYear}/${newMonth}`);
  }, [year, month, navigate]);

  const getEventDataOfDate = useCallback(
    (date) => events.filter((event) => event.date === getDate(date))[0],
    [events]
  );

  const handleEvent = useCallback(
    (date) => {
      const event = getEventDataOfDate(date);
      if (!event) {
        setCurrentEvent({});
        setShowEvent(false);
        return;
      }

      setCurrentEvent(event.detail);
      setShowEvent(true);
    },
    [getEventDataOfDate]
  );

  return (
    <div className="container">
      <div className="current-month">
        <div className="prev-month" key="prev btn" onClick={handlePrevMonth}>
          ❮
        </div>
        <div className="current-month-title">
          {getMonthName(month)} {year}
        </div>
        <div className="next-month" key="next btn" onClick={handleNextMonth}>
          ❯
        </div>
      </div>
      <div className="calendar-grid">
        {WEEK_NAMES.map((name, idx) => (
          <div className="week-names" key={idx}>
            {name}
          </div>
        ))}
        {daysInMonthWithEvent.map((day, idx) =>
          idx === 14 ? (
            showEvent ? (
              <EventContent key={idx} currentEvent={currentEvent} />
            ) : null
          ) : (
            <CalendarCell
              key={idx}
              day={day}
              event={getEventDataOfDate(day)}
              onClickEvent={handleEvent}
            />
          )
        )}
      </div>
    </div>
  );
};

export default Calendar;

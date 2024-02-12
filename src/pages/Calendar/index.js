import React, { useCallback, useEffect, useState } from "react";
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
  getWeekOfMonth,
  lastDayOfMonth,
} from "date-fns";
import axios from "axios";

import { WEEK_DAY_NAMES } from "utils/constants";
import eventsData from "../../utils/events.json";
import EventContent from "components/EventContent";
import CalendarCell from "components/CalendarCell";
import "./styles.scss";

const Calendar = () => {
  const { year, month } = useParams();

  const [isValidDate, setIsValidDate] = useState(true);
  const [events, setEvents] = useState([]);
  const [showEvent, setShowEvent] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({});
  const [daysWithEvents, setDaysWithEvent] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Check if the month value is outside the valid range (1-12) and update state accordingly
    if (month > 12 || month < 1) setIsValidDate(false);

    // Define an asynchronous function to fetch event data
    const fetchEvents = async () => {
      try {
        // Attempt to fetch data from the provided URL
        const response = await axios.get("http://amock.io/");
        // Return the data from the response
        return response.data;
      } catch (error) {
        // Log an error message if the fetch fails
        console.error("Error fetching events", error);
      }
    };

    // Call the fetchEvents function to execute the data fetching
    fetchEvents();

    // Filter and transform events data to only include events relevant to the current month and year
    const validEvents = eventsData.reduce((acc, data) => {
      // Check if the event launch date matches the current month and year
      const isValid =
        getMonth(new Date(data.launchDate)) + 1 === parseInt(month) &&
        getYear(new Date(data.launchDate)) === parseInt(year);

      // If the event date is valid, add it to the accumulator with formatted date and detail
      if (isValid) {
        acc.push({
          date: getDate(data.launchDate),
          detail: data,
        });
      }

      return acc;
    }, []);

    // Calculate the day of the week for the first day of the current month and year
    const dayOfWeek = getDay(new Date(year, month - 1, 1));
    // Create an array filled with empty strings up to the first day of the week
    const ary = new Array(dayOfWeek).fill("");
    // Generate an array of dates for each day of the current month
    const days = eachDayOfInterval({
      start: startOfMonth(new Date(year, month - 1)),
      end: endOfMonth(new Date(year, month - 1)),
    });
    // Append the days of the month to the initial array of empty strings
    const result = ary.concat(days);

    // Update the state with the processed data
    setDaysWithEvent(result);
    setEvents(validEvents);
    setCurrentEvent({});
    setShowEvent(false);
  }, [month, year]);

  useEffect(() => {
    if (!isValidDate) {
      // Set the date to be valid
      setIsValidDate(true);

      // Create a new Date object for the current date
      const date = new Date();

      // Navigate to a URL with the current year and month
      navigate(`/${getYear(date)}/${getMonth(date) + 1}`);
    }
  }, [isValidDate, navigate]);

  const getMonthName = useCallback(
    (monthNumber) => {
      // Create a new Date object using the provided monthNumber and the current year from the component's state
      const date = new Date(year, monthNumber - 1);

      // Use the 'format' function to get a string representing the month's full name (e.g., "January", "February", etc.)
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
      // Fetch event data for the given date
      const event = getEventDataOfDate(date);

      // If no event is found for the selected date, reset the current event and hide the event display
      if (!event) {
        setCurrentEvent({});
        setShowEvent(false);
        return;
      }

      // Calculate the week number of the month for the selected date
      const numberOfWeeks = getWeekOfMonth(date);
      // Calculate the day of the week for the first day of the current month
      const firstDayOfWeek = getDay(new Date(year, month - 1, 1));
      // Calculate the day of the week for the last day of the current month
      const lastDayofWeek = getDay(lastDayOfMonth(date));

      // Generate an array of all days in the current month
      const days = eachDayOfInterval({
        start: startOfMonth(new Date(year, month - 1)),
        end: endOfMonth(new Date(year, month - 1)),
      });
      // Prepend empty strings to align the first day of the month with the correct day of the week
      let ary = new Array(firstDayOfWeek).fill("").concat(days);
      // Append empty strings to complete the last week of the month
      ary = ary.concat(new Array(7 - lastDayofWeek).fill(""));

      // Insert an "event" marker at the calculated position based on the selected date's week number
      const result = ary.reduce((acc, day, i) => {
        // Check if the current index corresponds to the position for the event marker
        if (i + firstDayOfWeek === 7 * numberOfWeeks) {
          acc.splice(i + firstDayOfWeek, 0, "event");
        }

        return acc;
      }, ary);

      // Update the state with the new array of days, including the "event" marker
      setDaysWithEvent(result);
      // Update the current event details for display
      setCurrentEvent(event.detail);
      // Show the event details
      setShowEvent(true);
    },
    [year, month, getEventDataOfDate]
  );

  return (
    <div className="container">
      <div className="current-month">
        <div
          className="current-month__btn"
          key="prev btn"
          onClick={handlePrevMonth}
        >
          ❮
        </div>
        <div className="current-month__title">
          {getMonthName(month)} {year}
        </div>
        <div
          className="current-month__btn"
          key="next btn"
          onClick={handleNextMonth}
        >
          ❯
        </div>
      </div>
      <div className="calendar">
        {WEEK_DAY_NAMES.map((name, idx) => (
          <div className="calendar__weeknames" key={idx}>
            {name}
          </div>
        ))}
        {daysWithEvents.map((day, idx) =>
          day === "event" ? (
            showEvent && <EventContent key={idx} currentEvent={currentEvent} />
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

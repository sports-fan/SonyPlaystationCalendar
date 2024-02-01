import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, getMonth, getYear, getDate } from 'date-fns'

import eventsData from './events.json';
import './styles.css';

const Calendar = () => {
  const { year, month } = useParams();

  const [isValidDate, setIsValidDate] = useState(true);
  const [events, setEvents] = useState([])

  const navigate = useNavigate();

  useEffect(() => {
    if (month > 12) setIsValidDate(false)

    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://amock.io/');
        return response.data;
      } catch (error) {
        console.error('Error fetching events', error);
      }
    };

    fetchEvents();
    const validEvents = eventsData.reduce((acc, data) => {
      const isValid = getMonth(new Date(data.launchDate)) + 1 === parseInt(month) && getYear(new Date(data.launchDate)) === parseInt(year)

      if(isValid) {
        acc.push({
          date: getDate(data.launchDate),
          detail: data
        })
      }

      return acc
    }, [])

    setEvents(validEvents)
  }, [month, year]);

  if (!isValidDate) {
    setIsValidDate(true)
    const date = new Date()
    navigate(`/${year}/${date.getMonth() + 1}`);
  }

  const daysInMonth = useMemo(() => eachDayOfInterval({
    start: startOfMonth(new Date(year, month - 1)),
    end: endOfMonth(new Date(year, month - 1))
  }), [year, month]);

  const getMonthName = (monthNumber) => {
    const date = new Date(year, monthNumber - 1);
    return format(date, 'MMMM');
  };

  const handleNextMonth = useCallback(() => {
    const newYear = month === '12' ? parseInt(year) + 1 : year;
    const newMonth = month === '12' ? 1 : parseInt(month) + 1;

    navigate(`/${newYear}/${newMonth}`);
  }, [year, month, navigate])

  const handlePrevMonth = useCallback(() => {
    const newYear = month === '1' ? parseInt(year) - 1 : year;
    const newMonth = month === '1' ? 12 : parseInt(month) - 1;

    navigate(`/${newYear}/${newMonth}`);
  }, [year, month, navigate])

  const WEEK_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  const getEventDataOfDate = useCallback((date) =>
    events.filter((event) => event.date === getDate(date))[0]
  , [events])

  return (
    <div className='container'>
      <div className='currentMonth'>
        <div className='prevMonth' onClick={handlePrevMonth}>❮</div>
        <div className='currentMonthTitle'>{getMonthName(month)} {year}</div>
        <div className='nextMonth' onClick={handleNextMonth}>❯</div>
      </div>
      <div className='calendarGrid'>
        {WEEK_NAMES.map((name, idx) => (
          <div className='weekNames' key={idx}>
            {name}
          </div>
        ))}
        {daysInMonth.map((day, idx) =>
          <div key={idx} className='day'>
            {!!getEventDataOfDate(day) && <img src={`/images/${getEventDataOfDate(day).detail.imageFilenameThumb}.webp`} alt="thumb" className='game-thumb' />}
            <div className='day-number'>
              <div className={!!getEventDataOfDate(day) && 'active'}>{day.getDate()}</div>
            </div>
          </div>)}
      </div>
    </div>
  )
};

export default Calendar;
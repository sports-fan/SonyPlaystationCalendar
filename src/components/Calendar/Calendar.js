import React, { useCallback, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns'

import './styles.css';

const Calendar = () => {
  const { year, month } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log({ year }, { month })
  }, [year, month]);

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

  return (
    <div className='container'>
      <div className='currentMonth'>
        <div className='prevMonth' onClick={ handlePrevMonth }>❮</div>
        <div className='currentMonthTitle'>{ getMonthName(month) } { year }</div>
        <div className='nextMonth' onClick={ handleNextMonth }>❯</div>
      </div>
      <div className='calendarGrid'>
        {WEEK_NAMES.map((name, idx) => (
          <div className='weekNames' key={idx}>
            { name }
          </div>
        ))}
        {daysInMonth.map((day, idx) => (
          <div key={idx} className='day'>
            { day.getDate() }
          </div>
        ))}
      </div>
    </div>
  )
};

export default Calendar;
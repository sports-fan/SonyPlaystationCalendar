import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Calendar = () => {
  const { year, month } = useParams();

  useEffect(() => {
    console.log({ year }, { month })
  }, [year, month]);

  return (
    <div>
      Sony Playstation Calendar. { year } / { month }
    </div>
  );
};

export default Calendar;
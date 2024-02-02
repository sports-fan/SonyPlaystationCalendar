import React, { useEffect } from "react";
import { getMonth, getYear } from "date-fns";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const date = new Date();

    navigate(`/${getYear(date)}/${getMonth(date) + 1}`)
  }, [navigate]);
  return (<></>);
}

export default Home;
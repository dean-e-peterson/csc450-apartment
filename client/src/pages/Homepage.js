import React, { useState, useEffect } from "react";
import axios from "axios";
import Location from "../layout/Location";

export default function Homepage() {
  const [vacancies, setVacancies] = useState([]);

  useEffect(() => {
    const getVacancies = async () => {
      try {
        const response = await axios.get("/api/units/vacancies");

        setVacancies(response.data);
      } catch (err) {
        console.error(err.message);
      }
    }
    getVacancies();
  }, []);
  
  return (
    [1,2].map(locationNumber =>
      <Location
        key={locationNumber}
        locationNumber={locationNumber}
        vacancies={vacancies.filter(vacancy => vacancy.location === String(locationNumber))}
      />
    )
  );
}

import React, { useState, useEffect } from "react";
import axios from "axios";
import Location from "../layout/Location";

export default function Homepage({ authUser }) {
  const [locations, setLocations] = useState([]);
  const [vacancies, setVacancies] = useState([]);

  useEffect(() => {
    const getLocations = async () => {
      try {
        const response = await axios.get("/api/locations");
        setLocations(response.data);
      } catch (err) {
        console.error(err.message);
      }
    }
    const getVacancies = async () => {
      try {
        const response = await axios.get("/api/units/vacancies");

        setVacancies(response.data);
      } catch (err) {
        console.error(err.message);
      }
    }

    getLocations();
    getVacancies();
  }, []);
  
  return (
    locations.map(location =>
      <Location
        key={location._id}
        location={location}
        vacancies={vacancies.filter(vacancy => vacancy.location === location._id)}
        authUser={authUser}
      />
    )
  );
}

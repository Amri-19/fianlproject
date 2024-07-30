import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Appointments = ({ token }) => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/appointments', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, [token]);

  return (
    <div>
      <h1>Your Appointments</h1>
      <ul>
        {appointments.map((appointment, index) => (
          <li key={index}>
            {appointment.patientName} - {appointment.date} at {appointment.time}
            <p>{appointment.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Appointments;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/appointments', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/appointments/${id}/status`, { status: 'approved' }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAppointments(appointments.filter(app => app._id !== id));
    } catch (error) {
      console.error('Error approving appointment:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/appointments/${id}/status`, { status: 'rejected' }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAppointments(appointments.filter(app => app._id !== id));
    } catch (error) {
      console.error('Error rejecting appointment:', error);
    }
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <ul>
        {appointments.map(appointment => (
          <li key={appointment._id}>
            {appointment.patientName} - {appointment.date} at {appointment.time}
            <p>{appointment.description}</p>
            <button onClick={() => handleApprove(appointment._id)}>Approve</button>
            <button onClick={() => handleReject(appointment._id)}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;

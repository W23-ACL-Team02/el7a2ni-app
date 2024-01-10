import React, { useState } from 'react';
import axios from 'axios';
import '../css/addAdmin.css'
import { useParams } from 'react-router-dom';
const baseURL = process.env.REACT_APP_SERVER_URL;


const RescheduleAppointmentPage = () => {
 // const { appointmentId } = useParams();

  const [formData, setFormData] = useState({
    newDate: '',
    newStartTime: '',
    newEndTime: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const parameters = new URLSearchParams(window.location.search);
  const appointmentId = parameters.get('appointmentId');
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const rescheduleData = {
        appointmentId,
        newDate: formData.newDate,
        newStartTime: formData.newStartTime,
        newEndTime: formData.newEndTime
      };
      console.log(rescheduleData)

      const response = await axios.post(`${baseURL}/clinic/private/doctor/reschedulePatientAppointment`,  rescheduleData ,{withCredentials: true }); // Replace with your endpoint
      console.log(response.data); // Handle success message
      setSuccessMessage('Appointment rescheduled successfully');
    } catch (error) {
      console.error('Error rescheduling appointment: ', error);

      if (error.response && error.response.data) {
        // If the server responded with an error message
        console.error('Server error:', error.response.data);
        // Handle the error message as per your application's requirements
      } else {
        // If there's a network error or any other error without a response data
        console.error('Network error or something went wrong:', error.message);
        // Handle the error message as per your application's requirements
      }
    }
  }; // <- Add a closing brace for the handleSubmit function here
  return (
    <div className="container">
      <div className="rectangle2">
        <h2>Reschedule Appointment</h2>
        <form onSubmit={handleSubmit} className="form">
          <div className="input">
            <label htmlFor="newDate">New Date:</label>
            <input
              type="date"
              placeholder="New Date"
              name="newDate"
              value={formData.newDate}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div className="input">
            <label htmlFor="newStartTime">Start Time:</label>
            <input
              type="time"
              placeholder="New Start Time"
              name="newStartTime"
              value={formData.newStartTime}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div className="input">
            <label htmlFor="newEndTime">End Time:</label>
            <input
              type="time"
              placeholder="New End Time"
              name="newEndTime"
              value={formData.newEndTime}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <button type="submit" className="submit-button">
            Reschedule
          </button>
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </form>
      </div>
    </div>
  );
  
};

export default RescheduleAppointmentPage;

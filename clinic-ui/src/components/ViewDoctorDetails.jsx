import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewDoctorDetails = () => {
  const doctorId = localStorage.getItem('doctorId');
  const [discountRate, setDiscountRate] = useState(0);
  const [doctorVar, setDoctorVar] = useState(null);
  const [selectedAppointmentStartTime, setSelectedAppointmentStartTime] = useState(null);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        if (doctorId) {
          const response = await axios({
            method: 'get',
            url: `http://localhost:3000/private/patientRouter/viewDoctorDetails/${doctorId}`,
            withCredentials: true,
          });

          setDoctorVar(response.data.doctor);
          setDiscountRate(response.data.discountRate);
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchDoctorDetails();
  }, [doctorId]);

  const handleBooking = async (date, startTime, endTime) => {
    // Implement your booking logic here
    console.log(`Book Now clicked for ${date}, ${startTime} to ${endTime}`);
    setSelectedAppointmentStartTime(startTime);

    try {

      console.log('Selected Appointment:', selectedAppointmentStartTime);
  
      const response = await axios.post('http://localhost:3000/private/patientRouter/bookAppointment',
        {
          timeSlotStartTime: selectedAppointmentStartTime,
          doctorUsername: doctorVar.username,
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      console.log('Response:', response.data);
  
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <style>
        {`
          .doctor-details-container {
            font-family: 'Arial', sans-serif;
          }

          .time-slots-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }

          .time-slots-table th, .time-slots-table td {
            border: 1px solid #008000;
            padding: 8px;
            text-align: left;
            font-size: 14px;
          }

          .time-slots-table th {
            background-color: #008000;
            color: white;
          }

          .book-now-button {
            background-color: #4caf50;
            border: none;
            color: white;
            padding: 8px 16px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 14px;
            cursor: pointer;
          }
        `}
      </style>
      <h1>Doctor {doctorVar?.name}'s details</h1>
      <p>Speciality: {doctorVar?.speciality}</p>
      <p>Session Price: {Math.round(doctorVar?.payRate * 1.1 * (1 - discountRate))}€</p>
      <p>Graduated from: {doctorVar?.education.name} in {doctorVar?.education.endYear} </p>
      <p>Affiliated With: {doctorVar?.affiliation} </p>
      <h2>Time Slots: ({Math.round(doctorVar?.payRate * 1.1 * (1 - discountRate))}€ per session)</h2>
      <table className="time-slots-table">
        <thead>
          <tr>
            <th>Actions</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
          </tr>
        </thead>
        <tbody>
          {doctorVar?.timeSlots.map((timeSlot, index) => (
            <tr key={index}>
              <td>
                <button className="book-now-button" onClick={() => handleBooking(timeSlot.date, timeSlot.startTime, timeSlot.endTime)}>
                  Book Now!
                </button>
              </td>
              <td>{new Date(timeSlot.date).toLocaleDateString('en-DE')}</td>
              <td>{new Date(timeSlot.startTime).toLocaleTimeString('en-DE', { hour: '2-digit', minute: '2-digit' })}</td>
              <td>{new Date(timeSlot.endTime).toLocaleTimeString('en-DE', { hour: '2-digit', minute: '2-digit' })}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedAppointmentStartTime && (
        <p>Selected Appointment Start Time: {new Date(selectedAppointmentStartTime).toLocaleTimeString('en-DE', { hour: '2-digit', minute: '2-digit' })}</p>
      )}
    </div>
  );
};

export default ViewDoctorDetails;

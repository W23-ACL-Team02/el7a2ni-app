import React, { useState, useEffect } from 'react';
import axios from 'axios';
const serverURL = process.env.REACT_APP_SERVER_URL;

const ScheduleFollowUp = () => {
  const [error, setError] = useState('');
  //input variables
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState('');
  //output variables
  const [patientNames, setPatientNames] = useState([]);
  const [availableAppointments, setAvailableAppointments] = useState([]);
  const [docName, setDocName] = useState('');

  useEffect(() => {
    const getPatientsAndAppts = async () => {
      try {
        const response = await axios({
          method: 'get',
          url: `${serverURL}/clinic/private/doctor/selectFollowUpMenu`,
          withCredentials: true,
        });

        setPatientNames(response.data.patientsNames);
        setAvailableAppointments(response.data.availableTimeslots);
        setDocName(response.data.docName);

        if (response.data.availableTimeslots.length === 0) {
          console.log('Doc has no available appointments/timeslots');
        }
        if (response.data.patientsNames.length === 0) {
          console.log('Doc has no patients with previous appointments');
        }

        if (!(selectedAppointment === '' || selectedPatient === '')) {
          setError('Choose a patient and an appointment, please.');
          return;
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    getPatientsAndAppts();
  }, [selectedAppointment, selectedPatient]);

  const schedulefollowup = async () => {
    if (selectedAppointment === '' || selectedPatient === '') {
      setError('Choose a patient and an appointment, please.');
      return;
    }
  
    try {
      console.log('Selected Patient:', selectedPatient);
      console.log('Selected Appointment:', selectedAppointment);
  
      const response = await axios.post(`${serverURL}/clinic/private/doctor/scheduleFollowUp`,
        {
          patName: selectedPatient,
          timeSlotStartTime: selectedAppointment,
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      console.log('Response:', response.data);
  
      setError('');
    } catch (error) {
      console.error(error.message);
      setError('Failed to schedule follow-up appointment');
    }
  };
  
  const renderAppointmentOptions = () => {
    if (!Array.isArray(availableAppointments)) {
      return null;
    }
  
    return availableAppointments.map((appointment) => {
      const startTime = new Date(appointment.startTime);
      const formattedStartTime = startTime.toLocaleString('en-DE', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
      });
  
      return (
        <option key={appointment.startTime} value={appointment.startTime}>
          {formattedStartTime}
        </option>
      );
    });
  };

  return (
    <div>
      <h1>Schedule follow up appointment as {docName}</h1>
      <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '10px' }}>
        <div>
          <label>
            Patient Names:
            <select value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)}>
              <option value="">Select Patient</option>
              {patientNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div style={{ marginRight: '10px' }}>
          <label>
            Available Timeslots:
            <select value={selectedAppointment} onChange={(e) => setSelectedAppointment(e.target.value)}>
              <option value="">Select Appointment Time</option>
              {renderAppointmentOptions()}
            </select>
          </label>
        </div>
        <div>
          <button onClick={schedulefollowup}>Schedule The follow up appointment</button>
        </div>
      </div>
      {error && <div><h2>{error}</h2></div>}
    </div>
  );
};


export default ScheduleFollowUp;

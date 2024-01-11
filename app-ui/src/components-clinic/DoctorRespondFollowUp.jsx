import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorRespondFollowUp = () => {
    const [pendingAppts, setPendingAppts] = useState([]);
    const [patientNames, setPatientNames] = useState([]);
    const [apptID, setApptID] = useState('');
    const [displayMessage, setDisplayMessage] = useState('');
    const [refreshData, setRefreshData] = useState(false);


    useEffect(() => {
        const getRequests = async () => {
            try {
                const response = await axios.get('http://localhost:3000/clinic/private/doctor/viewRequestedFollowUps');
                setPendingAppts(response.data.pendingAppts);
                setPatientNames(response.data.patientNames);
                console.log(pendingAppts)
                console.log(patientNames)                
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (refreshData) {
            getRequests();
            setRefreshData(false);
        }
    }, [refreshData]);

    const acceptFollowUp = async (apptID) => {
        setApptID(apptID);
        
        try {        
            const response = await axios.post('http://localhost:3000/clinic/private/doctor/respondToRequestedFollowUps',
              {
                appointmentID: apptID,
                followUpStatus: 'accept',
              },
              {
                withCredentials: true,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );

            setPendingAppts((previousAppointments) => previousAppointments.filter(appt => appt._id !== apptID));
            console.log('Response:', response.data);
            setDisplayMessage('Succesfully accepted the appointment');
            setRefreshData(true);
          } catch (error) {
            console.error(error.message);
            setDisplayMessage('Failed to accept follow-up appointment');
          }
    };

    const rejectFollowUp = async (apptID) => {
        setApptID(apptID);
        
        try {
            const response = await axios.post(
                'http://localhost:3000/clinic/private/doctor/respondToRequestedFollowUps',
                {
                    appointmentID: apptID,
                    followUpStatus: 'reject',
                },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            setPendingAppts((previousAppointments) => previousAppointments.filter(appt => appt._id !== apptID));
            console.log('Response:', response.data);
            setDisplayMessage('Succesfully rejected the appointment');
            setRefreshData(true);
        } catch (error) {
            console.error(error.message);
            setDisplayMessage('Failed to reject follow-up appointment');
        }
    };


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
      
        return `${day}-${month}-${year} / ${hours}:${minutes}`;
      };
      

return (
    <div>
        <h1>Respond to Follow-Up Requests from patients</h1>
        <table>
            <thead>
                <tr>
                    <th>Patient Name</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {pendingAppts.map((appt, index) => (
                    <tr key={index}>
                        <td>{patientNames[index]}</td>
                        <td>{formatDate(appt.start)}</td>
                        <td>{formatDate(appt.end)}</td>
                        <td>
                            <button onClick={() => acceptFollowUp(appt._id)}>Accept</button>
                            <button onClick={() => rejectFollowUp(appt._id)}>Reject</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        <div><h2>{displayMessage}</h2></div>
    </div>
);

};

export default DoctorRespondFollowUp;

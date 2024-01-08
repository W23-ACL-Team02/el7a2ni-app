import React, { useState } from 'react';
import axios from 'axios';

const FollowUp2 = () => {
    const [availableDate, setAvailableDate] = useState('');
    const [newDate, setNewDate] = useState('');
    const [apptDuration, setApptDuration] = useState(45);

    const patname = localStorage.getItem('patname');
    const relationship = localStorage.getItem('relationship');
    const docname = localStorage.getItem('docname');
    const docspec = localStorage.getItem('docspec');
    const date = localStorage.getItem('date');
    const prevapptID = localStorage.getItem('prevapptID');

    const selectedAvailableDate = (e) => {
        setAvailableDate(e.target.value);
    };

    const selectedNewDate = (e) => {
        setNewDate(e.target.value);
    };

    const handleNumericChange = (e) => {
        setApptDuration(e.target.value);
    };

    const followUpAttempt = async () => {
        if (availableDate === '' && newDate === '') { // no date selected

        } else if (availableDate === '' && newDate !== '') { // selected a brand new date
            const response = await axios.post(
                'http://localhost:3000/private/patient/PatientRequestFollowUp',
                {
                    apptDate: newDate,
                    apptID: prevapptID,
                    duration: apptDuration,
                },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        } else if (availableDate !== '' && newDate === '') { // selected an already available timeslot
            // const response = await axios.post(
            //     'http://localhost:3000/private/patient/PatientRequestFollowUp',
            //     {
            //         apptDate: availableDate,
            //         apptID: prevapptID,
            //     },
            //     {
            //         withCredentials: true,
            //         headers: {
            //             'Content-Type': 'application/json',
            //         },
            //     }
            // );
        }
    };

    return (
        <div>
            <h1>Schedule Follow Up</h1>
            <p>Patient Name: {patname}</p>
            <p>Relationship to logged in user: {relationship}</p>
            <p>Doctor Name: {docname}</p>
            <p>Doctor Speciality: {docspec}</p>
            <p>Previous Appointment Date: {date}</p>

            <div>
                <label htmlFor="followUpOptions">Select Follow-Up Option:</label>
                <select
                    id="followUpOptions"
                    name="followUpOptions"
                    value={availableDate}
                    onChange={selectedAvailableDate}
                >
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                </select>
            </div>

            <p style={{ margin: '10px' }}>OR</p>

            <div>
                <label htmlFor="followUpDate">Select the Follow-Up Date:</label>
                <input
                    type="date"
                    id="followUpDate"
                    name="followUpDate"
                    value={newDate}
                    onChange={selectedNewDate}
                />

                <label htmlFor="additionalInfo">Duration(in minutes(30-60)):</label>
                <input
                    type="number"
                    id="additionalInfo"
                    name="additionalInfo"
                    value={apptDuration}
                    onChange={handleNumericChange}
                    min="30"
                    max="60"
                />
            </div>

            <button onClick={followUpAttempt}>Confirm Follow-Up</button>
        </div>
    );
};

export default FollowUp2;

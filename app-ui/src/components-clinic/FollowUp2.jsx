import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FollowUp2 = () => {
    const [newDate, setNewDate] = useState('');
    const [apptDuration, setApptDuration] = useState(45);
    const [displayMessage, setDisplayMessage] = useState('');
    const [updateTrigger, setUpdateTrigger] = useState(false);


    const patname = localStorage.getItem('patname');
    const relationship = localStorage.getItem('relationship');
    const docname = localStorage.getItem('docname');
    const docspec = localStorage.getItem('docspec');
    const date = localStorage.getItem('date');
    const prevapptID = localStorage.getItem('prevapptID');

    useEffect(() => {
        
    }, [newDate,displayMessage,updateTrigger]);

    

    const selectedNewDate = (e) => {
        setNewDate(e.target.value);
    };

    const handleNumericChange = (e) => {
        setApptDuration(e.target.value);
    };

    const followUpAttempt = async () => {
        try{
            if (newDate === '' || apptDuration === ''){
                setDisplayMessage('No appointment selected');
                setUpdateTrigger(!updateTrigger);
            }
            else if (newDate !== '' && apptDuration !== ''){
                try{
                    const response = await axios.post(
                        'http://localhost:3000/clinic/private/patient/PatientRequestFollowUp',
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
                    }catch(error){
                        setDisplayMessage(`Error: ${error.message}`);
                    }finally{
                        setNewDate('');
                        setApptDuration(45);
                        setDisplayMessage('Follow up successfully requested');
                        setUpdateTrigger(!updateTrigger);
                    }
            }
            
        }catch(error){
            setDisplayMessage(`Error: ${error.message}`);
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
            <h1>Schedule Follow Up</h1>
            <p>Patient Name: {patname}</p>
            <p>Relationship to logged in user: {relationship}</p>
            <p>Doctor Name: {docname}</p>
            <p>Doctor Speciality: {docspec}</p>
            <p>Previous Appointment Date: {formatDate(date)}</p>

            <div>
                <label htmlFor="followUpDate">Propose a new Follow-Up Date:</label>
                <input
                    type="datetime-local"
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
            <br></br>
            <button onClick={followUpAttempt}>Confirm Follow-Up</button>
            <br></br>
            {displayMessage && <div><h2>{displayMessage}</h2></div>}
        </div>
    );
};

export default FollowUp2;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const FollowUp2 = () => {
//     // const [availableDate, setAvailableDate] = useState('');
//     const [newDate, setNewDate] = useState('');
//     const [apptDuration, setApptDuration] = useState(45);
//     const [displayMessage, setDisplayMessage] = useState('');
//     const [selectedStartTime, setSelectedStartTime] = useState('');
//     const [selectedEndTime, setSelectedEndTime] = useState('');
//     const [updateTrigger, setUpdateTrigger] = useState(false);


//     const patname = localStorage.getItem('patname');
//     const relationship = localStorage.getItem('relationship');
//     const docname = localStorage.getItem('docname');
//     const docspec = localStorage.getItem('docspec');
//     const doctimeslots = JSON.parse(localStorage.getItem('doctimeslots')) || [];
//     const date = localStorage.getItem('date');
//     const prevapptID = localStorage.getItem('prevapptID');

//     useEffect(() => {
//         // try{
//         //     const response = await axios.get('http://localhost:3000/clinic/private/patient/loadFollowUpPage');

//         // }catch(error){
            
//         // }
//     }, [newDate,displayMessage,updateTrigger]);

//     // const selectedAvailableDate = (e) => {
//     //     const [startTime, endTime] = e.target.value.split('-');
//     //     setSelectedStartTime(startTime);
//     //     setSelectedEndTime(endTime);
//     //     setAvailableDate(e.target.value);
//     // };
    

//     const selectedNewDate = (e) => {
//         setNewDate(e.target.value);
//     };

//     const handleNumericChange = (e) => {
//         setApptDuration(e.target.value);
//     };

//     const followUpAttempt = async () => {
//         try{
//             if (newDate === '' || apptDuration === ''){
//                 setDisplayMessage('No appointment selected');
//                 setUpdateTrigger(!updateTrigger);
//             }
//             else if (newDate !== '' || apptDuration !== ''){
//                 try{
//                     const response = await axios.post(
//                         'http://localhost:3000/clinic/private/patient/PatientRequestFollowUp',
//                         {
//                             apptDate: newDate,
//                             apptID: prevapptID,
//                             duration: apptDuration,
//                         },
//                         {
//                             withCredentials: true,
//                             headers: {
//                                 'Content-Type': 'application/json',
//                             },
//                         }
//                         );
//                         setNewDate('');
//                         setApptDuration(45);
//                         setDisplayMessage('Follow up successfully requested');
//                     }catch(error){
                        
//                     }
//                     setUpdateTrigger(!updateTrigger);
//             }
            
//             // if (availableDate === '' && newDate === '') { // no date selected
//             //     setDisplayMessage('No appointment selected');
//             // } else if (availableDate === '' && newDate !== '') { // selected a brand new date
//             //     const response = await axios.post(
//             //         'http://localhost:3000/clinic/private/patient/PatientRequestFollowUp',
//             //         {
//             //             apptDate: newDate,
//             //             apptID: prevapptID,
//             //             duration: apptDuration,
//             //             existingTimeslot: false,
//             //         },
//             //         {
//             //             withCredentials: true,
//             //             headers: {
//             //                 'Content-Type': 'application/json',
//             //             },
//             //         }
//             //     );
//             //     setDisplayMessage('Follow up successfully requested');
//             // } else if (availableDate !== '' && newDate === '') { // selected an already available timeslot
//             //     console.log(availableDate);
//             //     const response = await axios.post(
//             //         'http://localhost:3000/clinic/private/patient/PatientRequestFollowUp',
//             //         {
//             //             start: selectedStartTime,
//             //             end: selectedEndTime,
//             //             apptID: prevapptID,
//             //             existingTimeslot: true,
//             //         },
//             //         {
//             //             withCredentials: true,
//             //             headers: {
//             //                 'Content-Type': 'application/json',
//             //             },
//             //         }
//             //     );
//             //     const updatedTimeslots = doctimeslots.filter(
//             //         (timeslot) =>
//             //             `${timeslot.startTime}-${timeslot.endTime}` !== availableDate
//             //     );
//             //     localStorage.setItem('doctimeslots', JSON.stringify(updatedTimeslots));
    
//             //     // Trigger a re-render
//             //     setUpdateTrigger(!updateTrigger);
//             // }
//             // else if(availableDate !== '' && newDate !== ''){
//             //     setDisplayMessage('cant select follow up because you input both times');
//             // }
//         }catch(error){
//             setDisplayMessage(`Error: ${error.message}`);
//         }
//     };

//     const formatDate = (dateString) => {
//         const date = new Date(dateString);

//         const day = date.getDate().toString().padStart(2, '0');
//         const month = (date.getMonth() + 1).toString().padStart(2, '0');
//         const year = date.getFullYear().toString();
//         const hours = date.getHours().toString().padStart(2, '0');
//         const minutes = date.getMinutes().toString().padStart(2, '0');
      
//         return `${day}-${month}-${year} / ${hours}:${minutes}`;
//     };

//     return (
//         <div>
//             <h1>Schedule Follow Up</h1>
//             <p>Patient Name: {patname}</p>
//             <p>Relationship to logged in user: {relationship}</p>
//             <p>Doctor Name: {docname}</p>
//             <p>Doctor Speciality: {docspec}</p>
//             <p>Previous Appointment Date: {formatDate(date)}</p>

//             {/* <div>
//                 <label htmlFor="followUpOptions">Select an already existing timeslot:</label>
//                 <select
//                     id="followUpOptions"
//                     name="followUpOptions"
//                     value={availableDate}
//                     onChange={selectedAvailableDate}
//                 >
//                     <option value="">Select a timeslot</option>
//                     {doctimeslots.map((timeslot, index) => (
//                         <option key={index} value={`${timeslot.startTime}-${timeslot.endTime}`}>
//                             {formatDate(timeslot.startTime)} - {formatDate(timeslot.endTime)}
//                         </option>
//                     ))}
//                 </select>
//             </div>

//             <p style={{ margin: '15px' }}>OR</p> */}

//             <div>
//                 <label htmlFor="followUpDate">Propose a new Follow-Up Date:</label>
//                 <input
//                     type="datetime-local"
//                     id="followUpDate"
//                     name="followUpDate"
//                     value={newDate}
//                     onChange={selectedNewDate}
//                 />

//                 <label htmlFor="additionalInfo">Duration(in minutes(30-60)):</label>
//                 <input
//                     type="number"
//                     id="additionalInfo"
//                     name="additionalInfo"
//                     value={apptDuration}
//                     onChange={handleNumericChange}
//                     min="30"
//                     max="60"
//                 />
//             </div>
//             <br></br>
//             <button onClick={followUpAttempt}>Confirm Follow-Up</button>
//             <br></br>
//             {displayMessage && <div><h2>{displayMessage}</h2></div>}
//         </div>
//     );
// };

// export default FollowUp2;

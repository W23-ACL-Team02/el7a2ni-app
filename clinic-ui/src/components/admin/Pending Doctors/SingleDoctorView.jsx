import { useEffect, useState } from "react";
import axios from 'axios';

const baseURL = process.env.REACT_APP_SERVER_URL; // Replace with your backend URL


export default function SingleDoctorView({doctor}) {
    const [isActioned, setIsActioned] = useState(false);
    const [message, setMessage] = useState('');

    const acceptDoctor = () => {
        axios.put(`${baseURL}/private/admin/pendingDoctors/approve`, { _id: doctor._id }, { withCredentials:true })
        .then((response) => {
            setMessage(response.data.successes[0]);
            setIsActioned(true);
        }).catch((error) => {
            setMessage(error.message);
            setIsActioned(true);
        })
    }

    const rejectDoctor = () => {
        axios.put(`${baseURL}/private/admin/pendingDoctors/reject`, { _id: doctor._id }, { withCredentials:true })
        .then((response) => {
            setMessage(response.data.successes[0]);
            setIsActioned(true);
        }).catch((error) => {
            setMessage(error.message);
            setIsActioned(true);
        })
    }

    return (
        <div className="container">
            <table className='table'>
                <thead>
                <tr>
                    <th>Username</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Date of Birth</th>
                    <th>Mobile</th>
                    <th>Gender</th>
                    <th>Hourly Rate</th>
                    <th>Affiliation</th>
                    <th>Educational Background: <br></br>
                    University Name</th>
                    <th>Graduation Year</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {       
                    <tr key={doctor._id} >
                        <td>{doctor.username}</td>
                        <td>{doctor.name}</td>
                        <td>{doctor.email}</td>
                        <td>{doctor.dateOfBirth}</td>
                        <td>{doctor.mobile}</td>
                        <td>{doctor.gender}</td>
                        <td>{doctor.payRate}</td>
                        <td>{doctor.affiliation}</td>
                        <td>{doctor.education && doctor.education.name}</td>
                        <td>{doctor.education && doctor.education.endYear}</td>
                        <td>
                            <button type="button" className="btn success" onClick={acceptDoctor}>Accept</button>
                            <button type="button" className="btn danger" onClick={rejectDoctor}>Reject</button>
                        </td>
                    </tr>
                }
                </tbody>
            </table>
            {isActioned && <h2>{message}</h2>}
        </div>
    )
}
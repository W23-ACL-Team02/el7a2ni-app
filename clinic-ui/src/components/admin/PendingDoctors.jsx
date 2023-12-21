import { useEffect, useState } from "react";
import axios from 'axios';
import DoctorsTable from './Pending Doctors/DoctorsTable'

const baseURL = process.env.REACT_APP_SERVER_URL; // Replace with your backend URL


export default function PendingDoctors() {
    const [pendingDoctors, setPendingDoctors] = useState([]);

    // Call to get details of specific user

    // Call to get all pending
    useEffect(() => {

        axios.get(`${baseURL}/private/admin/pendingDoctors/`, { withCredentials:true })
        .then((response) => {
            setPendingDoctors(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }, [])

    return (
        <div className="container">
            {/* Table of pending doctors */}
            <DoctorsTable doctors={pendingDoctors}/>
        </div>
    )
}
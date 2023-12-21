import React, { useState } from 'react'
import RegisterPatient from './RegisterPatient';
import RegisterDoctor from './RegisterDoctor';

export default function RegisterUser() {
    const [userType, setUserType] = useState("Patient");

    function toggleUserType() {
        if (userType === "Patient") {
            setUserType("Doctor")
        } else {
            setUserType("Patient")
        }
    }

    return (
        <fieldset className='container-main'>
            <legend>Register {userType}</legend>
            <button type="button" onClick={toggleUserType}>Change User Type</button>
            { userType === "Patient" ?
                <RegisterPatient></RegisterPatient>
                :
                <RegisterDoctor></RegisterDoctor>
            }
        </fieldset>
    )
}
import React, { useState } from 'react'
import RegisterPatient from './RegisterPatient';
import RegisterPharmacist from './RegisterPharmacist';

export default function RegisterUser() {
    const [userType, setUserType] = useState("Patient");

    function toggleUserType() {
        if (userType === "Patient") {
            setUserType("Pharmacist")
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
                <RegisterPharmacist></RegisterPharmacist>
            }
        </fieldset>
    )
}
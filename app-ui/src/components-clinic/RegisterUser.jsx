import React, { useState } from 'react'
import RegisterPatient from './RegisterPatient';
import RegisterDoctor from './RegisterDoctor';
import RegisterPharmacist from '../components-pharmacy/RegisterPharmacist';

export default function RegisterUser() {
    const [userType, setUserType] = useState("Patient");

    function toggleUserType() {
        if (userType === "Patient") {
            setUserType("Doctor")
        } else if(userType === "Doctor"){
            setUserType("Pharmacist")
        }else{
            setUserType("Patient")
        }
    }

    return (
        <fieldset className='container-main'>
            <legend>Register {userType}</legend>
            <button type="button" onClick={toggleUserType}>Change User Type</button>
            { userType === "Patient" && <RegisterPatient></RegisterPatient> }
            { userType === "Doctor" &&  <RegisterDoctor></RegisterDoctor> }
            { userType === "Pharmacist" && <RegisterPharmacist></RegisterPharmacist> }    
               
            
        </fieldset>
    )
}
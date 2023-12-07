import React, { useState } from 'react'
import PasswordValidityBox from './PasswordValidityBox'
import { validatePassword } from '../functions/validatePassword'

const baseURL = `http://localhost:3000`

export default function RegisterDoctor() {
    const [password, setPassword] = useState("")

    return (
        // TODO Change backend call
        <form className='container-main' action={`${baseURL}/public/user/register/doctor`} method="POST">
            <div class="form-group"><label for="username">Username</label><input class="form-control" type="text" name="username" placeholder="Username" required="required" autofocus="autofocus" /></div>
            <div class="form-group"><label for="name">Name</label><input class="form-control" type="text" name="name" placeholder="Name" required="required" /></div>
            <div class="form-group"><label for="email">Email</label><input class="form-control" type="email" name="email" placeholder="Email" required="required" /></div>
            <div class="form-group"><label for="password">Password</label><input class="form-control" type="password" name="password" required="required" onChange={e => setPassword(e.target.value)} /></div>
            <PasswordValidityBox password={password}></PasswordValidityBox>
            <div class="form-group"><label for="dateOfBirth">Date of Birth</label><input class="form-control" type="date" name="dateOfBirth" placeholder="Date of Birth" required="required" /></div>
            <div class="form-group"><label for="speciality">Choose your Speciality:</label><select id="selectOption" name="speciality"><option value="All">All</option><option value="General Practitioner">General Practitioner</option><option value="Cardiologist">Cardiologist</option><option value="Neurologist">Neurologist</option><option value="Dermatologist">Dermatologist</option><option value="Surgeon">Surgeon</option><option value="Ophthalmologist">Ophthalmologist</option><option value="Optometrist">Optometrist</option><option value="Pediatrician">Pediatrician</option><option value="Family Medicine">Family Medicine</option><option value="Radiologist">Radiologist</option><option value="Psychiatrist">Psychiatrist</option><option value="Anesthesiologist">Anesthesiologist</option></select></div>
            <div class="form-group"><label for="payRate">Hourly Rate</label><input class="form-control" type="number" id="payRate" name="payRate" placeholder="0.00" step=".01" required="required" /></div>
            <div class="form-group"><label for="affiliation">Affiliation</label><input class="form-control" type="text" id="affiliation" name="affiliation" placeholder="Hospital Name" required="required" /></div>
            <p>Educational Background</p>
            <div class="form-group"><label for="education_name">Name</label><input class="form-control" type="text" id="education_name" name="education_name" placeholder="University's Name" required="required" /></div>
            <div class="form-group"><label for="education_end">Graduated on</label><input class="form-control" type="month" id="education_end" name="education_end" placeholder="End" required="required" />
            <button class="btn btn-primary" type="submit" disabled={!validatePassword(password)}>Register</button></div>
        </form>
    )
}
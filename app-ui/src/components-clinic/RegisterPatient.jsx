
import React, { useState } from 'react'
import PasswordValidityBox from '../components-pharmacy/PasswordValidityBox'
import { validatePassword } from '../functions/validatePassword'

const baseURL = process.env.REACT_APP_SERVER_URL;

export default function RegisterPatient() {
    const [password, setPassword] = useState("")

    return (
        // TODO Change Backend call
        <form className='container-main' action={`${baseURL}/clinic/public/user/register/patient`} method="POST">
            <div class="form-group"><label for="username">Username</label><input class="form-control" type="text" name="username" placeholder="Username" required="required" autofocus="autofocus" /></div>
            <div class="form-group"><label for="name">Name</label><input class="form-control" type="text" name="name" placeholder="Name" required="required" /></div>
            <div class="form-group"><label for="email">Email</label><input class="form-control" type="email" name="email" placeholder="Email" required="required" /></div>
            <div class="form-group"><label for="password">Password</label><input class="form-control" type="password" name="password" required="required" onChange={e => setPassword(e.target.value)} /></div>
            <PasswordValidityBox password={password}></PasswordValidityBox>
            <div class="form-group"><label for="dateOfBirth">Date of Birth</label><input class="form-control" type="date" name="dateOfBirth" placeholder="Date of Birth" required="required" /></div>
            <div class="form-group"><label for="gender">Gender</label><select class="form-control" name="gender" required="required"><option value="male">Male</option><option value="female">Female</option></select></div>
            <div class="form-group"><label for="mobile">Mobile Number</label><input class="form-control" type="tel" id="mobile" name="mobile" placeholder="Mobile Number" required="required" /></div>
            <p>Emergency Contact</p>
            <div class="form-group"><label for="emergency_name">Name</label><input class="form-control" type="text" id="emergency_name" name="emergency_name" placeholder="Contact's Name" required="required" /></div>
            <div class="form-group"><label for="emergency_mobile">Mobile Number</label><input class="form-control" type="tel" id="emergency_mobile" name="emergency_mobile" placeholder="Mobile Number" required="required" /></div>
            <div class="form-group"><label for="emergency_relation">Relation to you</label><select class="form-control" name="emergency_relation" id="emergency_relation" required="required"><option value="wife">Wife</option><option value="husband">Husband</option><option value="child">Child</option></select></div>
            <button class="btn btn-primary" type="submit" disabled={!validatePassword(password)}>Register</button>
        </form>
    )
}
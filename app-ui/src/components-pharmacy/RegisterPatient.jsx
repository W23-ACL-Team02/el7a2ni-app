import React, { useState } from 'react'
import PasswordValidityBox from './PasswordValidityBox'
import { validatePassword } from '../functions/validatePassword'

const baseURL = `http://localhost:3000`

export default function RegisterPatient() {
    const [password, setPassword] = useState("")

    return (
        // TODO Change Backend call
        <form className='container-main' action={`${baseURL}/public/user/register/patient`} method="POST">
            <div className="form-group"><label for="username">Username</label><input className="form-control" type="text" name="username" placeholder="Username" required="required" autofocus="autofocus" /></div>
            <div className="form-group"><label for="name">Name</label><input className="form-control" type="text" name="name" placeholder="Name" required="required" /></div>
            <div className="form-group"><label for="email">Email</label><input className="form-control" type="email" name="email" placeholder="Email" required="required" /></div>
            <div className="form-group"><label for="password">Password</label><input className="form-control" type="password" name="password" required="required" onChange={e => setPassword(e.target.value)} /></div>
            <PasswordValidityBox password={password}></PasswordValidityBox>
            <div className="form-group"><label for="dateOfBirth">Date of Birth</label><input className="form-control" type="date" name="dateOfBirth" placeholder="Date of Birth" required="required" /></div>
            <div className="form-group"><label for="gender">Gender</label><select className="form-control" name="gender" required="required"><option value="male">Male</option><option value="female">Female</option></select></div>
            <div className="form-group"><label for="mobile">Mobile Number</label><input className="form-control" type="tel" id="mobile" name="mobile" placeholder="Mobile Number" required="required" /></div>
            <p>Emergency Contact</p>
            <div className="form-group"><label for="emergency_name">Name</label><input className="form-control" type="text" id="emergency_name" name="emergency_name" placeholder="Contact's Name" required="required" /></div>
            <div className="form-group"><label for="emergency_mobile">Mobile Number</label><input className="form-control" type="tel" id="emergency_mobile" name="emergency_mobile" placeholder="Mobile Number" required="required" /></div>
            <div className="form-group"><label for="emergency_relation">Relation to you</label><select className="form-control" name="emergency_relation" id="emergency_relation" required="required"><option value="wife">Wife</option><option value="husband">Husband</option><option value="child">Child</option></select></div>
            <button className="btn btn-primary" type="submit" disabled={!validatePassword(password)}>Register</button>
        </form>
    )
}
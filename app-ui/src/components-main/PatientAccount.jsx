import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ErrorBox from '../components-pharmacy/ErrorsBox'
import {useNavigate} from 'react-router-dom' 
import Card from './Card'
import '../css/general.css'
import '../css/patientHome.css'
import Logout from './Logout';
import PatientNavBar from '../components-main/PatientNavBar'

const serverURL = process.env.REACT_APP_SERVER_URL;

export default function PatientAccount () {
    const [patient, SetPatient] = useState({});
    const [dateOfBirth,setDateOfBirth] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        const getCurrPatinet =  async () => {
            const response = await axios.get(`${serverURL}/clinic/private/user/getSelfUser`, {withCredentials:true})
            const patient = response.data;
            const date = new Date(patient.dateOfBirth);
            setDateOfBirth(date.toLocaleDateString());
            SetPatient(patient);
        }
        
        getCurrPatinet();
    },[])

    return(
        <div className='main'>
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', alignContent:'center'}}>
            <div className='top'>
                <Card height={650} width={350}>
                    <h2 style={{alignSelf: 'center', fontSize: 28, marginTop: 10}}>Account Details</h2>
                    <div className='line' style={{width: 200}}></div>
                    <p style={{alignSelf:'center', fontSize: 20, fontWeight: 500, height: 80}}>Username: {patient.username}</p>
                    <p style={{alignSelf:'center', fontSize: 20, fontWeight: 500, height: 80}}>Name: {patient.name}</p>
                    <p style={{alignSelf:'center', fontSize: 20, fontWeight: 500, height: 80}}>Email: {patient.email}</p>
                    <p style={{alignSelf:'center', fontSize: 20, fontWeight: 500, height: 80}}>Mobile: {patient.mobile}</p>
                    <p style={{alignSelf:'center', fontSize: 20, fontWeight: 500, height: 80}}>Gender: {patient.gender}</p>
                    <p style={{alignSelf:'center', fontSize: 20, fontWeight: 500, height: 80}}>Date of Birth: {dateOfBirth}</p>
                </Card>    
                <div  style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', alignContent:'center'}}>
                    <Card height={200} width={350}>
                        <h2 style={{ alignSelf: 'center' ,fontSize: 28, marginTop: 10}}>Account Actions</h2>
                        <div className='line' style={{width: 200}}></div>
                        <button style={{width: 200, height: 120, borderRadius: 40, fontSize: 20, marginTop: 10, marginBottom: 20, alignSelf: 'center'}} onClick={() => {navigate('/changePassword')}}>Change Password</button>
                        <Logout >Log out</Logout>
                    </Card>
                    <Card height={400} width={350} >
                        <h2 style={{alignSelf:'center', fontSize: 28, marginTop: 10}}>Other Actions</h2>
                        <div className='line' style={{width: 200}}></div>
                        <button style={{width: 200, height: 150, borderRadius: 40, fontSize: 20, marginTop: 10, marginBottom: 20, alignSelf: 'center'}} onClick={() => {navigate('/ViewPrescriptions')}}>My Prescriptions</button>
                        <button style={{width: 200, height: 150, borderRadius: 40, fontSize: 20, marginTop: 10, marginBottom: 20, alignSelf: 'center'}} onClick={() => {navigate('/ViewFamilyMembers')}}>My Family Memebrs</button>
                        <button style={{width: 200, height: 150, borderRadius: 40, fontSize: 20, marginTop: 10, marginBottom: 20, alignSelf: 'center'}} onClick={() => {navigate('/AddFamilyMembers')}}>Add New Family Memebr</button>
                        <button style={{width: 200, height: 150, borderRadius: 40, fontSize: 20, marginTop: 10, marginBottom: 20, alignSelf: 'center'}} onClick={() => {navigate('/LinkFamilyMember')}}>Link a Family Memebr</button>
                    </Card> 
                </div>
            </div>
            <Card height={80} width={750} >
                <p style={{alignSelf:'center', fontSize: 40, fontWeight: 'bold', height: 80}}>Wallet: {patient.wallet} €</p>
            </Card> 
        </div>                 
    </div>    
    )
    
}
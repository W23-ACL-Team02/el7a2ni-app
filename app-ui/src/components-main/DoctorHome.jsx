import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ErrorBox from '../components-pharmacy/ErrorsBox'
import {useNavigate} from 'react-router-dom'
import Card from './Card'
import '../css/general.css'
import '../css/patientHome.css'
import DoctorNavBar from './DoctorNavBar'

const baseURL = process.env.REACT_APP_SERVER_URL

export default function DoctorHome() {
    let navigate = useNavigate()

    return (
        <div className='main'>
            <div className='top'>
                <Card width={700}>
                    <h2 style={{fontSize: 28, marginTop: 10}}>Doctor Actions</h2>
                    <button style={{width: 200, height: 60, borderRadius: 40, fontSize: 20, marginTop: 25, marginBottom: 25, alignSelf: 'center'}} onClick={() => {navigate('/AddTimeSlots')}}>Add Time Slots</button>
                    <div className='line' style={{width: 200}}></div>
                    <button style={{width: 200, height: 60, borderRadius: 40, fontSize: 20, marginTop: 25, marginBottom: 25, alignSelf: 'center'}} onClick={() => {navigate('/ViewAppointments')}}>View Appointments</button>
                    <div className='line' style={{width: 200}}></div>
                    <button style={{width: 200, height: 60, borderRadius: 40, fontSize: 20, marginTop: 25, marginBottom: 25, alignSelf: 'center'}} onClick={() => {navigate('/patientsList')}}>View Patients</button>
                    <div className='line' style={{width: 200}}></div>
                    <button style={{width: 200, height: 60, borderRadius: 40, fontSize: 20, marginTop: 25, marginBottom: 25, alignSelf: 'center'}} onClick={() => {navigate('/AddPrescription')}}>Add Prescription</button>
                    <div className='line' style={{width: 200}}></div>
                    <button style={{width: 200, height: 60, borderRadius: 40, fontSize: 20, marginTop: 25, marginBottom: 25, alignSelf: 'center'}} onClick={() => {navigate('/VideoCallRoom')}}>Start Video Call</button>
                    <div className='line' style={{width: 200}}></div>
                    <button style={{width: 200, height: 60, borderRadius: 40, fontSize: 20, marginTop: 25, marginBottom: 25, alignSelf: 'center'}} onClick={() => {navigate('/ScheduleFollowUp')}}>Schedule follow-up</button>
                    <div className='line' style={{width: 200}}></div>
                    <button style={{width: 200, height: 60, borderRadius: 40, fontSize: 20, marginTop: 25, marginBottom: 25, alignSelf: 'center'}} onClick={() => {navigate('/cancelPatientAppointment')}}>cancelPatientAppointment</button><div className='line' style={{width: 200}}></div>
                    
   
                </Card>
            </div>
        </div>
    )
}

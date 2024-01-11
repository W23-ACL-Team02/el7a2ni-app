import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ErrorBox from '../components-pharmacy/ErrorsBox'
import {useNavigate} from 'react-router-dom'
import Card from './Card'
import '../css/general.css'
import '../css/patientHome.css'
import PatientNavBar from '../components-main/PatientNavBar'

const baseURL = process.env.REACT_APP_SERVER_URL

export default function PatientHome() {
    let navigate = useNavigate()

    return (
        <div className='main'>
            <div className='top'>
                <Card height={500} width={350}>
                    <h2 style={{fontSize: 28, marginTop: 10}}>El7a2ni Clinic</h2>
                    <p style={{fontSize: 20, fontWeight: 500, height: 80}}>Need to see a doctor? Pick one from our different specialties.</p>
                    <button style={{width: 200, height: 60, borderRadius: 40, fontSize: 20, marginTop: 10, marginBottom: 20, alignSelf: 'center'}} onClick={() => {navigate('/doctors-list')}}>
                        Book Appointment</button>
                    <button style={{width: 200, height: 60, borderRadius: 40, fontSize: 20, marginTop: 10, marginBottom: 20, alignSelf: 'center'}} onClick={() => {navigate('/follow-up')}}>
                        Follow-up Appointment</button>
                    <button style={{width: 200, height: 60, borderRadius: 40, fontSize: 20, marginTop: 10, marginBottom: 20, alignSelf: 'center'}} onClick={() => {navigate('/vieworders')}}>
                        View Orders</button>
                        <button style={{width: 200, height: 60, borderRadius: 40, fontSize: 20, marginTop: 10, marginBottom: 20, alignSelf: 'center'}} onClick={() => {navigate('/rescheduleAppointment')}}>
                        reschedule Appointment</button>    
                        {/* <button style={{width: 200, height: 60, borderRadius: 40, fontSize: 20, marginTop: 10, marginBottom: 20, alignSelf: 'center'}} onClick={() => {navigate('/cancelAppointment')}}>
                        Cancel Appointment</button> 
                        <button style={{width: 200, height: 60, borderRadius: 40, fontSize: 20, marginTop: 10, marginBottom: 20, alignSelf: 'center'}} onClick={() => {navigate('/rescheduleFamilyAppointment')}}>
                        cancle Family Appointment</button>        */}
                    <div className='line' style={{width: 200}}></div>
                    <p style={{fontSize: 20, fontWeight: 500, height: 80}}>Have a medical emergency? Video call a doctor on demand now!</p>
                    <button style={{width: 200, height: 60, borderRadius: 40, fontSize: 20, marginTop: 10, marginBottom: 20, alignSelf: 'center'}} onClick={() => {navigate('/VideoCallRoom')}}>Start Video Call</button>
                </Card>
                <Card height={500} width={350}>
                    <h2 style={{fontSize: 28, marginTop: 10}}>El7a2ni Pharmacy</h2>
                    <p style={{fontSize: 20, fontWeight: 500, height: 80}}>Browse our vast collection of medicine. Here you will find anything you need.</p>
                    <button style={{width: 200, height: 60, borderRadius: 40, fontSize: 20, marginTop: 10, marginBottom: 20, alignSelf: 'center'}} onClick={() => {navigate('/viewmedicinepatient')}}>Browse Medicine</button>
                    <div className='line' style={{width: 250}}></div>
                    <p style={{fontSize: 20, fontWeight: 500, height: 80}}>Need assistance finding the medicine you are looking for? We are here to help!</p>
                    <button style={{width: 200, height: 60, borderRadius: 40, fontSize: 20, marginTop: 10, marginBottom: 20, alignSelf: 'center'}}>Chat With Us</button>
                </Card>
            </div>
            <Card height={100} width={750}>
                <div className='bottom'>
                    <p style={{fontSize: 20, fontWeight: 500, margin: 0, width: 500}}>For our best prices, you can now subscribe to one of our different packages to get discounts on doctors appointments and medicine for you and your family.</p>
                    <button style={{width: 200, height: 60, borderRadius: 40, fontSize: 20, margin: 10, alignSelf: 'center'}} onClick={() => {navigate('/healthPackages')}}>Subscribe</button>
                </div>
            </Card>
        </div>
    )
}

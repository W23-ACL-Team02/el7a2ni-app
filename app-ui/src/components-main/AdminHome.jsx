import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ErrorBox from '../components-pharmacy/ErrorsBox'
import {useNavigate} from 'react-router-dom'
import Card from './Card'
import '../css/general.css'
import '../css/patientHome.css'
import AdminNavBar from './AdminNavBar'
import ViewSalesReport from '../components-pharmacy/ViewSalesReport'

const baseURL = process.env.REACT_APP_SERVER_URL

export default function AdminHome() {
    let navigate = useNavigate()

    return (
        <div className='main'>
            <div className='top'>
                <Card width={700}>
                    <h2 style={{fontSize: 28, marginTop: 10}}>Admin Actions</h2>
                    <button style={{width: 200, height: 60, borderRadius: 40, fontSize: 20, marginTop: 25, marginBottom: 25, alignSelf: 'center'}}>Add Admin</button>
                    <div className='line' style={{width: 200}}></div>
                    <button style={{width: 200, height: 60, borderRadius: 40, fontSize: 20, marginTop: 25, marginBottom: 25, alignSelf: 'center'}}>Remove User</button>
                    <div className='line' style={{width: 200}}></div>
                    <button style={{width: 200, height: 60, borderRadius: 40, fontSize: 20, marginTop: 25, marginBottom: 25, alignSelf: 'center'}}>View Pending Doctors</button>
                    <div className='line' style={{width: 200}}></div>
                    <button style={{width: 200, height: 60, borderRadius: 40, fontSize: 20, marginTop: 25, marginBottom: 25, alignSelf: 'center'}} onClick={() => {navigate('/pendingpharmacists')}}>View Pending Pharmacists</button>
                    <div className='line' style={{width: 200}}></div>
                    <button style={{width: 200, height: 60, borderRadius: 40, fontSize: 20, marginTop: 25, marginBottom: 25, alignSelf: 'center'}}>Manage Health Packages</button>
                    <div className='line' style={{width: 200}}></div>
                    <button style={{width: 200, height: 60, borderRadius: 40, fontSize: 20, marginTop: 25, marginBottom: 25, alignSelf: 'center'}}>View Sales Report</button>
                    <div className='line' style={{width: 200}}></div>
                    <button style={{width: 200, height: 60, borderRadius: 40, fontSize: 20, marginTop: 25, marginBottom: 25, alignSelf: 'center'}} onClick={() => {navigate('/viewmedicinepatient')}}>View Medicine List</button>
                    <div className='line' style={{width: 200}}></div>
                    <button style={{width: 200, height: 60, borderRadius: 40, fontSize: 20, marginTop: 25, marginBottom: 25, alignSelf: 'center'}} onClick={() => {navigate('/pharmacists')}}>View Pharmacists</button>
                    <div className='line' style={{width: 200}}></div>
                    <button style={{width: 200, height: 60, borderRadius: 40, fontSize: 20, marginTop: 25, marginBottom: 25, alignSelf: 'center'}} onClick={() => {navigate('/patients')}}>View Patients</button>

                </Card>
            </div>
            <ViewSalesReport/>
        </div>
    )
}

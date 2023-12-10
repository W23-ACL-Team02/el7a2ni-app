import logo from './logo.svg';
import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Patients from './components/Patients';
import ViewPatient from './components/ViewPatient';
import Pharmacists from './components/Pharmacists';
import ViewPharmacist from './components/ViewPharmacist';
import PendingPharmacists from './components/PendingPharmacists';
import AdminHome from './components/AdminHome';
import Orders from './components/Orders';
import ChooseAddress from './components/ChooseAddress'
import OrderDetails from './components/OrderDetails'
import AddAddress from './components/AddAddress'
import axios from 'axios';
//import viewpatient from './components/viewpatient'


function App() {
  return (
    <div className='App'>
  <Router>
      <Routes>
        <Route path="/patients" 
         element={<Patients/>}/>
         <Route path="/patient"
         element={<ViewPatient/>}/>
         <Route path="/pharmacists" 
         element={<Pharmacists/>}/>
         <Route path="/pharmacist"
         element={<ViewPharmacist/>}/>
         <Route path="/pendingpharmacists" 
         element={<PendingPharmacists/>}/>
         <Route path="/adminhome"
         element={<AdminHome/>}/>
         <Route path="/vieworders"
         element={<Orders/>}/>
         <Route path="/chooseaddress"
         element={<ChooseAddress/>}/>
         <Route path="/orderdetails"
         element={<OrderDetails/>}/>
          <Route path="/addaddress"
         element={<AddAddress/>}/>
       
      </Routes>
      </Router>

        </div>
  );
}

export default App;

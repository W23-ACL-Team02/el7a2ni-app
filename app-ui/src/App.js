import { useState } from 'react';
import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Login from './components-main/Login.jsx';
import PatientsList from './components-clinic/doctor/PatientsList/PatientsList.js'
import PatientDetails from './components-clinic/doctor/PatientDetails/PatientDetails.js'
import Addprescription from './components-clinic/doctor/addPrescription/Addprescription';
import ViewPrescriptions from './components-clinic/ViewPrescription';
import SelectedPrescriptions from './components-clinic/SelectedPrescriptions';


function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="App">
          <BrowserRouter>
          <Link to={'addprescription'}>addPrescription</Link> <br/>
          <Link to={'viewprescription'}>ViewPrescription</Link>


          <Routes>
          <Route path='/login' element={<Login/>}/> 
          <Route path="/addprescription" element={<Addprescription />} />
          <Route path="/viewprescription" element={<ViewPrescriptions />} />
          <Route path='prescriptions/selectedPrescription' element={<SelectedPrescriptions/>} />


          

          </Routes>
          </BrowserRouter>


    </div>
  );
}

export default App;
import { useState } from 'react';
import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Addprescription from './components-clinic/doctor/addPrescription/Addprescription';
import ViewPrescriptions from './components-clinic/ViewPrescription';
import SelectedPrescriptions from './components-clinic/SelectedPrescriptions';
import EditMedicine from './components-pharmacy/doctor/EditMedicine';
import EditSelectedPrescriptions from './components-pharmacy/doctor/EditSelectedPrescriptions';
import Login from './components-clinic/Login';
import ViewFamilyMemebrs from './components-clinic/patient/FamilyMembers/ViewFamilyMemebrs'
function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="App">
          <BrowserRouter>
          <Link to={'addprescription'}>addPrescription</Link> <br/>
          <Link to={'viewprescription'}>ViewPrescription</Link>
          <Link to={'editMedicine'}>EditMedicine</Link>
          <Link to={'login'}>login</Link>
          <Link to={'viewfamilyMembers'}>familymembers</Link>





          <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/addprescription" element={<Addprescription />} />
          <Route path="/viewprescription" element={<ViewPrescriptions />} />
          <Route path='prescriptions/selectedPrescription' element={<SelectedPrescriptions/>} />
          <Route path="/editMedicine" element={<EditMedicine />} />
          <Route path="prescriptions/editSelectedPrescriptions" element={<EditSelectedPrescriptions />} />
          <Route path="/viewFamilyMembers" element={<ViewFamilyMemebrs />} />

 


          

          </Routes>
          </BrowserRouter>


    </div>
  );
}

export default App;
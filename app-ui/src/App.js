import { useState } from 'react';
import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Home from './components-pharmacy/Home';
import MedicineListPatient from './components-pharmacy/MedicineListPatient';
import ViewCart from './components-pharmacy/ViewCart'
import ViewSalesReport from './components-pharmacy/ViewSalesReport';
import MedicineDet from './components-pharmacy/MedicineDet';
import Alternatives from './components-pharmacy/Alternatives';
function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="App">
    <BrowserRouter>
     <Routes>
     <Route path="/home" element={<Home />} />
     <Route path="/viewmedicinepatient" element={<MedicineListPatient/>} />
     <Route path="/ViewCart" element={<ViewCart />} />
     <Route path="/ViewSalesReport" element={<ViewSalesReport/>}/>
    
      <Route path="/medicinedetails/:id" element={<MedicineDet/>}/>
      <Route path="/altMed" element={<Alternatives/>}/>



    </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
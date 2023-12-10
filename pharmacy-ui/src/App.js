import { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import UploadMedImg from './components/UploadMedImg';
import Login from './components/Login';
import RegisterUser from './components/RegisterUser';
import Home from './components/Home';
import AddAdmin from './components/AddAdmin';
import RemoveUser from './components/RemoveUser';
import MedicineList from './components/MedicineList';
import Logout from './components/Logout';




function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="App">
      <BrowserRouter>
        <h2>PUBLIC</h2>
        <Link to={'login'}>Login</Link> <br/>
        <Link to={'register'}>Register</Link> <br/>
        <h2>PRIVATE</h2>
        <Link to={'home'}>Home</Link> <br/>
        <Link to={'logout'}>Logout</Link> <br/>
        <Link to={'upload'}>Upload</Link> <br/>
        <Link to={'addAdmin'}>Add Admin</Link> <br/>
        <Link to={'removeUser'}>Remove User</Link> <br/>
        <Link to={'viewMedicine'}>View Medicine</Link> <br/>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/home" element={<Home />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/upload" element={<UploadMedImg />} />
          <Route path="/addAdmin" element={<AddAdmin />} />
          <Route path="/removeUser" element={<RemoveUser />} />
          <Route path="/viewMedicine" element={<MedicineList />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
import { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UploadMedImg from './components/UploadMedImg';
import Login from './components/Login';
import RegisterUser from './components/RegisterUser';
import Home from './components/Home';
import AddAdmin from './components/AddAdmin';
import RemoveUser from './components/RemoveUser';




function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/home" element={<Home />} />
          <Route path="/upload" element={<UploadMedImg />} />
          <Route path="/addAdmin" element={<AddAdmin />} />
          <Route path="/removeUser" element={<RemoveUser />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
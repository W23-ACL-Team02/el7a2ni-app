import React, { useState } from 'react';
import axios from 'axios';
import '../css/addAdmin.css';

const baseURL = process.env.REACT_APP_SERVER_URL;

const AddAdmin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${baseURL}/pharmacy/private/admin/user/addAdmin`, {
        username: username,
        password: password,
      }, {withCredentials: true});

      setMessage('Admin added successfully'); // Display success message
    } catch (error) {
      setMessage("Error in adding Admin"); // Display error message
    }
  };

  
  return (
    <div className="container"> {/* Apply the CSS class here */}
      <div className="rectangle2">
        <h2>Add Administrator</h2>
        <form className="form" onSubmit={handleSubmit}>
          {/* Apply the CSS class here */}
          <div className="input"> {/* Apply the CSS class here */}
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" value={username} onChange={handleUsernameChange} required />
          </div>
          <div className="input"> {/* Apply the CSS class here */}
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" value={password} onChange={handlePasswordChange} required />
          </div>
          <div className="submit-container"> {/* Apply the CSS class here */}
            <button className="submit" type="submit">Add Admin</button> {/* Apply the CSS class here */}
          </div>
        </form>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddAdmin;

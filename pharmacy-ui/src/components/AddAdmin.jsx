import React, { useState } from 'react';
import axios from 'axios';

const baseURL = `http://localhost:4000`;

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
      const response = await axios.post(`${baseURL}/private/admin/user/addAdmin`, {
        username: username,
        password: password,
      });

      setMessage('Admin added successfully'); // Display success message
    } catch (error) {
      setMessage("Error in adding Admin"); // Display error message
    }
  };

  return (
    <div>
      <h2>Add Administrator</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" value={username} onChange={handleUsernameChange} required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={handlePasswordChange} required />
        </div>
        <button type="submit">Add Admin</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddAdmin;

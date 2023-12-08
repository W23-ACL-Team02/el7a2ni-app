
import React, { useState } from 'react';
import axios from 'axios';

const baseURL = `http://localhost:4000`;

const RemoveUser = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${baseURL}/private/admin/user/removeUser`, {
        username: username,
      });
      
      if (response && response.data && response.data.successes && response.data.successes.length > 0) {
        setMessage(response.data.successes[0]); // Display success message
      } else {
        setMessage('No success message found in the response'); // Handle scenario when success message is not present
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors && error.response.data.errors.length > 0) {
        setMessage(error.response.data.errors[0]); // Display error message
      } else {
        setMessage('No error message found in the response'); // Handle scenario when error message is not present
      }
    }
  };

  return (
    <div>
      <h2>Remove User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" value={username} onChange={handleUsernameChange} required />
        </div>
        <button type="submit">Remove User</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RemoveUser;

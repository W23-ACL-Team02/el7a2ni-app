
import React, { useState } from 'react';
import axios from 'axios';
import '../css/addAdmin.css';
const baseURL = process.env.REACT_APP_SERVER_URL;

const RemoveUser = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${baseURL}/pharmacy/private/admin/user/removeUser`, {
        username: username,
      }, {withCredentials: true});
      
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
  <div className="container"> {/* Apply the CSS class here */}
    
    <div className="rectangle2">
    <h2>Remove User</h2>
      <form className="form" onSubmit={handleSubmit}> {/* Apply the CSS class here */}
        <div className="input"> {/* Apply the CSS class here */}
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" value={username} onChange={handleUsernameChange} required />
        </div>
        <div>
          <button className="submit" type="submit">Remove User</button> {/* Apply the CSS class here */}
        </div>
      </form>
    </div>
    {message && <p>{message}</p>}
  </div>
);
};

export default RemoveUser;

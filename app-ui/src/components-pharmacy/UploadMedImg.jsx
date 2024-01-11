
import React, { useState } from 'react';
import axios from 'axios';
import  '../css/addAdmin.css';
const baseURL = process.env.REACT_APP_SERVER_URL;

const UploadMedicineImage = () => {
  const [name, setName] = useState('');
  const [medicineImg, setMedicineImg] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');

  const handleInputChange = (event) => {
    setName(event.target.value);
  };

  const handleFileChange = (event) => {
    setMedicineImg(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('medicineImg', medicineImg);

    try {
      const response = await axios.post(`${baseURL}/pharmacy/private/medicine/uploadMedImg`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }, 
        withCredentials: true
      });

      setUploadMessage('Medicine image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading medicine image:', error);
      // Handle error, show error message, etc.
      setUploadMessage('Error uploading medicine image. Please try again.');
    }
  };

  
  return (
    <div className="container">
      <div className="rectangle2">
        <h2>Upload Medicine Image</h2>
        <form onSubmit={handleSubmit}>
          <div className="input">
            <label htmlFor="name">Medicine Name:</label>
            <input type="text" id="name" value={name} onChange={handleInputChange} required />
          </div>
          <div className="input">
            <label htmlFor="medicineImg">Medicine Image:</label>
            <input type="file" id="medicineImg" onChange={handleFileChange} required />
          </div>
          <div className="submit-container">
            <button className="submit" type="submit">Upload</button>
          </div>
        </form>
      </div>
      {uploadMessage && <p>{uploadMessage}</p>}
    </div>
  );
};

export default UploadMedicineImage;


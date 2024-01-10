
import React, { useState } from 'react';
import axios from 'axios';
const baseURL = `http://localhost:3000`;

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
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Medicine Name:</label>
          <input type="text" id="name" value={name} onChange={handleInputChange} required />
        </div>
        <div>
          <label htmlFor="medicineImg">Medicine Image:</label>
          <input type="file" id="medicineImg" onChange={handleFileChange} required />
        </div>
        <button type="submit">Upload Medicine Image</button>
      </form>
      {uploadMessage && <p>{uploadMessage}</p>}
    </div>
  );
};

export default UploadMedicineImage;


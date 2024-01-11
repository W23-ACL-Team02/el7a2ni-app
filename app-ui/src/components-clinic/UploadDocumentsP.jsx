import React, { useState } from 'react';
import axios from 'axios';

const baseURL = process.env.REACT_APP_SERVER_URL;

const UploadDocumentsP = () => {
  const [medicalHistory, setMedicalHistory] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileChange = (event) => {
    setMedicalHistory(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('medicalHistory', medicalHistory);

    try {
      const response = await axios.post(`${baseURL}/clinic/private/user/uploadDocuments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }, 
        withCredentials: true
      });
      setSuccessMessage(response.data.message);
      setError('');
    } catch (error) {
      setSuccessMessage('');
      setError('Error uploading document.');
    }
  };

  return (
    <div>
      <h2>Upload Medical History Documents</h2>
      {error && <p>{error}</p>}
      {successMessage && <p>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default UploadDocumentsP;

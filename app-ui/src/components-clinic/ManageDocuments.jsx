import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';
const baseURL = process.env.REACT_APP_SERVER_URL;
;

const ManageDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${baseURL}/clinic/private/user/documents`, {withCredentials: true});
      setDocuments(response.data.files || []);
      setUserId(response.data.userId);
    } catch (error) {
      setError('Error fetching documents.');
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);
  

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('medicalHistory', selectedFile);

      const response = await axios.post(`${baseURL}/clinic/private/user/uploadDocuments`, formData, {withCredentials: true});
      console.log('Upload success:', response.data.message);
        fetchDocuments();
      // Additional logic after successful upload
    } catch (error) {
      setError('Error uploading document.');
      console.error('Error uploading document:', error);
      // Handle errors, display error messages, etc.
    }
  };
  const handleRemove = async (fileId) => {
    try {
      const response = await axios.post(`${baseURL}/clinic/private/user/removeDocuments`, {
        userId:userId, // Replace with the actual user ID
        fileId: fileId,
      }, {withCredentials: true});
      // Refresh the documents list after removing the file
      setDocuments(documents.filter((file) => file._id !== fileId));
    } catch (error) {
      setError('Error removing document.');
    }
  };

  return (
    <div>
      <h2>Documents</h2>
      {error && <p>{error}</p>}
      <ul className="document-list">
      {documents.length > 0 &&
  documents.map((file) => (
    <li key={file._id} className="document-item">
      <span>{file.fileName}</span>
      <button onClick={() => handleRemove(file._id)}>Remove</button>
    </li>
  ))}
      </ul>
      <div className="form-group">
            <label for="medicalHistory"></label>
            <input type="file" name="medicalHistory" id="medicalHistory" required onChange={handleFileChange} />
           
      {/* <input type="file" onChange={handleFileChange} /> */}
      <button onClick={handleUpload}>Upload Document</button>
      </div>
      {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} />}
    </div>
  );


};

export default ManageDocuments;

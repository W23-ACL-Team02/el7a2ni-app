import classes from './mainPage.module.css';
import axios from 'axios';
import atob from 'atob';
const { useState, useEffect, useRef } = require("react");

export default function PatientHealthRecordsPage(props) {
  const [files, setFiles] = useState([])
  const [buttonClicked, setButtonClicked] = useState(false);

  const  getFiles = async function(){
      await axios.get('http://localhost:3000/private/patient/healthRecord', {withCredentials: true}).then(
      (res) => { 
      const files = res.data.files
      console.log(files)
      setFiles(files)
  });
  }

  const downloadFile = (name, data) => {
    try {
      const decodedFile = decodeBase64ToFile(data);
      const blobUrl = URL.createObjectURL(decodedFile);
      const a = document.createElement('a');

      a.style.display = 'none';
      a.href = blobUrl;
      a.download = name;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);

    } catch (error) {
      console.error('Error downloading file:', error.message);
    }
  };

  const decodeBase64ToFile = (base64String) => {
    try {
      const binaryString = atob(base64String);
      const byteArray = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        byteArray[i] = binaryString.charCodeAt(i);
      }
      return new Blob([byteArray]);
    } catch (error) {
      throw new Error('Error decoding Base64 to file:', error.message);
    }
  };

  useEffect(() => {
    getFiles()
  }, []);

  return (
    <div className={classes.frame}>
      <div className={classes.title}>Health Records</div>
      {files.map((file) => (
      <div className={classes.bar}>
          <div className={classes.fileName}>{file.fileName}</div>
          <button className={classes.downloadButton} onClick={() => { setButtonClicked(true); downloadFile(file.fileName, file.fileData); }}>Download</button>
      </div>
      ))}
    </div>
  );
}


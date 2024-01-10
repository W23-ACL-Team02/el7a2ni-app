import classes from './mainPage.module.css';
import axios from 'axios';
import atob from 'atob';
const { useState, useEffect, useRef } = require("react");
const { useLocation } = require("react-router-dom")
const { useNavigate } = require("react-router-dom")
const serverURL = process.env.REACT_APP_SERVER_URL

export default function DoctorHealthRecordsPage() {
  const [files, setFiles] = useState([])
  const [buttonClicked, setButtonClicked] = useState(false);
  let { state } = useLocation();
  let navigate  = useNavigate();
  const patientUsername = state.patientUsername;


  const  getFiles = async function(){
      await axios.post(`${serverURL}/clinic/private/doctor/api/viewHealthRecords`, {patientUsername: patientUsername}, {withCredentials: true}).then(
      (res) => { 
      const files = res.data.files
      // console.log(files)
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
      <button style={{height: 60, width: 120, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 5, fontSize: 20}} onClick={() => {navigate(-1)}}>
      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H6M12 5l-7 7 7 7"/></svg>      Back</button>
      <div className={classes.title}>{patientUsername}'s Health Records</div>
      {files.length == 0 && <p>No Records available</p>}
      {files.map((file) => (
      <div className={classes.bar}>
          <div className={classes.fileName}>{file.fileName}</div>
          <button className={classes.downloadButton} onClick={() => { setButtonClicked(true); downloadFile(file.fileName, file.fileData); }}>Download</button>
      </div>
      ))}
    </div>
  );
}


import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { saveAs } from 'file-saver';
import Select from 'react-select';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
const serverURL = process.env.REACT_APP_SERVER_URL;

pdfMake.vfs = pdfFonts.pdfMake.vfs;


const EditSelectedPrescriptions = ({ prescription,onPrescriptionUpdate }) => {
  const [medicationsTable, setMedicationsTable] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedDosage, setEditedDosage] = useState('');
  const [editedInstructions, setEditedInstructions] = useState('');
  const[medicines,setMedicines]=useState([]);
  const [dosagesForSelectedMedicine,setdosagesForSelectedMedicine]=useState([]);
  const [dosagesForAddedMedicine,setdosagesForAddedMedicine]=useState([]);

  const [forceUpdate, setForceUpdate] = useState(false);
  const [newMedicineName, setNewMedicineName] = useState('');
const [newMedicineDosage, setNewMedicineDosage] = useState('');
const [newMedicineInstructions, setNewMedicineInstructions] = useState('');
const [showAddMedicineUI, setShowAddMedicineUI] = useState(false);



  useEffect(() => {
    axios.get(`${serverURL}/pharmacy/private/medicine/all`,{withCredentials: true}) //change to base Url and check the route
    .then((res)=>{
      setMedicines(res.data);
    })
    .catch((error) =>{
      console.log(error)
    })

    if (prescription) {
      const tableData = prescription.medications.map((medicine) => [
        medicine.name,
        medicine.dosage,
        medicine.instructions,
      ]);

      setMedicationsTable([
        ['Medicine Name', 'Dosage', 'Instructions'],
        ...tableData,
      ]);
    }
  }, [prescription,forceUpdate]);

  const editMedicine = (medicine) => {
    setEditMode(true);
    setSelectedMedicine(medicine);
    setEditedName(medicine.name);
    setEditedDosage(medicine.dosage);
    setEditedInstructions(medicine.instructions);
  };
  const toggleAddMedicineUI = () => {
    setShowAddMedicineUI((prev) => !prev);
    // Reset new medicine state variables when hiding the UI
    if (!showAddMedicineUI) {
      setNewMedicineName('');
      setNewMedicineDosage('');
      setNewMedicineInstructions('');
    }
  };
  const deleteMedicine = async (medicineToDelete) => {
    try {

  
      const updatedMedications = prescription.medications.filter(
        (medicine) => medicine._id != medicineToDelete._id
      );
      const updatedPrescription = {
        ...prescription,
        medications: updatedMedications,
      };
  
      await axios.post(
        `${serverURL}/clinic/private/patient/prescription/updatePrescription`,
        updatedPrescription, {withCredentials: true}
      );
  
      // Update the local state
      onPrescriptionUpdate(updatedPrescription);
    } catch (error) {
      console.error('Error deleting medicine:', error);
    }
  };
  
  
  const addNewMedicine = () => {
    // Create a new medicine object
    const newMedicine = {
      name: newMedicineName,
      dosage: newMedicineDosage,
      instructions: newMedicineInstructions,
    };
  
    // Update the prescription with the new medicine
    const updatedPrescription = {
      ...prescription,
      medications: [...prescription.medications, newMedicine],
    };
  
    // Make an Axios request to update the prescription
    axios
      .post(
        `${serverURL}/clinic/private/patient/prescription/updatePrescription`,
        updatedPrescription, {withCredentials: true}
      )
      .then((response) => {
        console.log('Prescription updated successfully');
        // If needed, update the local state with the updated prescription
        if (onPrescriptionUpdate) {
          onPrescriptionUpdate(updatedPrescription);
        }
      })
      .catch((error) => {
        console.error('Error updating prescription:', error);
      });
  
    // Reset the new medicine state variables
    setNewMedicineName('');
    setNewMedicineDosage('');
    setNewMedicineInstructions('');
  };
  
  const saveEdit = async () => {
    
    if (selectedMedicine) {
      const index = prescription.medications.findIndex(
        (medicine) => medicine.name === selectedMedicine.name
      );

      if (index !== -1) {
        const updatedMedications = [...prescription.medications];
        updatedMedications[index] = {
          ...selectedMedicine,
          name: editedName,
          dosage: editedDosage,
          instructions: editedInstructions,
        };

        const updatedPrescription = {
          ...prescription,
          medications: updatedMedications,
        };
         prescription=updatedPrescription;

          
            // Make an Axios request to update the prescription
            await axios.post(
              `${serverURL}/clinic/private/patient/prescription/updatePrescription`,
              updatedPrescription,{withCredentials: true}
            )  .then(response =>{
              console.log("successfull");
            })
             

       // console.log('Updated Prescription:', updatedPrescription);
       
       setEditMode(false);
       setSelectedMedicine(null);
        
        if (onPrescriptionUpdate) {
          onPrescriptionUpdate(updatedPrescription);
        }
      }
    }
    setForceUpdate((prev) => !prev);

  };
  
  if (!prescription) {
    return  <h3> Prescription Details</h3>
    
  }
  else
  {
    
    const pdfContent = {
      content: [
        { text: 'Prescription Details', style: 'header' },
          { text: 'Patient Name: ' + prescription.patient.name },
          { text: 'Doctor Name: ' + prescription.doctor.name },
          { text: 'Doctor Specialization: ' + prescription.doctor.specialization },
          { text: 'IsFilled: ' + prescription.isFilled.toString() },
          { text: 'Date and Time: ' + prescription.createdAt },
          { text: 'Medications', style: 'subheader' },
          {
            table: {
              headerRows: 1,
              body: medicationsTable,
            },
          },
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10],
          },
          subheader: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 5],
          },
        },
      };
      
      const generatePdfContent = () => {
        // Replace this with logic to generate your PDF content
        const pdfContent = {
          content: [
            { text: 'Prescription Details', style: 'header' },
            { text: 'Patient Name: ' + prescription.patient.name },
            { text: 'Doctor Name: ' + prescription.doctor.name },
            { text: 'Doctor Specialization: ' + prescription.doctor.specialization },
            { text: 'IsFilled: ' + prescription.isFilled.toString() },
            { text: 'Date and Time: ' + prescription.createdAt },
            { text: 'Medications', style: 'subheader' },
            {
              table: {
                headerRows: 1,
                body: medicationsTable,
              },
            },
          ],
          styles: {
            header: {
              fontSize: 18,
              bold: true,
              margin: [0, 0, 0, 10],
            },
            subheader: {
              fontSize: 16,
              bold: true,
              margin: [0, 10, 0, 5],
            },
          },
        };
        return pdfContent;
      };
      
      
      const downloadPdf = () => {
        const pdfContent = generatePdfContent();
      
        // Use pdfmake's createPdf method to generate a Blob
        pdfMake.createPdf(pdfContent).getBlob((blob) => {
          // Use file-saver to trigger the download
          saveAs(blob, 'Prescription.pdf');
        });
      };
      
      
      
      return (
        
        <div className='table-container'>
     <h3> Prescription Details</h3>
     <button onClick={downloadPdf}>Download Prescription PDF</button>

     <table style={styles.table}>
         <thead>
            <tr>
                <th> Patient Name</th>
                <th> Doctor Name</th>
                <th> Doctor specialization </th>
                <th>IsFilled</th>
                <th>Date and Time</th>

            </tr>
            <tbody>
                <tr>
                <td>{prescription.patient.name}</td>
                <td>{prescription.doctor.name}</td>
                <td>{prescription.doctor.specialization}</td>
                <td>{prescription.isFilled.toString()}</td>
                <td>{prescription.createdAt}</td>




                </tr>
            </tbody>
        </thead>
     </table>
     <table style={styles.table}>
        <thead>
            <tr>
                <th>Medicine Name </th>
                <th>Dosage</th>
                <th>Instructions</th>


            </tr>
            <tbody>
            {prescription.medications.map((medicine) => (
            <tr key={medicine.name}>
              <td>{selectedMedicine === medicine ? editedName : medicine.name}</td>
              <td>{selectedMedicine === medicine ? editedDosage : medicine.dosage}</td>
              <td>
                {selectedMedicine === medicine
                  ? editedInstructions
                  : medicine.instructions}
              </td>

                    <td style={styles.td}>
                  <button
                    style={styles.button}
                    onClick={() => editMedicine(medicine)}
                  >
                    edit 
                  </button>
                </td>
                <td style={styles.td}>
                  <button
                    style={styles.button}
                    onClick={() => deleteMedicine(medicine)}
                  >
                    delete 
                  </button>
                </td>

                </tr>
           
          ))} 
            </tbody>
        </thead> 
     </table>
     <button onClick={toggleAddMedicineUI}>
        {showAddMedicineUI ? 'Cancel' : 'Add New Medicine'}
      </button>

     {editMode && selectedMedicine && (
        <div>
        <h4>Edit Medicine</h4>
        <label>Medicine Name:</label>
        <Select
          options={[...new Set(medicines.map((medicine)=>medicine.name))].map((medicineName)=>({value:medicineName, label:medicineName}))}
          value={{value:editedName,label:editedName}}
          onChange={(selectedOption) =>{ 
            setEditedDosage('')
            setEditedName(selectedOption.value)

            const dosages = medicines
            .filter((medicine) => medicine.name === selectedOption.value)
            .map((medicine) => ({ value: medicine.dosage, label: medicine.dosage }));

            setdosagesForSelectedMedicine(dosages);
          }}
          isSearchable
          placeholder="Select Medicine"
        />
        <label>Medicine Dosage:</label>
        <Select
          options={dosagesForSelectedMedicine}
          value={{value:editedDosage,label:editedDosage}}
          onChange={(selectedOption) => setEditedDosage(selectedOption.value)}
          isSearchable
          placeholder="Select Dosage"
          />
        <label>Medicine Instructions:</label>
        <input
          type='text'
          value={editedInstructions}
          onChange={(e) => setEditedInstructions(e.target.value)}
          disabled
        />
        <button onClick={saveEdit}>Save</button>
      </div>        )}
      {showAddMedicineUI && (
  <div>
    <h4>Add New Medicine</h4>
    <label>Medicine Name:</label>
    <Select
          options={[...new Set(medicines.map((medicine)=>medicine.name))].map((medicineName)=>({value:medicineName, label:medicineName}))}
          value={{value:newMedicineName,label:newMedicineName}}
      onChange={(selectedOption) =>{ setNewMedicineName(selectedOption.value)
        const dosages = medicines
        .filter((medicine) => medicine.name === selectedOption.value)
        .map((medicine) => ({ value: medicine.dosage, label: medicine.dosage }));
        setdosagesForAddedMedicine(dosages);

      
      }}
      isSearchable
      placeholder="Select Medicine"
    />
    <label>Medicine Dosage:</label>
    <Select
          options={dosagesForAddedMedicine}
          value={{value:newMedicineDosage,label:newMedicineDosage}}
      onChange={(selectedOption) => setNewMedicineDosage(selectedOption.value)}
      isSearchable
      placeholder="Select Dosage"

    />
    <label>Medicine Instructions:</label>
    <input
      type='text'
      value={newMedicineInstructions}
      onChange={(e) => setNewMedicineInstructions(e.target.value)}
    />
    <div>
    <button onClick={addNewMedicine}>Add Medicine</button>
    </div>
  </div>
)}

    </div>

  )
                }
}

const styles = {
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '20px',
    },
    th: {
      backgroundColor: '#f2f2f2',
    },
    tr: {
      '&:hover': {
        backgroundColor: '#f5f5f5',
      },
    },
  };
export default EditSelectedPrescriptions;
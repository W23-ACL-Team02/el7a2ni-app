import React, { useState, useEffect } from 'react'
import { saveAs } from 'file-saver';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';


pdfMake.vfs = pdfFonts.pdfMake.vfs;


const SelectedPrescriptions = ({ prescription }) => {
  const [medicationsTable, setMedicationsTable] = useState([]);


  useEffect(() => {
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
  }, [prescription]);

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
     <button onClick={downloadPdf}>Download PDF</button>

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
                    {prescription.medications.map((medicine)=>
                (<tr key={medicine.name}>
                    <td>{medicine.name}</td>
                    <td>{medicine.dosage}</td>
                    <td>{medicine.instructions}</td>
                </tr>
           
          ))} 
            </tbody>
        </thead> 
     </table>
        
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
export default SelectedPrescriptions;
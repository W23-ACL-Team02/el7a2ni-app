import React, { useState, useEffect } from 'react'


const SelectedPrescriptions = ({ prescription }) => {
    if (!prescription) {
      return  <h3> Prescription Details</h3>

    }
    else
    {
        
  return (
    
    <div className='table-container'>
     <h3> Prescription Details</h3>
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

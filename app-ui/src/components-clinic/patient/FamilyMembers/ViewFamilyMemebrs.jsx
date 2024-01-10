import {React,useEffect,useState} from 'react'
import axios from 'axios'
const severURL = process.env.REACT_APP_SERVER_URL;
export default function ViewFamilyMemebrs() {

    const[FamilyMembers,setFamilyMembers]= useState([]);
    const[LinkedFamilyMembers,setLinkedFamilyMembers]= useState([]);



    

    useEffect(()=>{
        axios.get(`${severURL}/clinic/private/family/viewfamilymember`,{withCredentials: true})
        .then((res)=>{
          console.log(res)
            setFamilyMembers(res.data.createdFamilyMembers)
            
            setLinkedFamilyMembers(res.data.linkedFamilyMembers)
        })
        .catch((error) =>{
          console.log(error)
        })

    },[])
  return (

    <div>
           <h3>family members</h3> 
     <table> 
        <thead>
        <tr>
         <th>Name</th>  
         <th>NationalID</th>  
         <th>age</th>  
         <th>gender</th> 
         <th>relationship</th> 
         </tr>
         </thead>
        <tbody>
           {FamilyMembers.map((familymember)=>
           (<tr key={familymember.nationalID}>
            <td>{familymember.name}</td>
            <td>{familymember.nationalID}</td>
            <td>{familymember.age}</td>
            <td>{familymember.gender}</td>
            <td>{familymember.relationship}</td>
           </tr>
           
          ))} 
          
        </tbody>
           
    </table>
    <h3>Linked family members</h3> 
     <table> 
        <thead>
        <tr>
         <th>Name</th>  
         <th>email</th>  
         <th>phone number</th> 
         <th>relationship</th> 
         </tr>
         </thead>
        <tbody>
        {LinkedFamilyMembers.map(({ familyMemberData, relationship }) => (
  <tr key={familyMemberData.email}>
    <td>{familyMemberData.name}</td>
    <td>{familyMemberData.email}</td>
    <td>{familyMemberData.mobile}</td>
    <td>{relationship}</td>
  </tr>
))}
          
        </tbody>
           
    </table>

    </div>
  )
}

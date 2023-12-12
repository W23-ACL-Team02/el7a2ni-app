import {React,useEffect,useState} from 'react'
import axios from 'axios';
export default function ViewLinkedFamilyMembers() {
    const[linkedFamilyMembers,setLinkedFamilyMembers]= useState([]);


    

    useEffect(()=>{
        axios.get("http://localhost:3000/private/familymember/viewLinkedFamilyMember",{withCredentials: true})
        .then((res)=>{
          console.log(res)
          setLinkedFamilyMembers(res.data.familymembers)
        })
        .catch((error) =>{
          console.log(error)
        })

    },[])
  return (
    <div>
      <h2>Linked Family Members</h2>
      <ul>
        {linkedFamilyMembers.map((familyMember) => (
          <li key={familyMember.id}>
            
            <p>Name: {familyMember.name}</p>
            <p>Phone Number: {familyMember.phoneNumber}</p>
            <p>Email: {familyMember.email}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

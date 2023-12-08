import classes from './mainPage.module.css';
import SubscriptionComparisonCard from '../SubscriptionComparisonCard/SubscriptionComparisonCard.js';
import PersonalBar from '../PersonalBar/PersonalBar.js';
import FamilyBar from '../FamilyBar/FamilyBar.js';
import axios from 'axios';
const { useState, useEffect } = require("react");

export default function HealthPackageManagement(props) {
  const [packages, setPackages] = useState([]);
  const [mySubscription, setSubscription] = useState();
  const [familyMembers, setFamilyMembers] = useState();

  useEffect(() => {

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dnZWRpbiI6dHJ1ZSwidXNlcklkIjoiNjU0N2I5NjYwNjA0MzcyNDUzM2VlZGJmIiwidXNlclR5cGUiOiJwYXRpZW50IiwiaWF0IjoxNzAxNjQ2NDE5fQ.gvM2L1f_JjOZFzRYgWalnc5QQhRM8R_N0ofC60FAHbU";
  const getPackages = async () => {
     await axios.get('http://localhost:3000/private/patient/healthPackage/all', {headers: {'Authorization': `Bearer ${token}`}}).then(
    (res) => { 
        const packages = res.data
        console.log(packages.healthPackages)
        setPackages(packages.healthPackages)
    });
  }

  var showPackagesCards = true
  const getSubscriptionDetails = async () => {
    try {
      const res  = await axios.get('http://localhost:3000/private/patient/healthPackage/view', {headers: {'Authorization': `Bearer ${token}`}})
      setSubscription(res.data)
      console.log(mySubscription)
    } catch (error) {
        console.log(error);
    }
    

   if (!mySubscription){
    console.log('subscription is null')
   }
   else{
    console.log(mySubscription)
   }
   if (!mySubscription || mySubscription.subscription.status === "Cancelled" || mySubscription.subscription.status === "Unsubscribed"){
    showPackagesCards = false
    // getPackages();
    // getFamilyMembers();
    console.log("not subscribed")
   }
 }

 const getFamilyMembers = async () => {
  await axios.get('http://localhost:3000/private/family', {headers: {'Authorization': `Bearer ${token}`}}).then(
 (res) => { 
    setFamilyMembers(res.data)
    if (!familyMembers){
      console.log('family is null')
     }
    console.log(familyMembers)
 }).catch((error) => {
    console.log(error);
 });
}
 

    console.log("inside useEffect")
    getPackages();
    getSubscriptionDetails()
    getFamilyMembers()
    console.log('family useEffect')
    console.log(familyMembers)
  }, []);

  return (
    // hidden={showPackagesCards ? 'hidden': ''}
    <div className={classes.frame}>
      <PersonalBar  details={mySubscription}/>
      <FamilyBar  family={familyMembers}/>
      <div className={classes.allCards}>
        {packages.map((healthPackage) => (
          <div className={classes.cardContainer} key={healthPackage._id}>
            <SubscriptionComparisonCard 
                name={healthPackage.name}
                discountSession={healthPackage.discountSession}
                discountFamily={healthPackage.discountFamilySubscription}
                discountMedicine={healthPackage.discountMedicine}
                color={healthPackage.color}
                price={healthPackage.price}
                id={healthPackage._id}
                />
        </div>
        ))}
      </div>      
    </div>
  );
}


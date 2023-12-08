import classes from './mainPage.module.css';
import SubscriptionComparisonCard from '../subscriptionComparisonCard/subscriptionComparisonCard.js';
import PersonalBar from '../PersonalBar/PersonalBar.js';
import FamilyBar from '../FamilyBar/FamilyBar.js';
import axios from 'axios';
const { useState, useEffect } = require("react");

export default function HealthPackageManagement(props) {
  const [packages, setPackages] = useState([]);
  const [mySubscription, setSubscription] = useState(null);

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
    await axios.get('http://localhost:3000/private/patient/healthPackage/view', {headers: {'Authorization': `Bearer ${token}`}}).then(
   (res) => { 
      setSubscription(res.data)
      console.log(mySubscription)
   }).catch((error) => {
      console.log(error);
   });
   if (!mySubscription){
    console.log('subscription is null')
   }
   if (!mySubscription || mySubscription.subscription.status === "Cancelled" || mySubscription.subscription.status === "Unsubscribed"){
    showPackagesCards = false
    getPackages();
    console.log("not subscribed")
   }
 }
 const getFamilyMembers = async () => {
  await axios.get('http://localhost:3000/private/patient/healthPackage/view', {headers: {'Authorization': `Bearer ${token}`}}).then(
 (res) => { 
    setSubscription(res.data)
    console.log(mySubscription)
 }).catch((error) => {
    console.log(error);
 });
 if (!mySubscription){
  console.log('subscription is null')
 }
 if (!mySubscription || mySubscription.subscription.status === "Cancelled" || mySubscription.subscription.status === "Unsubscribed"){
  showPackagesCards = false
  getPackages();
  console.log("not subscribed")
 }
}
 

  useEffect(() => {
    console.log("inside useEffect")
    getSubscriptionDetails()
    getFamilyMembers()
  }, []);

  return (
    // hidden={showPackagesCards ? 'hidden': ''}
    <div className={classes.frame}>
      <PersonalBar  details={mySubscription}/>
      <FamilyBar  details={mySubscription}/>
      <div className={classes.allCards} hidden={showPackagesCards ? '': 'hidden'}>
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


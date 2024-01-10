import classes from './mainPage.module.css';
import SubscriptionComparisonCard from '../SubscriptionComparisonCard/SubscriptionComparisonCard.js';
import PersonalBar from '../PersonalBar/PersonalBar.js';
import FamilyBar from '../FamilyBar/FamilyBar.js';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
const { useState, useEffect, useRef} = require("react");
const serverURL = process.env.REACT_APP_SERVER_URL;

export default function HealthPackageManagement(props) {
  const [packages, setPackages] = useState([]);
  const [mySubscription, setSubscription] = useState(null);
  const [familyMembers, setFamilyMembers] = useState(null);
  const [subscribedFamilyMembers, setSubscribedFamilyMembers] = useState([]);
  const [unsubscribedFamilyMembers, setUnsubscribedFamilyMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState('')
  const navigate = useNavigate()

  const getPackages = async () => {
    await axios.get(`${serverURL}/clinic/private/patient/healthPackage/all`, {withCredentials: true}).then(
    (res) => { 
        const packages = res.data
        // console.log(packages.healthPackages)
        setPackages(packages.healthPackages)
    });
  }

  const goToPayment = async(packageId) => {
    console.log('subscribing to package: ' + packageId)
      if (selectedMember == 'Myself'){
          const data = {selectedMember: selectedMember, patient : {}, packageId: packageId,  type:"Myself"}
          navigate( "/healthPackagesPayment", {state: data});
      }else{  
          var member;
          console.log('looking for ' + selectedMember)
          unsubscribedFamilyMembers.forEach(element => {
          console.log(element)
            if (element.name == selectedMember){
              member = element;
              console.log('member found')
          }
        });
       if (member){
          const data = {selectedMember: selectedMember, patient : member, packageId: packageId, type: member.type}
          navigate( "/healthPackagesPayment", {state: data});
      }
    }
  }  

  const cancelPersonal = async () => {
    //, headers: {Authorization: `Bearer ${token}`}
    console.log('cancelling my sub')

    await axios.post(`${serverURL}/clinic/private/patient/healthPackage/cancel`, {},{withCredentials: true}).then(
    (res) => {
        // console.log(res.data)
        getSubscriptionDetails()
        getFamilyMembers()

        // setUnsubscribedFamilyMembers(unsubscribedFamilyMembers.filter((element) => element.name != 'Myself'))
      }).catch((error) => {
      console.log(error);
   });
  }
  const cancelMember = async (member) => {
      // console.log('looking for ' + selectedMember)
      subscribedFamilyMembers.forEach(element => {
        // console.log(element)
        if (element.name == member){
          member = element;
        }
      })
    console.log('cancelling ' + member.name)

    await axios.post(`${serverURL}/clinic/private/family/cancel`, {memberId: member.id, memberType: member.type}, {withCredentials: true}).then(
    (res) => {
        console.log(res.data)
        getSubscriptionDetails()
        getFamilyMembers()

        const unsubbed = unsubscribedFamilyMembers
        if (unsubbed.length == 0){
          setSelectedMember(member.name)
        }
        unsubbed.push(member)
        setUnsubscribedFamilyMembers(unsubbed)

      }).catch((error) => {
      console.log(error);
   });
  }

  var showPackagesCards = true
  const getSubscriptionDetails = async () => {
      try {
        console.log('getting subscription')
        const res  = await axios.get(`${serverURL}/clinic/private/patient/healthPackage/view`, {withCredentials: true})
        setSubscription(res.data)
        // console.log(res.data)
        // console.log(res.data.subscription.status)
      } catch (error) {
          console.log(error);
      }
      if (mySubscription?.subscription?.status === "Unsubscribed"){
        const unsubbed = unsubscribedFamilyMembers
        unsubbed.push('Myself')
        setUnsubscribedFamilyMembers(unsubbed)
      }
      else {
        showPackagesCards = false
      }
  }

  const getFamilyMembers = async () => {
    await axios.get(`${serverURL}/clinic/private/family`, {withCredentials: true}).then(
    (res) => { 
        const familyMembers = res.data.family
        setFamilyMembers(familyMembers)
        console.log(res.data)

        //filtering family members by subscription status
        const subbed = []
        const unsubbed = []
        familyMembers?.listLinked.map((member) => {
          if (['Subscribed', 'Subscribed through family member'].includes(member?.status)){
            subbed.push({name: member.name, id: member.id, type: 'linked', status: member.status, endDate: member.endDate, packageName: member.packageName, packageColor: member.packageColor});
          }
          else {
            unsubbed.push({name: member.name, id: member.id, type: 'linked'});
          }
        })
        familyMembers?.listCreated.map((member) => {
          if (['Subscribed', 'Subscribed through family member'].includes(member?.status)){
            subbed.push({name: member.name, id: member.id, type: 'created', status: member.status, endDate: member.endDate, packageName: member.packageName, packageColor: member.packageColor});
          }
          else {
            unsubbed.push({name: member.name, id: member.id, type: 'created'});
          }
        })

        setSubscribedFamilyMembers(subbed)
        setUnsubscribedFamilyMembers(unsubbed)
        
        // console.log('subbed members:')
        // console.log(subbed)
        // console.log('unsubbed members:')
        // console.log(unsubbed)
        
        // console.log(res.data)
    }).catch((error) => {
        console.log(error);
    });
  }
 
  useEffect(() => {
    // console.log("inside useEffect")
    getPackages();
    getSubscriptionDetails()
    getFamilyMembers()
    
  }, []);

  function handleMemberSelection(event) {
    setSelectedMember(event.target.value);
    console.log('set subbed selection as \'' + event.target.value + '\'')
  }

  function FamilyMemberSelector({unsubscribed}) {
    if (unsubscribed && selectedMember == ''){
      setSelectedMember('Myself')
      console.log('set subbed selection as \'Myself\'')
    }
    else if (unsubscribedFamilyMembers.length != 0 && selectedMember == ''){
      setSelectedMember(unsubscribedFamilyMembers[0].name)
      console.log('set subbed selection as \'' + unsubscribedFamilyMembers[0].name + '\'')
    }
    return (
      <div className={classes.memberSelectorBar}>
        <div className={classes.memberSelectorBarText}>Subscribe for</div>
        <select className={classes.selector} onChange={handleMemberSelection} value={selectedMember}>
          {unsubscribed && <option value='Myself'>Myself</option>}
          {unsubscribedFamilyMembers.map((member) => (
            <option value={member.name} key={member.id}>{member.name}</option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className={classes.frame}>
      <PersonalBar  details={mySubscription} cancelFunction={cancelPersonal}/>
      {subscribedFamilyMembers.length != 0 && <FamilyBar  details={mySubscription} members={subscribedFamilyMembers} cancelFunction={cancelMember}/>}
      {(unsubscribedFamilyMembers.length != 0 || mySubscription?.subscription.status == 'Unsubscribed') 
      && <FamilyMemberSelector unsubscribed={mySubscription?.subscription.status == 'Unsubscribed'}/>}
      {(unsubscribedFamilyMembers.length != 0 || mySubscription?.subscription.status == 'Unsubscribed')
      && <div className={classes.allCards}>
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
                subscribeFunction={goToPayment}
                />
        </div>
        ))}
      </div>}     
    </div>
  );
}


import classes from './mainPage.module.css';
import SubscriptionComparisonCard from '../subscriptionComparisonCard/subscriptionComparisonCard.js';
import axios from 'axios';
const { useState, useEffect } = require("react");

export default function HealthPackageManagement(props) {
  const [packages,setPackages] = useState([]);

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dnZWRpbiI6dHJ1ZSwidXNlcklkIjoiNjU0N2JhMDIyYzE4ZDIwMGU0OTk2YzA5IiwidXNlclR5cGUiOiJhZG1pbiIsImlhdCI6MTcwMDgzOTg3OH0.8rFimcIwIJrQ3OWuJ8GdbcFg_k6-CoQ4SZgDNuszuTM";
  const getPackages = async () => {
     await axios.get('http://localhost:3000/private/admin/healthPackage', {headers: {'Authorization': `Bearer ${token}`}}).then(
    (res) => { 
        const packages = res.data
        console.log(packages.healthPackages)
        setPackages(packages.healthPackages)
    });
  }

  useEffect(() => {
    getPackages();
 }, []);
  return (
    <div className={classes.frame}>
      
      {packages.map((healthPackage) => (
        <div className={classes.cardContainer}>
          <SubscriptionComparisonCard 
              name={healthPackage.name}
              discountSession={healthPackage.discountSession}
              discountFamily={healthPackage.discountFamilySubscription}
              discountMedicine={healthPackage.discountMedicine}
              color={healthPackage.color}
              price={healthPackage.price}
              />
      </div>
        ))}
      
    </div>
  );
}


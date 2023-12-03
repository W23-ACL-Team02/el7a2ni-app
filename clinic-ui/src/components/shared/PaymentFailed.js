import styles from '../../components/patient/HealthPackagesCheckout/HealthPackagesCheckout.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom";
const { useEffect } = require("react");

export default function PaymentFailed () {
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {navigate(-1)}, 4000)
    }, [])
    
    return(
        <div className={styles.failedContainer}>
            <FontAwesomeIcon className={styles.failedIcon} icon={faCircleXmark} />
            <p>Payment Failed</p>
            <p>please try again</p>
        </div> 
    )
}
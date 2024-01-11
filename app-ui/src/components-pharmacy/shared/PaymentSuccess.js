import styles from '../../components-pharmacy/patient/MedicinePayment/MedicinePayment.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom";
const { useEffect } = require("react");


export default function PaymentSuccess() {
    const navigate = useNavigate();

    setTimeout(() => {navigate("/home")}, 4000)
  
    return(
        <div className={styles.successContainer}>
            <FontAwesomeIcon className={styles.successIcon} icon={faCircleCheck} />
            <p>Payment Successful</p>
            <p>redirecting to home page</p>
        </div> 
    )
}
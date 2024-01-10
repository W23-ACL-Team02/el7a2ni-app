import axios from 'axios';
import styles from '../AppointmentPayment/AppointmentPayment.module.css'
import StripeCheckout from 'react-stripe-checkout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCreditCard } from '@fortawesome/free-solid-svg-icons'
import { faWallet } from '@fortawesome/free-solid-svg-icons'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom";
const { useState , useEffect, useRef } = require("react");
const serverURL = process.env.REACT_APP_SERVER_URL
const publishableKey =process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY

const AppointmentCheckout = () => {    
    const [appointmentPrice,setAppointmentPrice] = useState([]);
    const [SelectedPaymentMethod, setSelectedPaymentMethod] = useState("");
    const cardRef = useRef(null);
    const navigate = useNavigate()
    // let { state } = useLocation();
    // const appointment = state.appointment
    const appointment = {doctorID: "6547cd2f63304dedceb8644b", patientID: "6547b96606043724533eedbf", date: "10-10-2024"}

    const getAppointmetPrice =  async () => {
    await axios.get(`${serverURL}/private/payment/getAppointmentPrice`, {params: { doctorID: appointment.doctorID }, withCredentials:true}).then(
    (res) => { 
       const appointmentPrice = res.data
       setAppointmentPrice(appointmentPrice)
       console.log(appointmentPrice)
   }); 
}

    const payByCard = async token => {
        try {
            const response = await axios({
                url: `${serverURL}/private/payment/payByCard`,
                method: 'post',
                data: {
                    amount: Math.ceil( appointmentPrice.price  * 100),
                    token,
                },
                withCredentials: true
            });
            if(response.data === "success"){
                console.log('your payment was successful')
                //call subscribe to health packages Api
                navigate("/checkout-success")
            }else{
                console.log('your payment was unsuccessful')
                //navigate to failed page
                navigate("/checkout-failed")
            }
        } catch (error) {
        console.log(error);
        }
    }

    const payByWallet = async () => {
        await axios.post(`${serverURL}/private/payment/payByWallet`, {totalPrice : appointmentPrice.price}, {withCredentials:true}).then(
            (res) =>{
                console.log(res)
                if(res.data === "success"){
                    console.log('your payment was successful')
                    //call subscribe to health packages Api
                    navigate("/checkout-success")
                }else{
                    console.log('your payment was unsuccessful')
                    //navigate to failed page
                    navigate("/checkout-failed")
                }
            }
        )
    }

    const onSelectedPaymentChange = (event) => {
        setSelectedPaymentMethod(event.target.value)
    }

    const handlePayment = (event) =>{
        event.preventDefault();
        console.log(SelectedPaymentMethod)  
            if(SelectedPaymentMethod === "wallet"){
                payByWallet()
            }else if(SelectedPaymentMethod === "card"){
                cardRef.current.click()
            }  
    }

    useEffect(() =>{
        getAppointmetPrice();   
     }, []);
   

    return (
        <div className={styles.checkout_container}>
            <div className={styles.items}>
                {appointmentPrice.appliedDiscount === 0
                    ? <p>Appointment Price: {appointmentPrice.price}</p>
                    : <p>Appointment Price: {appointmentPrice.price}, applied discount: {appointmentPrice.appliedDiscount *100} % </p>
                }
            </div>    
            <div className={styles.paymentOptions}>
                <div className={styles.title}>
                    <h4>Select a <span style={{color: "#6064b6",}} >Payment</span> method</h4>
                </div>
                <form onSubmit={handlePayment}>
                    <input type="radio" 
                           name="payment" 
                           id="card" 
                           value="card" 
                           onChange={onSelectedPaymentChange}
                           className={styles.cardRadio}/>
                    <input type="radio" 
                           name="payment" 
                           id="wallet" 
                           value="wallet" 
                           onChange={onSelectedPaymentChange}
                           className={styles.walletRadio}/>
               
                    <div className={styles.category}>
                        <label htmlFor="card" className={styles.cardMethod}>
                            <div className={styles.iconName}>
                                    <div className={styles.iconContainer}>
                                        <FontAwesomeIcon icon={faCreditCard} />
                                    </div>
                                    <span className={styles.name}>Credit or Debit Card</span>
                            </div>
                            <span className={styles.check}><FontAwesomeIcon icon={faCircleCheck} style={{color: "#6064b6",}} /></span>        
                        </label>
                        <label htmlFor="wallet" className={styles.walletMethod}>
                            <div className={styles.iconName}>
                                    <div className={styles.iconContainer}>
                                        <FontAwesomeIcon icon={faWallet} />
                                    </div>
                                    <span className={styles.name}>Wallet</span>
                            </div>
                            <span className={styles.check}><FontAwesomeIcon icon={faCircleCheck} style={{color: "#6064b6",}} /></span>        
                        </label>
                    </div>
                    <button type='submit' className={styles.payBtn}>Pay</button>
                </form>
                
                <StripeCheckout 
                    style={{ display: 'none' }}
                    stripeKey = {publishableKey}
                    label = "Credit and Debit Card"
                    name = "Pay With Credit Card"
                    billingAddress
                    amount = {Math.ceil(appointmentPrice?.price * 100)}
                    description = {`Your total is ${appointmentPrice?.price}`}
                    token = {payByCard}
                >
                    <button ref = {cardRef} style={{ display: 'none' }}>
                    </button>
                </StripeCheckout>
                            
            </div>
        </div>
    )
}

export default AppointmentCheckout;


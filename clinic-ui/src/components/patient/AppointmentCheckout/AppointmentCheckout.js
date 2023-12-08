import axios from 'axios';
import styles from '../AppointmentCheckout/AppointmentCheckout.module.css'
import StripeCheckout from 'react-stripe-checkout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCreditCard } from '@fortawesome/free-solid-svg-icons'
import { faWallet } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom";
const { useState } = require("react");
const { useEffect } = require("react");
const serverURL = process.env.REACT_APP_SERVER_URL
const publishableKey =process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY

const AppointmentCheckout = () => {    
    const [appointmentPrice,setAppointmentPrice] = useState([]);
    const navigate = useNavigate()
    // let { state } = useLocation();
    // const appointment = state.appointment
    const appointment = {doctorID: "6547cd2f63304dedceb8644b", patientID: "6547b96606043724533eedbf", date: "10-10-2024"}

    const getAppointmetPrice =  async () => {
    await axios.get(`${serverURL}/private/payment/getAppointmentPrice`, {params: { doctorID: appointment.doctorID }}).then(
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
                    amount: appointmentPrice.price,
                    token,
                },
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
        await axios.post(`${serverURL}/private/payment/payByWallet`, {totalPrice : appointmentPrice.price}).then(
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
                <h2>Choose a Payment Method</h2>
                <StripeCheckout 
                    stripeKey = {publishableKey}
                    label = "Credit and Debit Card"
                    name = "Pay With Credit Card"
                    billingAddress
                    amount = {appointmentPrice * 100}
                    description = {`Your total is ${appointmentPrice}`}
                    token = {payByCard}
                >
                    <button className={styles.paymentOptionBtn}>
                        Credit and Debit Card
                        <FontAwesomeIcon className={styles.icon} icon={faCreditCard} />
                    </button>
                </StripeCheckout>
                <button className={styles.paymentOptionBtn} onClick={payByWallet}>
                    Wallet
                    <FontAwesomeIcon className={styles.icon} icon={faWallet} />
                </button>
            </div>
        </div>
    )
}

export default AppointmentCheckout;


import axios from 'axios';
import styles from '../AppointmentPayment/AppointmentPayment.module.css'
import StripeCheckout from 'react-stripe-checkout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCreditCard } from '@fortawesome/free-solid-svg-icons'
import { faWallet } from '@fortawesome/free-solid-svg-icons'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { useLocation, useNavigate } from "react-router-dom";
const { useState , useEffect, useRef } = require("react");
const serverURL = process.env.REACT_APP_SERVER_URL
const publishableKey =process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY

const AppointmentCheckout = () => {  
    const [selectedAppointmentStartTime, setSelectedAppointmentStartTime] = useState("");
    const [doctor, setDoctor] = useState();
    const [patientUsername, setPatientUsername] = useState();
    const [appointmentPrice,setAppointmentPrice] = useState([]);
    const [SelectedPaymentMethod, setSelectedPaymentMethod] = useState("");
    const cardRef = useRef(null);
    const navigate = useNavigate()
    let { state } = useLocation();

    useEffect(() =>{
        setSelectedAppointmentStartTime(state.selectedAppointmentStartTime);
        setDoctor(state.doctor);
        setPatientUsername(state.patientUsername);
        getAppointmetPrice(state.doctor._id);   
        console.log('Start Time: ',state.selectedAppointmentStartTime);
        console.log('Pat username: ',state.patientUsername);
        console.log('Doc username: ',state.doctor.username);
     }, []);

    const getAppointmetPrice =  async (doctorId) => {
    await axios.get(`${serverURL}/clinic/private/payment/getAppointmentPrice`, {params: { doctorID: doctorId }, withCredentials:true}).then(
    (res) => { 
       const appointmentPrice = res.data
       setAppointmentPrice(appointmentPrice)
   }); 
}

    const payByCard = async token => {
        try {
            const response = await axios({
                url: `${serverURL}/clinic/private/payment/payByCard`,
                method: 'post',
                data: {
                    amount: Math.round( appointmentPrice.price * 100 *1.1),
                    token,
                },
                withCredentials: true
            });
            if(response.data === "success"){
                console.log('your payment was successful')
                handleBooking();
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
        await axios.post(`${serverURL}/clinic/private/payment/payByWallet`, {totalPrice : appointmentPrice.price *1.1}, {withCredentials:true}).then(
            (res) =>{
                console.log(res)
                if(res.data === "success"){
                    console.log('your payment was successful')
                    handleBooking();
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

    const handleBooking = async () => {
        try {
            console.log('Selected Appointment:', selectedAppointmentStartTime);
            const response = await axios.post(`${serverURL}/clinic/private/patient/bookAppointment`,
                {
                    patientUsername: patientUsername,
                    timeSlotStartTime: selectedAppointmentStartTime,
                    doctorUsername: doctor.username,
                },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        console.log('Response:', response.data);
        } catch (error) {
        console.error(error.message);
        }
    }

    return (
        <div className={styles.checkout_container}>
            <div className={styles.items}>
                {appointmentPrice.appliedDiscount === 0
                    ? <p>Appointment Price: {appointmentPrice.price *1.1}</p>
                    : <p>Appointment Price: {appointmentPrice.price *1.1}, applied discount: {appointmentPrice.appliedDiscount *100} % </p>
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
                    amount = {Math.round(appointmentPrice?.price * 100 *1.1)}
                    description = {`Your total is ${Math.round(appointmentPrice?.price *1.1)}`}
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


import axios from 'axios';
import styles from '../HealthPackagesCheckout/HealthPackagesCheckout.module.css'
import StripeCheckout from 'react-stripe-checkout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCreditCard } from '@fortawesome/free-solid-svg-icons'
import { faWallet } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom";
const { useState } = require("react");
const { useEffect } = require("react");
const serverURL = process.env.REACT_APP_SERVER_URL

const AppointmentCheckout = () => {
    console.log(serverURL)
    const publishableKey ='pk_test_51OGoo1J9XgJY7IQheYEJKzjO59nSHu1OMHpdb5mvemahLcimZn5yqlMiLfwhwVnmxt37jkDwMw1bFQ8JZeRyWa4J00rN0xdh3o';
    const [appointmentPrice,setAppointmentPrice] = useState([]);
    const navigate = useNavigate()
    // let { state } = useLocation();
    // const appointment = state.appointment
    const appointment = {doctorID: "6547cd2f63304dedceb8644b", patientID: "6547b96606043724533eedbf", date: "10-10-2024"}

    const getAppointmetPrice =  async () => {
    await axios.get(`http://localhost:4000/private/payment/getDoctorPayRate`, {params: { doctorID: appointment.doctorID }}).then(
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
                    amount: appointmentPrice,
                    token,
                },
            });
            if(response.body.status === "success"){
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
        await axios.post("http://localhost:4000/private/payment/payByWallet", {totalPrice : appointmentPrice}).then(
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
        <div className={styles.container}>
                <p>Appointment Price: {appointmentPrice}</p>
            <div>
                <StripeCheckout 
                    stripeKey = {publishableKey}
                    label = "Credit and Debit Card"
                    name = "Pay With Credit Card"
                    billingAddress
                    amount = {appointmentPrice * 100}
                    description = {`Your total is ${appointmentPrice}`}
                    token = {payByCard}
                >
                    <button>
                        Credit and Debit Card
                        <FontAwesomeIcon icon={faCreditCard} />
                    </button>
                </StripeCheckout>
                <button onClick={payByWallet}>
                    Wallet
                    <FontAwesomeIcon icon={faWallet} />
                </button>
            </div>
        </div>
    )
}

export default AppointmentCheckout;


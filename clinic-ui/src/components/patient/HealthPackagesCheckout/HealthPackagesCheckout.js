import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom";
const { useState } = require("react");
const { useEffect } = require("react");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const HealthPackageCheckout = () => {
    const navigate = useNavigate()
    // let { state } = useLocation();
    // const healthPackages = state.healthPackages
    const healthPackages = [{id: "655ffa2f8066173be32d7373", quantity: 1}]

    const payByCard = async () => {
        let checkoutURL = ""
        await axios.post("http://localhost:4000/private/payment/payForHealthPackageByCard", healthPackages).then(
            (res) => {
                checkoutURL = res.data.url;
                window.location.href = checkoutURL;
            }).catch((error) => {
                console.log("fetch payForHealthPackageByCard error: " + error)
            });
    }

    const payByWallet = async () => {
        await axios.post("http://localhost:4000/private/payment/payForHealthPackageByWallet", healthPackages).then(
            (res) =>{
                
            }
        )
    }

    useEffect(() =>{
        payByCard();
     }, []);

    

    // stripe.redirectToCheckout({ sessionId: YOUR_SESSION_ID })
    // .then((result) => {
    //   if (result.error) {
    //     // Handle any errors that occurred during the redirect.
    //   } else {
    //     // Call your additional API function here after successful payment
    //     callAnotherApiFunction();
    //   }
    // });    

    return (
        <div></div>
    )
}

export default HealthPackageCheckout;
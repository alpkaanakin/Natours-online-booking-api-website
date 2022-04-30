/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts"

export const bookTour = async tourId => {
  // Get CheckOut Session
  try{
  const stripe = Stripe(
  "pk_test_51KsGGVAnKHqafT4Bs5ZFe7xKsJdr0FmJaX6ro5JZb9v7kYLCSuasQ1MtRuMnGFOy2daE7MzbDRifvxf58LQRaFUT00SbeoSdn3"
);

  const session = await axios(`/api/booking/checkout-session/${tourId}`);


  // Create checkout  form + chanre credit card
  await stripe.redirectToCheckout({
    sessionId: session.data.session.id
  })

  }catch(err) {console.log(err); showAlert("error",err)}


}
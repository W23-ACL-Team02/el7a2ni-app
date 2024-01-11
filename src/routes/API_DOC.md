### GET /clinic/private/doctor/getAllPatients
Responds with a list of patients that have upcomming appointments with the logged in doctor.

**Notes:**
* Must send JWT as cookie for authentication

### GET /clinic/private/doctor/patient/:id
Responds with JSON containing info of patient with specified id

**Query:**
* `id`: User ID of a specific patient to fetch

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type doctor
* id of user must be that of a patient type

### GET /clinic/private/doctor/getByName
Responds with JSON containing info of patient with specified name

**Body:**
* `Name`: Name of patient to search for

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type doctor

### GET /clinic/private/payment/getAllSelectedHealthPackages?packages={packages}
Responds with JSON containing the names of the health packages that the patient chooses for him/her or his/her family members along with the total price of these packages and the applied discount if any.

**Query:**
* `packages`: A list containing the ids of the selected packages and the ids of the patients whom these packages are for.

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type patient

### GET /clinic/private/payment/getAppointmentPrice?doctorID={doctorID}
Responds with JSON containing the session price of the doctor whom the patient is booking an appointment with and the applied discount if any.

**Query:**
* `doctorID`:the id of doctor that the patient is booking an appointment with.

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type patient
* doctorID must be an id of a user of type doctor

### POST /clinic/private/payment/payByCard
initiates a payment using a card and provides a response indicating success or failure.

**Body:**
* `amount`:the amount that needs to be payed.

**Notes:**
* Must send JWT as cookie for 
* User in token must be of type patient

### POST /clinic/private/payment/payByWallet
initiates a payment using the wallet and provides a response indicating success or failure.

**Body:**
* `amount`:the amount that needs to be payed.

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type patient

### GET /pharmacy/private/admin/pendingPharmacists
Responds with JSON containing all pharmacists pending approval.

**Query:**
* `id(optional)`: User ID of a specific pending pharmacist

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type admin
* id in query must be of type pharmacist that is pending approval

### GET /pharmacy/private/admin/user/patients
Responds with JSON containing all patients in database.

**Query:**
* `familyId (optional)`: User ID of a specific family member to fetch
* `relationType (optional)`: The type of relation between the user and their family member

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type admin

### GET /pharmacy/private/admin/user/pharmacists
Responds with JSON containing all working pharmacists (approved only)


**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type admin


### GET /pharmacy/private/admin/user/patient/:id
Responds with JSON containing info of user with specified id

**Query:**
* `id`: User ID of a specific user to fetch

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type admin
* id of user must be that of a patient type


### GET /pharmacy/private/admin/user/pharmacist/:id
Responds with JSON containing info of pharmacist with specified id

**Query:**
* `id`: User ID of a specific user to fetch

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type admin
* id of user must be that of a pharmacist type


### GET /pharmacy/private/patient/order/viewaddress
Responds with JSON containing all saved addresses of current logged in user.

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type patient


### POST /pharmacy/private/patient/order/addaddress
Lets user add a new address to their address array.

**Body:**
* `addressline1`: Address Line 1
* `addressline2`: Address Line 2
* `floor`: Address Floor
* `apartment`: Apartment Number
* `postalcode`: Postal Code for address
* `city`: Address City
* `country`: Address Country

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type patient

### GET /pharmacy/private/patient/order/getaddress
Responds with JSON containing info of the currently set address for delivery for user

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type patient

### POST /pharmacy/private/patient/order/chooseaddress/:id
Lets user set a certain saved address as their current delivery address for the order.

**Query:**
* `id`: ID of delivery address

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type patient


### GET /pharmacy/private/patient/order/gettotal
Calculates total of patient's current cart and responds with JSON containing it.


**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type patient


### POST /pharmacy/private/patient/order/placeorder
Creates order of patient's cart and changes the quantity and number of sales of bought medicine(s) accordingly.


**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type patient


### POST /pharmacy/private/patient/order/cancelorder/:id
Cancels a specific order. Responds with JSON containing whether or not it could be done successfully

**Query:**
* `id`: ID of order

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type patient
* Handles refunds to wallet in case of non COD orders
* Adjusts number of sales/quantity of returned medicine(s) accordingly


### GET /pharmacy/private/patient/order/vieworders
Responds with JSON containing all orders of patient.


**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type patient
* Shows current (placed) orders and past (delivered) and cancelled ones



### POST pharmacy/private/pharmacist/medicine/archive
Lets pharmacist archive/unarchive a medicine

**Body:**
* `medicineId`: Medicine ID of medicine to archive

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type pharmacist


### GET pharmacy/private/medicine/allunarchived
Responds with JSON containing all medicines that are NOT archived.


**Notes:**
* Must send JWT as cookie for authentication

### POST /pharmacy/private/admin/user/addAdmin
Lets admin add a new admin to the pharmacy.

**Body:**
*`username`: new admin's username
*`password`: new admin's password

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type admin

### POST /clinic/private/admin/user/addAdmin
Lets admin add a new admin to the clinic.

**Body:**
*`username`: new admin's username
*`password`: new admin's password

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type admin

### POST /pharmacy/private/admin/user/removeUser
Lets admin remave a user from the pharmacy.
**Body:**
*`username`: username of the user to be removed

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type admin

### POST /clinic/private/admin/user/removeUser
Lets admin remave a user from the clinic
**Body:**
*`username`: username of the user to be removed

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type admin

### 

### POST /clinic/private/doctor/addTimeSlots
 lets doctor add his/her available time slots for appointments.

**Body:**
*`date`: the date of the available slot
*`start`: the start time of the available slot
*`end`:the end time of the available slot

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type doctor
* the doctor can add time slots only after accepting the employment contract and being accepted by the admin.

### POST /pharmacy/private/medicine/uploadMedImg
lets pharmacist upload an image for any medicine

**Body:**
*`name`: The name of the medicine for which the image is being uploaded
*`medicineImg`: The image file to be uploaded for the medicine

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type pharmacist

### GET /clinic/private/user/filterAppointments
lets user filter his/her appointments by date and status and responds with JSON containing the filtered and unfiltered appointments 

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type doctor or patient
* If the status and date are not selected it responds with all  the appointments of the user

### GET /clinic/private/user/upcomingCompletedAppointments
lets user view a list of all my upcoming / past appointments and responds with JSON containing them

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type doctor or patient

### GET /clinic/private/user/filterAppointmentsByStatus
ets user filter his/her appointments by status and responds with JSON containing the filtered and unfiltered appointments

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type doctor or patient

### POST /clinic/private/patient/rescheduleAppointment
lets user reschedule an appointment for himself

**Body:**
*`appointmentId`: ID of the appointment to be rescheduled
*`newDate`: the new date for the appointment
*`newStartTime`: the new start time for the appointment
*`newEndTime`: the new end time for the appointment

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type patient

### POST /clinic/private/patient/rescheduleAppointmentForFamily

### POST /clinic/private/patient/rescheduleAppointment
lets patient reschedule an appointment for a family member

**Body:**
*`appointmentId`: ID of the appointment to be rescheduled
*`newDate`: the new date for the appointment
*`newStartTime`: the new start time for the appointment
*`newEndTime`: the new end time for the appointment

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type patient

### POST /clinic/private/doctor/reschedulePatientAppointment
lets doctor reschedule an appointment for a patient

**Body:**
*`appointmentId`: ID of the appointment to be rescheduled
*`newDate`: the new date for the appointment
*`newStartTime`: the new start time for the appointment
*`newEndTime`: the new end time for the appointment

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type doctor

### POST /clinic/private/doctor/cancelPatientAppointment
lets doctor cancel an appointment for a patient

**Body:**
*`appointmentId`: ID of the appointment to be cancelled

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type doctor
* The money is refunded to wallet of the one who booked the appointment 

### POST /clinic/private/doctor/cancelPatientAppointment
lets doctor cancel an appointment for a patient

**Body:**
*`appointmentId`: ID of the appointment to be cancelled

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type doctor
* The money is refunded to wallet of the one who booked the appointment 

### POST /clinic/private/patient/cancelAppointmentForFamily
lets patient cancel an appointment for a family member

**Body:**
*`appointmentId`: ID of the appointment to be cancelled

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type patient
* The money is refunded to wallet of the one who booked the appointment if it is cancelled befor 24 hours of the appointment

### POST /clinic/private/patient/cancelAppointment
lets patient cancel an appointment

**Body:**
*`appointmentId`: ID of the appointment to be cancelled

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type patient
* The money is refunded to wallet of the one who booked the appointment if it is cancelled befor 24 hours of the appointment

### POST /clinic/private/patient/bookAppointmentForFamily
lets patient book an appointment for a family member 

**Body:**
*`docUsername`: username of the doctor
*`timeSlotStartTime`:time slot starts
*`patUsername`: username of the family member in case of created family members name

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type patient

### Doctor Contract

### GET /clinic/private/doctor/viewContract
It sends the data of the doctor and the TOS to the frontend so the doctor can decide to accept the contract 

**Body:**
* responds with doctor object containing all their relevant data(name,age,payrate,....etc)

**Query:**
* create user object from mongodb user schema
* searches for doctor using userId that is saved in the session
* add created family member in user family object in the created array 

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type patient

### PUT /clinic/private/doctor/acceptContract
Allows the doctor to accept the contract changing his status to 'accepted' in the system 

**Body:**
* using the session userId to fetch the user
* change user status to 'accepted' 

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type patient

### Doctor Follow-Up

### GET /clinic/private/doctor/selectFollowUpMenu
Allows the doctor to view possible follow-ups that he could schedule with their patients

**Body:**
* fetches doctor username and timeslots using their user ID from session
* then gets all completed appointments from this doctor (contains username of patients)
* fetching all patient names using their usernames from user model
* now we have all possible timeslots/appointments and patients to book future follow-up appointments(for the currently logged in doctor)
* in the result status the timeslots and the patients are sent as json

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type patient

### POST /clinic/private/doctor/scheduleFollowUp
Using the inputs from the doctor (patient name, timeslot) we can finally schedule a follow-up appointment

**Body:**
* using the input patient name we get the corresponding patient username
* using start time of timeslot the whole timeslot is fetched from logged in doctor(from session userId)
* new appointment is created using this data and saved
* timeslot that has been booked gets removed from doctor timeslots

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type patient


### GET /clinic/private/doctor/viewRequestedFollowUps
Allows the doctor to view the follow-ups that are requested by patients

**Body:**
* gets the doctor username from the session.
* then fetches appointments that have a pending status and are requested from the patient for the doctor.
* gets patient usernames corresponding to the pending appointments then fetches names from our user model using usernames.

**Notes:**
* Requires JWT as a cookie for authentication.
* User in the token must be of type doctor.

### POST /clinic/private/doctor/respondToRequestedFollowUps
This allows the doctor to finally accept/reject the follow-up appointment fetched from the previous endpoint.

**Body:**
* fetch appointment ID and (acceptance)status from the frontend JSON
* If status is 'accept' we update the appointment status to 'upcoming'
* If status is 'reject' we update the appointment status to 'cancelled'

**Notes:**
* Requires JWT as a cookie for authentication.
* User in the token must be of type doctor.


### Patient Searches/Filters/Booking

### GET /clinic/private/patient/viewDoctors
Retrieve a list of all doctors, including their specialties and session prices based on the subscribed health package (if any). The session price is calculated as follows: (doctor’s rate + 10% clinic's markup - discount based on the patient's health package).

**Notes:**
* Requires JWT as a cookie for authentication.
* User in the token must be of type doctor.

### POST /clinic/private/patient/searchDoctors
Search for doctors based on their name, specialty, and availability on a certain date and at a specific time.

**Body:**
* docname (optional): Doctor's name.
* speciality (optional): Doctor's specialty.
* date (optional): Date in ISO format for availability.

**Notes:**
* Requires JWT as a cookie for authentication.
* User in the token must be of type doctor.

### POST /clinic/private/patient/filterDoctors/:id
Select a doctor from the search/filter results to view all details, including specialty, affiliation (hospital), and educational background. Additionally, view all available appointments of the selected doctor.

**Body:**
* it has a parameter /:id which is the selected doctors ID

**Notes:**
* Requires JWT as a cookie for authentication.
* User in the token must be of type doctor.

### POST /clinic/private/patient/bookAppointment
Select an appointment date and time for yourself or a family member.

**Body:**
* doctorUsername: Username of the selected doctor.
* timeSlotStartTime: Start time of the selected time slot.
* patientUsername (optional): Username of the patient (if booking for a family member).

**Notes:**
* Requires JWT as a cookie for authentication.
* User in the token must be of type doctor.

### GET /clinic/private/patient/loadFollowUpPage
Retrieve a list of completed appointments for yourself and linked family members to request follow-up appointments.

**Notes:**
* Requires JWT as a cookie for authentication.
* User in the token must be of type doctor.

### GET /clinic/private/patient/PatientRequestFollowUp
using the data entered by the user to request a follow up for themselves or a family member

**Body:**
* getting the previous appointment using the previous appointment ID.
* apptDate: Date for the follow-up appointment.
* duration: Duration of the follow-up appointment in minutes.

**Notes:**
* Requires JWT as a cookie for authentication.
* User in the token must be of type doctor.

### GET /pharmacy/private/medicine/all
Responds with JSON containing all medcinies 

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type admin/Pharmacist


### POST /pharmacy/private/patient/cart/addtocart
**Query:**
* `medicineId` : Medicine ID
* `quantity`: quantity of medicine
**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type patient
* quantity must be less that the total quantity of the medicine
* patient must have prescription for prescription medicine


### Get /pharmacy/private/medicine/getmedstats
**Query:**
* `medicineId` : Medicine ID
**Notes:**
* Must send JWT as cookie for authentication

### DELETE /pharmacy/private/patient/cart/deletefromcart
**Query:**
* `medicineId` : Medicine ID
* `quantity`: quantity of medicine
**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type patient
* quantity must be less that the  quantity in the cart

### GET /pharmacy/private/patient/cart/viewcart`

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type patient

### PUT /pharmacy/private/patient/cart/editquantity
**Query:**
* `medicineId` : Medicine ID
* `quantity`: quantity of medicine
**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type patient
* total quantity must be less that the real quantity of medicine

### GET /pharmacy/private/medicine/getsalesreport
**Query:**
* `month` : a spacific month to see the sales
**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type ppharmacist/admin

### GET /pharmacy/private/medicine/filterbydate
**Query:**
* `Date` : a spacific Date to see the sales
**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type ppharmacist/admin
 
 ### GET /pharmacy/private/medicine/filterbymedicine
**Query:**
* `medname` : a spacific medicine name
**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type ppharmacist/admin

 ### GET /pharmacy/private/medicine/viewalternativemedicicne`
 
**Query:**
* `medicineID` : a spacific medicine id

**Notes:**
* Must send JWT as cookie for authentication

### GET /pharmacy/private/medicine/updateSalesReportName`

**Notes:**
* Must send JWT as cookie for authentication

### GET /main/private/user
Responds with JSON containing user object of currently logged in user.

**Note:**
* Must send JWT as cookie for authentication

### POST /clinic/private/doctor/api/viewHealthRecords
Lets doctors view their patients health records. 

*Body:*
*patientUsername: patient's username

*Notes:*
* Must send JWT as cookie for authentication
* User in token must be of type doctor

### POST /clinic/private/patient/healthPackage/subscribe
Lets patients subscribe to a health package.

*Body:*
*packageId: health package's id

*Notes:*
* Must send JWT as cookie for authentication
* User in token must be of type patient

### GET /clinic/private/patient/healthPackage/view
Lets patients view their health package subscription.

*Notes:*
* Must send JWT as cookie for authentication
* User in token must be of type patient

### POST /clinic/private/patient/healthPackage/renew
Lets patients renew their health package subscription.

*Notes:*
* Must send JWT as cookie for authentication
* User in token must be of type patient

### POST /clinic/private/patient/healthPackage/cancel
Lets patients cancel their health package subscription.

*Notes:*
* Must send JWT as cookie for authentication
* User in token must be of type patient

### GET /clinic/private/patient/healthRecord/
Lets patients view their health records.

*Notes:*
* Must send JWT as cookie for authentication
* User in token must be of type patient

### GET /pharmacy/private/pharmacist/medicine/find
Returns medicine matching search phrase along with their distinct categories.

*Params:*
* searchKey: phrase to search with

*Notes:*
* Must send JWT as cookie for authentication
* User in token must be of type pharmacist

### POST /pharmacy/private/pharmacist/medicine/add
Lets pharmacists add new medicine.

*Body:*
* name: medicine name
* details: medicine details
* activeIngredients: medicine active ingredients
* price: medicine price
* quantity: medicine quantity
* dosage: medicine dosage

*Notes:*
* Must send JWT as cookie for authentication
* User in token must be of type pharmacist

### POST /pharmacy/private/pharmacist/medicine/edit
Lets pharmacists edit new medicine.

*Body:*
* name: medicine name
* details: medicine details
* activeIngredients: medicine active ingredients
* price: medicine price
* quantity: medicine quantity
* dosage: medicine dosage

*Notes:*
* Must send JWT as cookie for authentication
* User in token must be of type pharmacist

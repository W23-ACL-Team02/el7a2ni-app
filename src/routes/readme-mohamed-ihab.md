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
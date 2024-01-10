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


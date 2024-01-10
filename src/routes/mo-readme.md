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


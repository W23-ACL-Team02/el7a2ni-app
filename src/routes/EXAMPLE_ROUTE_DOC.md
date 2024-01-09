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

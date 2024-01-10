_### GET /pharmacy/private/medicine/all
Responds with JSON containing all medcinies 

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type admin/Pharmacist


_### POST /pharmacy/private/patient/cart/addtocart
**Query:**
* `medicineId` : Medicine ID
* `quantity`: quantity of medicine
**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type patient
* quantity must be less that the total quantity of the medicine
* patient must have prescription for prescription medicine


_### Get /pharmacy/private/medicine/getmedstats
**Query:**
* `medicineId` : Medicine ID
**Notes:**
* Must send JWT as cookie for authentication

_### DELETE /pharmacy/private/patient/cart/deletefromcart
**Query:**
* `medicineId` : Medicine ID
* `quantity`: quantity of medicine
**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type patient
* quantity must be less that the  quantity in the cart

_### GET /pharmacy/private/patient/cart/viewcart`

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type patient

_### PUT /pharmacy/private/patient/cart/editquantity
**Query:**
* `medicineId` : Medicine ID
* `quantity`: quantity of medicine
**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type patient
* total quantity must be less that the real quantity of medicine

_### GET /pharmacy/private/medicine/getsalesreport
**Query:**
* `month` : a spacific month to see the sales
**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type ppharmacist/admin

_### GET /pharmacy/private/medicine/filterbydate
**Query:**
* `Date` : a spacific Date to see the sales
**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type ppharmacist/admin
 
 _### GET /pharmacy/private/medicine/filterbymedicine
**Query:**
* `medname` : a spacific medicine name
**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type ppharmacist/admin

 _### GET /pharmacy/private/medicine/viewalternativemedicicne`
**Query:**
* `medicineID` : a spacific medicine id
**Notes:**
* Must send JWT as cookie for authentication




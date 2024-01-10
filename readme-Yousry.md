### Family Members

### POST /clinic/private/family/addfamily
it posts the information of a created family member

**Body:**
* `familymembe`: object contains the information of the family member as {name,nationalID, age, gender, relationship}

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type patient

### Get /clinic/private/family/viewFamilyMember
it gets the family member and linked of family memeber 

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type patient

### Post /clinic/private/family/linkFamilyMemberz
it link family member account 

**Body:**
* `userId`: User ID of user to search for
* `email`: email of linked account
* or
* `phone number`: phone number of linked account

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type patient

### Prescriptions

### Get clinic/private/patient/prescription/viewprescription

it views prescription for the patient 

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type patient

### GET clinic/private/patient/prescription/selectedPrescription

it returns the selected prescription 

### post clinic/private/patient/prescription/updatePrescription

it pushes the updated prescription after edit by doctor

**Body:**
* `updated prescription`: updated prescription with the updated mediciations
**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type doctor

### post clinic/private/doctor/prescription/addPrescription

it pushes the added the prescription 

**Body:**
* `prescription`: added prescription by doctor

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type doctor


### Get clinic/private/doctor/prescription/selectedPresction

it gets prescription of 
**Body:**
* `prescriptionid`: presctionion ID of selected prescription

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type doctor

### Post clinic/public/user/verifyEmail
checks if we have this mail in a user
**Body:**
* `Email`: Email of user

### Post clinic/public/user/OTPVerfication
it check if the entered otp is correct
**Body:**
* `OTP`: otp send to email of user

### Post clinic/public/user/resetPassword
it changes the password of user
**Body:**
* `oldPassword`: old password of user
* `newpassword`: new password of user

### GET clinic/public/user/changepassword
check the old password and chnage the new password
**Body:**
* `oldPassword`: old password of user
* `newpassword`: new password of user



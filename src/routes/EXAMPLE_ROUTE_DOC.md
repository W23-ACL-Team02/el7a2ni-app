### GET /clinic/private/user/getSelfUser
Responds with the user document of the currently logged in user.

**Notes:**
* Must send JWT as cookie for authentication

_THIS IS AN EXAMPLE ENDPOINT THAT DOESN'T EXIST_
### POST /main/private/admin/user/{userId}/findFamily?familyId={familyId}&relationType={relationType}
Responds with JSON containing all family members of user with `_id: userId`.

**Body:**
* `userId`: User ID of user to search for

**Query:**
* `familyId (optional)`: User ID of a specific family member to fetch
* `relationType (optional)`: The type of relation between the user and their family member

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type admin

### Family Members

### POST /clinic/private/family/addfamily
it posts the information of a created family member

**Body:**
* familymember object contains the information of the family member as {name,nationalID, age, gender, relationship}

**Query:**
* create family memeber object from mongodb schema
* serches for user from userId that is saved in the session 
* add created family member in user family object in the created array 

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type patient

### Get /clinic/private/family/viewFamilyMember

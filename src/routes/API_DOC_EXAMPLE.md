_THIS IS AN EXAMPLE ENDPOINT THAT DOESN'T EXIST_
### POST /main/private/admin/user/findFamily?familyId={familyId}&relationType={relationType}
Responds with JSON containing all family members of user with `_id: userId`.

**Body:**
* `userId`: User ID of user to search for

**Query:**
* `familyId (optional)`: User ID of a specific family member to fetch
* `relationType (optional)`: The type of relation between the user and their family member

**Notes:**
* Must send JWT as cookie for authentication
* User in token must be of type admin

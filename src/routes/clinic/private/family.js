var express= require('express');
const { cancelSubscriptionForFamilyMember, subscribeForFamilyMember } = require('../../../controllers-clinic/patientController.js');
const { getFamilyIDs, linkFamilyMember, viewFamilyMember, createFamilyMember } = require('../../../controllers-clinic/familyController.js');
var router = express.Router({mergeParams: true}); 

router.get(`/`, getFamilyIDs)
router.post(`/cancel`, cancelSubscriptionForFamilyMember)
router.post(`/subscribe`, subscribeForFamilyMember)

router.post('/addFamily', createFamilyMember);
router.get('/viewfamilymember', viewFamilyMember);
router.post ('/linkFamilyMember', linkFamilyMember);

// router.get('viewLinkedFamilyMember',async(req,res)=> {
//   const userId=req.session.userId;
//   try {
//   let user = await userModel.findOne({username:userId});
//   const linkedFamilyMembers = user.linkedFamilyMembers;
//   res.status(200).json({linkedFamilyMembers})
//   } catch(error) {
//       res.status(400).json({err:error.message})
//   }
// })

module.exports = router;
var express = require('express');
const { viewContract, acceptContract, rejectContract, selectFollowUpMenu,scheduleFollowUp, addHealthRecords } = require('../../controllers/doctorCont');
const authorizeUser = require('../../middleware/authorizeUser');
var router = express.Router({mergeParams: true});

router.all("*", (req, res, next) => {
    // Ensure doctor
    if (!authorizeUser(req, res, ["doctor"])) return;

    next();
})

router.get("/viewContract", viewContract);
router.put("/acceptContract", acceptContract);
router.put("/rejectContract", rejectContract);
router.get("/selectFollowUpMenu", selectFollowUpMenu)
router.post("/scheduleFollowUp", scheduleFollowUp)
router.post("/addHealthRecords", addHealthRecords)

module.exports = router;
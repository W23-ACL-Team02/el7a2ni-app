var express = require('express');
var router = express.Router();
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { addMedicine, editMedicine, removeMedicine, findMedicine, findMedicine2, getMedStats, viewMedicine, findByIngredient, getAllMedicine, renderAllMedicine, uploadMedImage,getAllUnarchivedMedicine, getsalesreport,filterbydate,filtersbymedicine,updateSalesReportName,viewalternativemedicicne} = require(`../../../controllers-pharmacy/medicineController.js`)


router.post('/add', addMedicine);
router.put('/edit', editMedicine)
router.delete('/remove', removeMedicine);

router.get('/find', findMedicine); // TODO: Remove this / modify this endpoint?
router.get('/findmedicine', findMedicine2); // TODO: Remove this / modify this endpoint?
router.get('/getmedstats', getMedStats); // TODO: Remove this / modify this endpoint?  &  Move to Pharmacist router?
router.post('/view', viewMedicine); // TODO: Remove this / modify this endpoint?

router.get('/findByIngredient', findByIngredient);
router.get('/all', getAllMedicine);
router.get('/allunarchived',getAllUnarchivedMedicine);

router.get('/', renderAllMedicine); // TODO: Remove this / modify this endpoint?
router.get('/getsalesreport',getsalesreport);
router.get('/filterbydate',filterbydate);
router.get('/filterbymedicine',filtersbymedicine);
router.post('/updateSalesReportName',updateSalesReportName);
router.get('/viewalternativemedicicne',viewalternativemedicicne);
router.post('/uploadMedImg', upload.fields([{ name: 'medicineImg', maxCount: 1 }]), uploadMedImage) // TODO: Move to Pharmacist Router?

module.exports = router;
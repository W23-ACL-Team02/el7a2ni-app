var express = require('express');
var router = express.Router();
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { addMedicine, editMedicine, deleteMedicine, findMedicine, findMedicine2, getMedStats, viewMedicine, findByIngredient, getAllMedicine, renderAllMedicine, uploadMedImage} = require(`../../controllers/medicineController.js`)

router.post('/add', addMedicine);
router.put('/edit', editMedicine)
router.delete('/delete', deleteMedicine);

router.get('/find', findMedicine); // TODO: Remove this / modify this endpoint?
router.get('/findmedicine', findMedicine2); // TODO: Remove this / modify this endpoint?
router.get('/getmedstats', getMedStats); // TODO: Remove this / modify this endpoint?  &  Move to Pharmacist router?
router.get('/view', viewMedicine); // TODO: Remove this / modify this endpoint?

router.get('/findByIngredient', findByIngredient);
router.get('/all', getAllMedicine);

router.get('/', renderAllMedicine); // TODO: Remove this / modify this endpoint?

router.post('/uploadMedImg', upload.fields([{ name: 'medicineImg', maxCount: 1 }]), uploadMedImage) // TODO: Move to Pharmacist Router?

module.exports = router;
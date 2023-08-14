const router = require('express').Router()
const auth = require('../middleware/auth')
const labCtrl = require('../controllers/labCtrl')

router.route('/')
.post(auth, labCtrl.createLabClass)

router.route("/:date")
.get(auth, labCtrl.getLabClassess)

router.route("/:id")
.delete(labCtrl.deleteLabClass)
// .post(labCtrl.updateLab)

router.route("/summary/:startdate/:enddate")
.get(auth,labCtrl.getLabsBetweenDates);

module.exports = router
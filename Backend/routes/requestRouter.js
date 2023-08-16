const router = require('express').Router()
const auth = require('../middleware/auth')
const requestCtrl = require('../controllers/requestCtrl')
const labCtrl = require('../controllers/labCtrl')

/**
 * 
 * Get requests that are pending from Lab
 * Get "" pending from HOD
 * Get req by date (pend. or appr.)
 * 
 * Create a req.
 * Approval/Denial from HOD(?state=1 or 2)
 * "" "" Lab (same)
 * Modify a request
 * Delete request
 * 
 */

router.route('/')
    .post(requestCtrl.createRequest)

router.route('/hod')
    .get(requestCtrl.getHODPending)

router.route('/hodpending/:id/:status')
    .post(requestCtrl.approveOrDenyHOD)
    // .put(requestCtrl.denyHOD)

router.route('/lab')
    .get(requestCtrl.getlabPending)

    router.route('/summary/:startdate/:enddate')
    .get(requestCtrl.getReqsBetweenDates)

    router.route('/check/:date/:venue/:starttime/:endtime')
    .get(requestCtrl.getAvailability);

    router.route('/checkhod/:date/:venue/:starttime/:endtime/:id')
    .get(requestCtrl.getAvailabilityHOD);
router.route('/lab/:id/:status/:userId')
    .post(requestCtrl.approveOrDenyLab)
    // .put(requestCtrl.denylab)

router.route("/get/:date")
    .get(requestCtrl.getRequests)

router.route('/:id')
    .post(requestCtrl.updateRequest)
    .delete(requestCtrl.deleteRequest)

    router.route('/search/:query')
    .get(requestCtrl.searchRequests)


module.exports = router
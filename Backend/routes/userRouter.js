const router = require('express').Router()
const userCtrl = require('../controllers/userCtrl')
const auth = require('../middleware/auth')

// Register User
router.post('/register', userCtrl.registerUser)
// Login User
router.post('/login', userCtrl.loginUser)
// verify Token
router.get('/verify', auth,userCtrl.verifiedToken)
//update profile
router.post('/update',auth,userCtrl.updateProfile)
//changepassword
router.post('/changepassword',auth,userCtrl.changePassword)
router.delete('/delete/:email',userCtrl.deleteProfile)

router.get('/getUser',userCtrl.verifyUser)
module.exports = router 
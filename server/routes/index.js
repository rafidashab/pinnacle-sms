const Router = require('express')
const router = Router();
const smsController = require('../controllers/sms')

router.post('/submit', smsController.submit);
router.get('/', smsController.test);

module.exports = router;

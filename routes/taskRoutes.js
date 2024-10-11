const express = require('express');
const { AssignedTask, ConfirmedByUser, CompleteByUser, TotalTasksDetail, GetAllUser, UserTasks, AdminViewTasks, PaidByAdmin, TotalTasksPayment} = require('../controllers/taskController');
const router = express.Router();
// const isAdmin = require('../middleware/admin');
const validateToken = require('../middleware/validateTokenHandler');


router.post( '/assign' , AssignedTask );
router.get( '/allusers/data' , GetAllUser );
router.get('/getTask/all', validateToken, UserTasks);
router.get('/getTask/all/users', validateToken, AdminViewTasks);
router.get('/payment-status', validateToken, TotalTasksPayment);
router.get('/totalTaskDetail', validateToken, TotalTasksDetail);
router.put( '/confirm/:taskId' , validateToken, ConfirmedByUser );
router.put( '/complete/:taskId' , validateToken, CompleteByUser );
router.put( '/confirm/payment/:taskId' , validateToken, PaidByAdmin );

module.exports = router;
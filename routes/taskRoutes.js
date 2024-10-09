const express = require('express');
const { AssignedTask, ConfirmedByUser, TaskById, GetAllUser, UserTasks} = require('../controllers/taskController');
const router = express.Router();
// const isAdmin = require('../middleware/admin');
// const validateToken = require('../middleware/validateTokenHandler');


router.post( '/assign' , AssignedTask );
router.get( '/:taskId' , TaskById  );
router.get( '/allusers/data' , GetAllUser );
router.get('/getTask', UserTasks)
router.put( '/:taskId/confirm' , ConfirmedByUser );

module.exports = router;
const express = require('express');
const { AssignedTask, ConfirmedByUser, TaskById} = require('../controllers/taskController');
const router = express.Router();
// const isAdmin = require('../middleware/admin');
// const validateToken = require('../middleware/validateTokenHandler');


router.post( '/assign' , AssignedTask );
router.get( '/:taskId' , TaskById  );
router.put( '/:taskId/confirm' , ConfirmedByUser );

module.exports = router;
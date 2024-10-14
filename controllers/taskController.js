const asyncHandler = require('express-async-handler');
const Task = require('../models/taskModel');
const User = require('../models/userModel');



//================================= TASK CONTROLLER ======================================

//------------------------------- Admin POST API TASKS -----------------------------------

//@des POST all tasks
//@routes POST api/task
//@access private


const AssignedTask = asyncHandler( async (req,res)=>{
  try {
    const { assignedTo, hourlyRate, description} = req.body;
    const task = new Task({
        assignedTo,
        hourlyRate,
        description,
    });
    // console.log('taskkk============',task);
    await task.save();
    res.status(201).json({message : 'Task assigned successfully', task});
  } catch (error) {
    res.status(500).json({error : 'Failed to assigned task'});
  };

});



//------------------------------- Admin GET User API TASKS -----------------------------------

//@des GET all users
//@routes GET api/task
//@access private


const GetAllUser = asyncHandler( async(req, res)=>{
  try {
    const users = await User.find();

    if (!users) {
        return res.status(404).json({error : ' user not find'});
    };

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({message : 'Server Error'})
    // console.log('error---------',error);
  }

})




//------------------------------- Admin GET API TASKS -----------------------------------

//@des GET all assign tasks
//@routes GET api/task
//@access private


const AdminViewTasks = asyncHandler(async(req, res)=>{

  try {
    
    const userTask = await Task.find({});

    if (!userTask || userTask.length === 0) {
      return res.status(404).json({message : ' User task is not found '});
    };
    // console.log('user tasks=========', userTask);

    res.status(200).json({userTask});
  } catch (error) {
    res.status(500).json({ error : 'Server error'});
    // console.log('Server Error====',error);
  };
});






//------------------------------- Admin PUT API TASKS -----------------------------------

//@des PUT all task confirmation
//@routes PUT api/task
//@access private


const PaidByAdmin = asyncHandler(async (req, res) => {
  try {
          // console.log('task id==========',req.params.taskId);
          const task = await Task.findOne({ _id: req.params.taskId});
          // console.log('task id==========',task);

      if (!task) {
          return res.status(404).json({ error: 'Task not found' });
      }

      task.paidByAdmin = true;
      task.paymentStatus = 'paid';
      task.amountPaid = task.hourlyRate;
      task.paidAt = new Date();


      await task.save();

      res.status(200).json(task);

  } catch (error) {
      // console.error('Error confirming task:', error); 
      res.status(500).json({ error: 'Failed to confirm payment' });
  }
});







//------------------------------- Admin GET API TASKS -----------------------------------

//@des GET all task payment Details
//@routes GET api/task
//@access private


const TotalTasksPayment =  asyncHandler( async(req, res )=>{
  try {
    const task = await Task.find({});

    if (!task) {
      return res.status(404).json({error : 'Failed to find the task'});
    };

    const TotalAmount = task.reduce((sum,task)=> sum + task.hourlyRate +  task.amountPaid, 0);
    const TotalAmountPaid = task.filter(task=> task.paymentStatus === 'paid').reduce((sum,task)=> sum + (task.amountPaid || task.hourlyRate), 0);
    const TotalAmountUnpaid = task.filter(task=> task.paymentStatus === 'unpaid').reduce((sum,task)=> sum + task.hourlyRate, 0);
    res.status(200).json({task, TotalAmount, TotalAmountPaid, TotalAmountUnpaid});
  } catch (error) {
    console.log('Server Error',error);
    res.status(500).json({error : 'Server Error'});
  }
  });



//------------------------------- Admin GET API TASKS -----------------------------------

//@des GET all task Details
//@routes GET api/task
//@access private


const TotalTasksDetail =  asyncHandler( async(req, res )=>{
  try {
    const task = await Task.find({});

    if (!task) {
      return res.status(404).json({error : 'Failed to find the task'});
    };

    const TotalTasks = task.length;
    const TotalPendingTasks = task.filter(task=> task.status === 'pending').length;
    const TotalAssignedTasks = task.filter(task=> task.status === 'assigned').length;
    const TotalCompletedTasks = task.filter(task=> task.status === 'complete').length;
    res.status(200).json({task, TotalTasks, TotalPendingTasks, TotalCompletedTasks, TotalAssignedTasks});
  } catch (error) {
    console.log('Server Error',error);
    res.status(500).json({error : 'Server Error'});
  }
  });






//------------------------------- User GET API TASKS -----------------------------------

//@des GET all tasks
//@routes GET api/task
//@access private


const UserTasks = asyncHandler(async(req, res)=>{

  try {
    const userId =  req.user.id;
    // console.log('user=========',req.user)
    // console.log('userID=========',req.user.id);
    const userTask = await Task.find({ assignedTo: userId }).populate( 'assignedTo');

    if (!userTask || userTask.length === 0) {
      return res.status(404).json({message : ' User task is not found '});
    };
    // console.log('user tasks=========', userTask);

    res.status(200).json({userTask});
  } catch (error) {
    res.status(500).json({ error : 'Server error'});
    // console.log('Server Error====',error);
  };
});



//------------------------------- User PUT API TASKS -----------------------------------

//@des PUT all task confirmation
//@routes PUT api/task
//@access private


const ConfirmedByUser = asyncHandler(async (req, res) => {
  try {

      const task = await Task.findOne({ _id: req.params.taskId, assignedTo: req.user.id });

      if (!task) {
          return res.status(404).json({ error: 'Task not found' });
      }

      task.completionConfirmedByUser = true;
      task.status = 'pending';
      task.starttime = new Date()


      await task.save();

      res.status(200).json(task);

  } catch (error) {
      // console.error('Error confirming task:', error); 
      res.status(500).json({ error: 'Failed to confirm task' });
  }
});




//------------------------------- User PUT API TASKS -----------------------------------

//@des PUT all task completion
//@routes PUT api/task
//@access private


const CompleteByUser = asyncHandler(async (req, res) => {
  try {

      const task = await Task.findOne({ _id: req.params.taskId, assignedTo: req.user.id });

      if (!task) {
          return res.status(404).json({ error: 'Task not found' });
      }

      if (task.status !== 'pending') {
        return res.status(400).json({ message: "Task cannot be completed" });
      }

      task.endTime = new Date();
      task.completeAt = task.endTime;
      task.completeByUser = true;
      task.status = 'complete';

      if (task.startTime && task.endTime) {
        const hoursWorked = Math.abs(task.endTime - task.startTime) / 36e5;
        task.totalHours = hoursWorked;
      } else {
        task.totalHours = 0;
      }

      task.amountPaid = task.totalHours * task.hourlyRate;


      await task.save();

      res.status(200).json({task});

  } catch (error) {
      console.error('Error complete task:', error);
      res.status(500).json({ error: 'Failed to complete task' });
  }
});


module.exports = {AssignedTask, ConfirmedByUser, CompleteByUser, TotalTasksDetail, GetAllUser, UserTasks, AdminViewTasks, PaidByAdmin, TotalTasksPayment};
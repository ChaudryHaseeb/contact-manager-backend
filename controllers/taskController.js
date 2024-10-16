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
    const user = await User.find();

    if (!user) {
        return res.status(404).json({error : ' user not find'});
    };

    const users = user.filter(User=> User.role !== 'admin');

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({message : 'Server Error'})
  }

});




//------------------------------- Admin GET API TASKS -----------------------------------

//@des GET all assign tasks
//@routes GET api/task
//@access private


const AdminViewTasks = asyncHandler(async(req, res)=>{

  try {

    const UserTask = await Task.find({});

    if (!UserTask || UserTask.length === 0) {
      return res.status(404).json({message : ' User task is not found '});
    };
    const userTask = UserTask.filter(task=> task.paymentStatus !== 'paid');

    res.status(200).json({userTask});
  } catch (error) {
    res.status(500).json({ error : 'Server error'});
  };
});






//------------------------------- Admin PUT API TASKS -----------------------------------

//@des PUT all task confirmation
//@routes PUT api/task
//@access private


const PaidByAdmin = asyncHandler(async (req, res) => {
  try {
          const task = await Task.findOne({ _id: req.params.taskId});

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
      res.status(500).json({ error: 'Failed to confirm payment' });
  }
});







//------------------------------- Admin GET API TASKS -----------------------------------

//@des GET all task payment Details
//@routes GET api/task
//@access private


const TotalTasksPayment =  asyncHandler( async(req, res )=>{

if (req.user.role === 'admin') {

  try {

    const task = await Task.find({});

    if (!task) {
      return res.status(404).json({error : 'Failed to find the task'});
    };

    const TotalAmount = task.filter(task=> task.status === 'complete').reduce((sum,task)=> sum + task.hourlyRate, 0);
    const TotalAmountPaid = task.filter(task=> task.paymentStatus === 'paid').reduce((sum,task)=> sum + (task.amountPaid || task.hourlyRate), 0);
    const TotalAmountUnpaid = task.filter(task=>task.status === 'complete' && task.paymentStatus === 'unpaid').reduce((sum,task)=> sum + task.hourlyRate, 0);
    res.status(200).json({task, TotalAmount, TotalAmountPaid, TotalAmountUnpaid});

  } catch (error) {
    res.status(500).json({error : 'Server Error'});
  }
} else {

  try {
    const task = await Task.find({ assignedTo: req.user.id});

    if (!task) {
      return res.status(404).json({error : 'Failed to find the task'});
    };

    const TotalAmount = task.filter(task=> task.status === 'complete').reduce((sum,task)=> sum + task.hourlyRate, 0);
    const TotalAmountPaid = task.filter(task=> task.paymentStatus === 'paid').reduce((sum,task)=> sum + (task.amountPaid || task.hourlyRate), 0);
    const TotalAmountUnpaid = task.filter(task=>task.status !== 'pending' && task.status !== 'assigned' &&   task.paymentStatus === 'unpaid').reduce((sum,task)=> sum + task.hourlyRate, 0);
    res.status(200).json({task, TotalAmount, TotalAmountPaid, TotalAmountUnpaid});

  } catch (error) {
    res.status(500).json({error : 'Server Error'});
  }
}
});




//------------------------------- Admin GET API TASKS -----------------------------------

//@des GET all task Details
//@routes GET api/task
//@access private


const TotalTasksDetail =  asyncHandler( async(req, res )=>{
if (req.user.role === 'admin') {
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
    res.status(500).json({error : 'Server Error'});
  }
} else {
  try {
    const task = await Task.find({assignedTo : req.user.id});

    if (!task) {
      return res.status(404).json({error : 'Failed to find the task'});
    };

    const TotalTasks = task.length;
    const TotalPendingTasks = task.filter(task=> task.status === 'pending').length;
    const TotalAssignedTasks = task.filter(task=> task.status === 'assigned').length;
    const TotalCompletedTasks = task.filter(task=> task.status === 'complete').length;
    res.status(200).json({task, TotalTasks, TotalPendingTasks, TotalCompletedTasks, TotalAssignedTasks});
  } catch (error) {
    res.status(500).json({error : 'Server Error'});
  }
}

});






//------------------------------- User GET API TASKS -----------------------------------

//@des GET all tasks
//@routes GET api/task
//@access private


const UserTasks = asyncHandler(async(req, res)=>{

  try {
    const userId =  req.user.id;
    const UserTask = await Task.find({ assignedTo: userId }).populate( 'assignedTo');

    if (!UserTask || UserTask.length === 0) {
      return res.status(404).json({message : ' User task is not found '});
    };
    const userTask = UserTask.filter(task => task.status !== 'complete');

    res.status(200).json({userTask});
  } catch (error) {
    res.status(500).json({ error : 'Server error'});
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
      res.status(500).json({ error: 'Failed to complete task' });
  }
});


module.exports = {AssignedTask, ConfirmedByUser, CompleteByUser, TotalTasksDetail, GetAllUser, UserTasks, AdminViewTasks, PaidByAdmin, TotalTasksPayment};
const asyncHandler = require('express-async-handler');
const Task = require('../models/taskModel');
const User = require('../models/userModel');


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








const UserTasks = asyncHandler(async(req, res)=>{

  try {
    const userTask = await Task.find({});

    if (!userTask) {
      return res.status(404).json({message : ' User task is not found '});
    };
    console.log('user tasks=========', userTask);

    res.status(200).json({userTask});
  } catch (error) {
    res.status(500).json({ error : 'Server error'});
    console.log('Server Error====',error);
  };
});









const TaskById = asyncHandler(async(req,res)=>{
   try {
    // console.log("Request params:", req.params);
    const { taskId } = req.params;
    const task = await Task.find({assignedTo : taskId});
    if (!task) {
       return res.status(404).json({error :"task not found"});
    };
    res.send(task);
   } catch (error) {
       res.status(500).json({error: 'failed to get task or server error'});
    //    console.log(error);
   }
})


const ConfirmedByUser = asyncHandler( async(req,res)=>{
    try {
        const task = await Task.findOne({ assignedTo : req.params.taskId });
        // const task = await Task.findOne({ _id: req.params.taskId, assignedTo: req.user.id });

        if (!task) {
            res.status(404).json({error : 'Task not found'});
        };
        // console.error('task-------------', task);
        task.completionConfirmedByUser = true;
        task.status = "confirm";
        await task.save();
        // console.error('task-------------', task);

        res.status(200).json(task);

        
    } catch (error) {
        res.status(500).json({error: ' Failed to confirmed task'})
    };
});


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
module.exports = {AssignedTask, TaskById, ConfirmedByUser, GetAllUser, UserTasks};
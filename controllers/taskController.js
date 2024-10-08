const asyncHandler = require('express-async-handler');
const Task = require('../models/taskModel');


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



const TaskById = asyncHandler(async(req,res)=>{
   try {
    console.log("Request params:", req.params);
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
        res.status(404).json({error :"task not found"});
    };
    res.send(task);
   } catch (error) {
       res.status(500).json({error: 'failed to get task or server error'});
       console.log(error);
   }
})


const ConfirmedByUser = asyncHandler( async(req,res)=>{
    try {
        const task = await Task.findById(req.params.taskId);
        if (!task) {
            res.status(404).json({error : 'Task not found'});
        };
        task.completionConfirmedByUser = true;
        task.status = true;
        await task.save();

        res.status(200).json({ message : ' Task confirmed by user'});

        
    } catch (error) {
        res.status(500).json({error: ' Failed to confirmed task'})
    };
});
module.exports = {AssignedTask, TaskById, ConfirmedByUser};
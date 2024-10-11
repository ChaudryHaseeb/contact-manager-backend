const getTasksWithPaymentStatus = asyncHandler(async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user._id }).populate('assignedTo');
        
        // Calculate the total paid amount
        const totalPaid = tasks
            .filter(task => task.paymentStatus === 'paid')
            .reduce((sum, task) => sum + task.amountPaid, 0);

        res.status(200).json({ tasks, totalPaid });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

router.get('/tasks/payment-status', validateToken, getTasksWithPaymentStatus);




const markTaskAsPaid = asyncHandler(async (req, res) => {
    try {
        const { taskId, amount } = req.body;

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        task.paymentStatus = 'paid';
        task.amountPaid = amount;
        task.paidAt = new Date();

        await task.save();

        res.status(200).json({ message: 'Task payment updated successfully', task });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update payment status' });
    }
});

router.put('/tasks/mark-paid', validateToken, markTaskAsPaid);  // Only accessible by admin



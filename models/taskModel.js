const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema(
    {
        assignedTo: {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true,
        },
        description: {
            type : String,
            required : true,
        },
        hourlyRate: {
            type : Number,
            required : true,
        },
        status: {
            type :  String,
            enum : [ 'assigned' , 'confirm' ],
            default : 'assigned',
        },
        completionConfirmedByUser: {
            type : Boolean,
            default : false,
        },
    },
    {
        timestamps : true,
    },
);
module.exports = mongoose.model('Task', taskSchema);
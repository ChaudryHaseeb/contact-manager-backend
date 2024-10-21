const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    hourlyRate: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["assigned", "pending", "complete"],
      default: "assigned",
    },
    completionConfirmedByUser: {
      type: Boolean,
      default: false,
    },
    completeByUser: {
      type: Boolean,
      default: false,
    },
    completeAt: {
      type: Date,
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
    paidByAdmin : {
        type : Boolean,
        default : false,
    },
    amountPaid: {
      type: Number,
      default: 0,
      min: 0
    },
    paidAt: {
      type: Date,
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    totalHours: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("Task", taskSchema);

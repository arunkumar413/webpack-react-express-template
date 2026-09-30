const mongoose = require("mongoose");

const taskStatuses = ["Pending", "Done", "In progress"];

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: taskStatuses,
      default: "Pending",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

todoSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    ret.id = ret._id.toString();
    ret.user_id = ret.user;
    delete ret._id;
    delete ret.__v;
    delete ret.user;
    return ret;
  },
});

module.exports = mongoose.model("Todo", todoSchema);

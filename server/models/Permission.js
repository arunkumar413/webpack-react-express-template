const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema(
  {
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resource",
      required: true,
    },
    read: {
      type: Boolean,
      required: true,
      default: false,
    },
    write: {
      type: Boolean,
      required: true,
      default: false,
    },
    update: {
      type: Boolean,
      required: true,
      default: false,
    },
    delete: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

permissionSchema.index({ role: 1, resource: 1 }, { unique: true });

module.exports = mongoose.model("Permission", permissionSchema);

const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
    index: true
  },

  name: {
    type: String,
    required: true
  },

  description: String,

  permissions: [{
    type: String // e.g., "employee.read", "employee.update"
  }],

  isSystem: {
    type: Boolean,
    default: false // for default roles like "Admin"
  }
}, { timestamps: true });

// Prevent duplicate role names per tenant
roleSchema.index({ tenantId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Role", roleSchema);
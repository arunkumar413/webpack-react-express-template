const bcrypt = require("bcrypt");
const Organization = require("../models/Organization");
const Role = require("../models/Role");
const Employee = require("../models/Employee");
const RoleAssignment = require("../models/RoleAssignment");
const { ADMIN_PERMISSIONS } = require("../constants");
const { slugify } = require("./authSession");

async function provisionOrganization({ name, slug, plan, allowSlugCollision = true }) {
  const orgName = String(name || "").trim();
  if (!orgName) {
    const err = new Error("Organization name is required");
    err.status = 400;
    throw err;
  }

  let orgSlug = slugify(slug || orgName);
  const existing = await Organization.findOne({ slug: orgSlug });
  if (existing) {
    if (!allowSlugCollision) {
      const err = new Error("Organization slug already exists");
      err.status = 400;
      throw err;
    }
    orgSlug = `${orgSlug}-${Date.now().toString(36)}`;
  }

  const organization = await Organization.create({
    name: orgName,
    slug: orgSlug,
    plan: plan || "free",
  });

  const adminRole = await Role.create({
    tenantId: organization._id,
    name: "Admin",
    description: "Organization administrator",
    permissions: ADMIN_PERMISSIONS,
    isSystem: true,
  });

  return { organization, adminRole };
}

async function createOrgAdmin({ organization, adminRole, username, email, password }) {
  if (!username || !email || !password) {
    const err = new Error("Admin username, email, and password are required");
    err.status = 400;
    throw err;
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const employee = await Employee.create({
    tenantId: organization._id,
    name: username,
    username,
    email,
    password: hash,
    roleIds: [adminRole._id],
  });

  await RoleAssignment.create({
    tenantId: organization._id,
    employeeId: employee._id,
    roleId: adminRole._id,
    scope: { type: "global" },
  });

  return employee;
}

module.exports = {
  provisionOrganization,
  createOrgAdmin,
};

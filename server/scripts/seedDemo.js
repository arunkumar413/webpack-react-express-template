const bcrypt = require("bcrypt");
const { connectDB } = require("../DBConfig");
const Organization = require("../models/Organization");
const Department = require("../models/Department");
const Employee = require("../models/Employee");
const Role = require("../models/Role");
const RoleAssignment = require("../models/RoleAssignment");
const { ADMIN_PERMISSIONS } = require("../constants");

const DEMO_SLUG = "acme";
const DEMO_PASSWORD = "demo123";

const MANAGER_PERMISSIONS = [
  "employee.read",
  "task.read",
  "task.write",
  "task.update",
  "department.read",
];

const EMPLOYEE_PERMISSIONS = [
  "employee.read",
  "task.read",
  "task.write",
];

const HR_PERMISSIONS = [
  "employee.read",
  "employee.write",
  "employee.update",
  "department.read",
  "task.read",
];

async function clearDemoOrg() {
  const existing = await Organization.findOne({ slug: DEMO_SLUG });
  if (!existing) {
    return;
  }

  const tenantId = existing._id;
  await RoleAssignment.deleteMany({ tenantId });
  await Employee.deleteMany({ tenantId });
  await Department.deleteMany({ tenantId });
  await Role.deleteMany({ tenantId });
  await Organization.deleteOne({ _id: tenantId });
}

async function hashPassword() {
  return bcrypt.hash(DEMO_PASSWORD, 10);
}

async function assignRole(tenantId, employee, role) {
  employee.roleIds = [role._id];
  await employee.save();
  await RoleAssignment.create({
    tenantId,
    employeeId: employee._id,
    roleId: role._id,
    scope: { type: "global" },
  });
}

async function seed() {
  await connectDB();
  await clearDemoOrg();

  const password = await hashPassword();
  const organization = await Organization.create({
    name: "Acme Corp",
    slug: DEMO_SLUG,
    plan: "business",
  });
  const tenantId = organization._id;

  const [adminRole, managerRole, employeeRole, hrRole] = await Role.create([
    {
      tenantId,
      name: "Admin",
      description: "Organization administrator",
      permissions: ADMIN_PERMISSIONS,
      isSystem: true,
    },
    {
      tenantId,
      name: "Manager",
      description: "Department or team manager",
      permissions: MANAGER_PERMISSIONS,
    },
    {
      tenantId,
      name: "Employee",
      description: "Standard team member",
      permissions: EMPLOYEE_PERMISSIONS,
    },
    {
      tenantId,
      name: "HR",
      description: "People operations",
      permissions: HR_PERMISSIONS,
    },
  ]);

  const engineering = await Department.create({
    tenantId,
    name: "Engineering",
  });
  const product = await Department.create({
    tenantId,
    name: "Product",
  });
  const people = await Department.create({
    tenantId,
    name: "People",
  });
  const backend = await Department.create({
    tenantId,
    name: "Backend",
    parentId: engineering._id,
  });
  const frontend = await Department.create({
    tenantId,
    name: "Frontend",
    parentId: engineering._id,
  });
  const qa = await Department.create({
    tenantId,
    name: "QA",
    parentId: engineering._id,
  });

  const ava = await Employee.create({
    tenantId,
    name: "Ava Chen",
    username: "ava.chen",
    email: "ava.chen@acme.example",
    designation: "Chief Executive Officer",
    phone: "+1-555-0100",
    password,
  });
  await assignRole(tenantId, ava, adminRole);

  const marcus = await Employee.create({
    tenantId,
    name: "Marcus Webb",
    username: "marcus.webb",
    email: "marcus.webb@acme.example",
    designation: "VP Engineering",
    phone: "+1-555-0101",
    password,
    departmentId: engineering._id,
    managerId: ava._id,
  });
  await assignRole(tenantId, marcus, managerRole);

  const priya = await Employee.create({
    tenantId,
    name: "Priya Shah",
    username: "priya.shah",
    email: "priya.shah@acme.example",
    designation: "Engineering Manager",
    phone: "+1-555-0102",
    password,
    departmentId: backend._id,
    managerId: marcus._id,
  });
  await assignRole(tenantId, priya, managerRole);

  const liam = await Employee.create({
    tenantId,
    name: "Liam Ortiz",
    username: "liam.ortiz",
    email: "liam.ortiz@acme.example",
    designation: "Backend Engineer",
    phone: "+1-555-0103",
    password,
    departmentId: backend._id,
    managerId: priya._id,
  });
  await assignRole(tenantId, liam, employeeRole);

  const sofia = await Employee.create({
    tenantId,
    name: "Sofia Berg",
    username: "sofia.berg",
    email: "sofia.berg@acme.example",
    designation: "Frontend Lead",
    phone: "+1-555-0104",
    password,
    departmentId: frontend._id,
    managerId: marcus._id,
  });
  await assignRole(tenantId, sofia, managerRole);

  const noah = await Employee.create({
    tenantId,
    name: "Noah Kim",
    username: "noah.kim",
    email: "noah.kim@acme.example",
    designation: "Frontend Engineer",
    phone: "+1-555-0105",
    password,
    departmentId: frontend._id,
    managerId: sofia._id,
  });
  await assignRole(tenantId, noah, employeeRole);

  const elena = await Employee.create({
    tenantId,
    name: "Elena Rossi",
    username: "elena.rossi",
    email: "elena.rossi@acme.example",
    designation: "QA Engineer",
    phone: "+1-555-0106",
    password,
    departmentId: qa._id,
    managerId: marcus._id,
  });
  await assignRole(tenantId, elena, employeeRole);

  const jordan = await Employee.create({
    tenantId,
    name: "Jordan Hale",
    username: "jordan.hale",
    email: "jordan.hale@acme.example",
    designation: "Product Manager",
    phone: "+1-555-0107",
    password,
    departmentId: product._id,
    managerId: ava._id,
  });
  await assignRole(tenantId, jordan, managerRole);

  const sam = await Employee.create({
    tenantId,
    name: "Sam Okonkwo",
    username: "sam.okonkwo",
    email: "sam.okonkwo@acme.example",
    designation: "People Operations Lead",
    phone: "+1-555-0108",
    password,
    departmentId: people._id,
    managerId: ava._id,
  });
  await assignRole(tenantId, sam, hrRole);

  console.log("Demo organization seeded.");
  console.log("");
  console.log("Organization: Acme Corp");
  console.log("Slug:         acme");
  console.log("");
  console.log("Departments:");
  console.log("  Engineering");
  console.log("    Backend");
  console.log("    Frontend");
  console.log("    QA");
  console.log("  Product");
  console.log("  People");
  console.log("");
  console.log("Login (password for all: demo123)");
  console.log("  Admin    ava.chen@acme.example");
  console.log("  Manager  marcus.webb@acme.example");
  console.log("  Employee liam.ortiz@acme.example");
  console.log("  HR       sam.okonkwo@acme.example");
  console.log("");
  console.log("If an email is in more than one org, use organization slug: acme");

  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

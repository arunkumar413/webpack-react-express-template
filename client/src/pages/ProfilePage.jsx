import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Header } from "../components/Header";
import { OrgHierarchy } from "../components/OrgHierarchy";
import { setUserInfo } from "../store/authSlice";
import { API_URL } from "../constants";

const emptyForm = {
  name: "",
  username: "",
  email: "",
  designation: "",
  phone: "",
};

function Detail({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-slate-900">{value || "—"}</dd>
    </div>
  );
}

export function ProfilePage() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [employee, setEmployee] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [hierarchy, setHierarchy] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [hierarchyError, setHierarchyError] = useState("");
  const [notice, setNotice] = useState("");
  const [departmentSavingId, setDepartmentSavingId] = useState("");

  useEffect(function () {
    async function load() {
      setError("");
      setHierarchyError("");
      try {
        const [profileRes, hierarchyRes] = await Promise.all([
          fetch(`${API_URL}/profile`, { credentials: "include" }),
          fetch(`${API_URL}/hierarchy`, { credentials: "include" }),
        ]);

        if (profileRes.status === 401) {
          setError("Please sign in to view your profile.");
          return;
        }
        if (!profileRes.ok) {
          setError("Unable to load profile.");
          return;
        }

        const profileResult = await profileRes.json();
        const nextEmployee = profileResult.data.employee;
        setEmployee(nextEmployee);
        setDepartments(profileResult.data.departments || []);
        setForm({
          name: nextEmployee.name || "",
          username: nextEmployee.username || "",
          email: nextEmployee.email || "",
          designation: nextEmployee.designation || "",
          phone: nextEmployee.phone || "",
        });

        if (hierarchyRes.status === 403) {
          setHierarchyError(
            "You do not have permission to view the organization hierarchy."
          );
        } else if (hierarchyRes.ok) {
          const hierarchyResult = await hierarchyRes.json();
          setHierarchy(hierarchyResult.data);
        } else if (hierarchyRes.status !== 401) {
          setHierarchyError("Unable to load hierarchy.");
        }
      } catch (err) {
        setError("Unable to load profile.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleChange(evt) {
    const { name, value } = evt.target;
    setForm(function (prev) {
      return { ...prev, [name]: value };
    });
  }

  function startEdit() {
    setNotice("");
    setError("");
    setEditing(true);
  }

  function cancelEdit() {
    if (!employee) {
      return;
    }
    setForm({
      name: employee.name || "",
      username: employee.username || "",
      email: employee.email || "",
      designation: employee.designation || "",
      phone: employee.phone || "",
    });
    setError("");
    setEditing(false);
  }

  async function handleSave(evt) {
    evt.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const res = await fetch(`${API_URL}/profile`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.statusMessage || "Unable to update profile.");
        return;
      }

      const nextEmployee = result.data.employee;
      setEmployee(nextEmployee);
      setForm({
        name: nextEmployee.name || "",
        username: nextEmployee.username || "",
        email: nextEmployee.email || "",
        designation: nextEmployee.designation || "",
        phone: nextEmployee.phone || "",
      });
      setEditing(false);
      setNotice("Profile updated.");

      if (result.data.session) {
        const stored = JSON.parse(localStorage.getItem("userInfo") || "{}");
        const nextAuth = { ...stored, ...result.data.session };
        localStorage.setItem("userInfo", JSON.stringify(nextAuth));
        dispatch(setUserInfo(nextAuth));
      }

      await reloadHierarchy();
    } catch (err) {
      setError("Unable to update profile.");
    } finally {
      setSaving(false);
    }
  }

  async function reloadHierarchy() {
    const hierarchyRes = await fetch(`${API_URL}/hierarchy`, {
      credentials: "include",
    });
    if (hierarchyRes.ok) {
      const hierarchyResult = await hierarchyRes.json();
      setHierarchy(hierarchyResult.data);
    }
  }

  async function handleDepartmentChange(employeeId, departmentId) {
    setDepartmentSavingId(employeeId);
    setHierarchyError("");
    try {
      const res = await fetch(`${API_URL}/employees/${employeeId}/department`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ departmentId }),
      });
      const result = await res.json();
      if (!res.ok) {
        setHierarchyError(result.statusMessage || "Unable to update department.");
        return;
      }
      await reloadHierarchy();
      if (employee && employee.id === employeeId) {
        setEmployee(function (prev) {
          if (!prev) {
            return prev;
          }
          return {
            ...prev,
            departmentId: result.data.departmentId,
            departmentName: result.data.departmentName,
          };
        });
      }
    } catch (err) {
      setHierarchyError("Unable to update department.");
    } finally {
      setDepartmentSavingId("");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-10">
        {loading && <p className="text-sm text-slate-500">Loading profile…</p>}
        {error && !employee && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        {employee && (
          <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Your profile</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                  {employee.name}
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  {employee.organization?.name || "Your organization"}
                </p>
              </div>
              {!editing && (
                <button
                  type="button"
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                  onClick={startEdit}
                >
                  Edit profile
                </button>
              )}
            </div>

            {notice && (
              <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                {notice}
              </p>
            )}
            {error && editing && (
              <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            {editing ? (
              <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleSave}>
                <label className="block text-sm">
                  <span className="font-medium text-slate-700">Name</span>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-slate-700">Username</span>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-slate-700">Email</span>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-slate-700">Phone number</span>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-slate-700">Designation</span>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
                    name="designation"
                    value={form.designation}
                    onChange={handleChange}
                  />
                </label>
                <div className="block text-sm">
                  <span className="font-medium text-slate-700">Department</span>
                  <p className="mt-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700">
                    {employee.departmentName || "Company-wide / unassigned"}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Only your manager can change this.
                  </p>
                </div>
                <div className="flex gap-3 sm:col-span-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
                  >
                    {saving ? "Saving…" : "Save changes"}
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Detail label="Email" value={employee.email} />
                <Detail label="Designation" value={employee.designation} />
                <Detail label="Department" value={employee.departmentName} />
                <Detail label="Phone number" value={employee.phone} />
                <Detail label="Username" value={employee.username} />
                <Detail label="Reports to" value={employee.managerName} />
                <Detail
                  label="Roles"
                  value={(employee.roles || []).join(", ")}
                />
              </dl>
            )}
          </section>
        )}

        {hierarchyError && (
          <p className="mb-8 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            {hierarchyError}
          </p>
        )}
        <OrgHierarchy
          data={hierarchy}
          currentEmail={employee?.email || auth.email}
          departmentOptions={departments}
          savingId={departmentSavingId}
          onChangeDepartment={handleDepartmentChange}
        />
      </main>
    </div>
  );
}

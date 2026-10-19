import React, { useEffect, useState } from "react";
import { API_URL } from "../constants";

const ACTIONS = ["read", "write", "update", "delete"];

export function GrantAccess() {
  const [catalog, setCatalog] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState("");
  const [savingMemberId, setSavingMemberId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function load() {
    setError("");
    const res = await fetch(`${API_URL}/access`, { credentials: "include" });
    const payload = await res.json();
    if (!res.ok) {
      throw new Error(payload.statusMessage || "Unable to load access settings.");
    }
    setCatalog(payload.data);
    setSelectedRoleId(function (current) {
      if (current && payload.data.roles.some(function (role) {
        return role.id === current;
      })) {
        return current;
      }
      const firstEditable = payload.data.roles.find(function (role) {
        return !role.fullAccess;
      });
      return (firstEditable || payload.data.roles[0] || {}).id || "";
    });
  }

  useEffect(function () {
    load().catch(function (err) {
      setError(err.message);
    }).finally(function () {
      setLoading(false);
    });
  }, []);

  const selectedRole = (catalog?.roles || []).find(function (role) {
    return role.id === selectedRoleId;
  });

  async function handleRoleChange(memberId, roleId) {
    setSavingMemberId(memberId);
    setError("");
    setNotice("");
    try {
      const res = await fetch(`${API_URL}/access/members/${memberId}/role`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleId }),
      });
      const payload = await res.json();
      if (!res.ok) {
        setError(payload.statusMessage || "Unable to assign role.");
        return;
      }
      setNotice(payload.statusMessage);
      await load();
    } catch (err) {
      setError("Unable to assign role.");
    } finally {
      setSavingMemberId("");
    }
  }

  async function toggleAction(resource, action) {
    if (!selectedRole || selectedRole.fullAccess) {
      return;
    }
    const current = selectedRole.grants[resource.id] || [];
    const next = current.includes(action)
      ? current.filter(function (item) {
          return item !== action;
        })
      : current.concat(action);
    setSavingKey(`${selectedRole.id}:${resource.key}`);
    setError("");
    setNotice("");
    try {
      const res = await fetch(`${API_URL}/access/roles/${selectedRole.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceKey: resource.key, actions: next }),
      });
      const payload = await res.json();
      if (!res.ok) {
        setError(payload.statusMessage || "Unable to update role.");
        return;
      }
      setNotice(payload.statusMessage);
      await load();
    } catch (err) {
      setError("Unable to update role.");
    } finally {
      setSavingKey("");
    }
  }

  if (loading) {
    return (
      <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Loading access settings…</p>
      </section>
    );
  }

  if (!catalog) {
    return (
      <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-red-700">{error || "Unable to load access settings."}</p>
      </section>
    );
  }

  return (
    <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Roles and access</h2>
      <p className="mt-1 mb-5 text-sm text-slate-500">
        Assign a role to each person. Then choose which resources that role can
        use. People inherit access from the role, not from one-off checkboxes.
      </p>

      {notice && (
        <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {notice}
        </p>
      )}
      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <h3 className="mb-2 text-sm font-semibold text-slate-900">People</h3>
      <div className="mb-8 overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Department</th>
              <th className="px-3 py-2 font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            {catalog.members.map(function (member) {
              return (
                <tr key={member.id} className="border-t border-slate-100">
                  <td className="px-3 py-2">
                    <p className="font-medium text-slate-900">{member.name}</p>
                    <p className="text-xs text-slate-500">{member.email}</p>
                  </td>
                  <td className="px-3 py-2 text-slate-700">
                    {member.departmentName}
                  </td>
                  <td className="px-3 py-2">
                    <select
                      className="rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900"
                      value={member.roleIds[0] || ""}
                      disabled={savingMemberId === member.id}
                      onChange={function (evt) {
                        handleRoleChange(member.id, evt.target.value);
                      }}
                    >
                      {catalog.roles.map(function (role) {
                        return (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        );
                      })}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h3 className="mb-2 text-sm font-semibold text-slate-900">
        Role permissions
      </h3>
      <label className="mb-3 block text-sm">
        <span className="mr-2 text-slate-600">Role</span>
        <select
          className="rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900"
          value={selectedRoleId}
          onChange={function (evt) {
            setSelectedRoleId(evt.target.value);
          }}
        >
          {catalog.roles.map(function (role) {
            return (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            );
          })}
        </select>
      </label>

      {selectedRole?.fullAccess ? (
        <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
          {selectedRole.name} has full access to every resource. You cannot
          restrict it here.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2 font-medium">Resource</th>
                {ACTIONS.map(function (action) {
                  return (
                    <th key={action} className="px-3 py-2 font-medium capitalize">
                      {action}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {catalog.resources.map(function (resource) {
                const granted = selectedRole?.grants[resource.id] || [];
                const busy = savingKey === `${selectedRole?.id}:${resource.key}`;
                return (
                  <tr key={resource.id} className="border-t border-slate-100">
                    <td className="px-3 py-2">
                      <p className="font-medium text-slate-900">{resource.name}</p>
                      <p className="text-xs text-slate-400">{resource.key}</p>
                    </td>
                    {ACTIONS.map(function (action) {
                      return (
                        <td key={action} className="px-3 py-2">
                          <input
                            type="checkbox"
                            disabled={!selectedRole || busy}
                            checked={granted.includes(action)}
                            onChange={function () {
                              toggleAction(resource, action);
                            }}
                          />
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function canManageAccess(access) {
  if (!access) {
    return false;
  }
  if (access.fullAccess) {
    return true;
  }
  return (access.grants || []).some(function (grant) {
    return grant.key === "role" && (grant.actions || []).includes("read");
  });
}

GrantAccess.canManageAccess = canManageAccess;

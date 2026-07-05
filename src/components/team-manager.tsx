"use client";

import { useState, useTransition } from "react";
import { addTeamMember, updateUserRole } from "@/lib/actions";
import { Card, Button, Badge, Spinner, Field, inputClass } from "@/components/ui";

type Role = "admin" | "consultant" | "viewer";

interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export function TeamManager({
  currentUserId,
  team,
}: {
  currentUserId: string;
  team: Member[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-6">
      <div>
        <Button size="sm" variant="secondary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add team member"}
        </Button>
      </div>

      {showForm && (
        <Card className="max-w-lg !p-4">
          <form
            action={(form) =>
              startTransition(async () => {
                await addTeamMember(form);
                setShowForm(false);
              })
            }
            className="flex flex-col gap-4"
          >
            <Field label="Full name" htmlFor="new-name">
              <input id="new-name" name="name" required className={inputClass} />
            </Field>
            <Field label="Email" htmlFor="new-email">
              <input id="new-email" name="email" type="email" required className={inputClass} />
            </Field>
            <Field label="Temporary password" htmlFor="new-password" helper="Minimum 8 characters — share securely">
              <input id="new-password" name="password" type="password" required minLength={8} className={inputClass} />
            </Field>
            <Field label="Role" htmlFor="new-role">
              <select id="new-role" name="role" defaultValue="consultant" className={inputClass}>
                <option value="consultant">Consultant</option>
                <option value="viewer">Viewer</option>
                <option value="admin">Admin</option>
              </select>
            </Field>
            <Button type="submit" size="sm" disabled={pending} className="self-start">
              {pending ? <Spinner /> : "Add member"}
            </Button>
          </form>
        </Card>
      )}

      <Card className="overflow-x-auto !p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg text-left">
              <th className="px-4 py-2.5 font-semibold">Name</th>
              <th className="px-4 py-2.5 font-semibold">Email</th>
              <th className="px-4 py-2.5 font-semibold">Joined</th>
              <th className="px-4 py-2.5 font-semibold">Role</th>
            </tr>
          </thead>
          <tbody>
            {team.map((m) => (
              <tr key={m.id} className="border-b border-border last:border-0">
                <td className="px-4 py-2.5 font-medium">
                  {m.name}
                  {m.id === currentUserId && (
                    <span className="ml-2">
                      <Badge tone="accent">You</Badge>
                    </span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-text-secondary">{m.email}</td>
                <td className="px-4 py-2.5 text-text-secondary">
                  {new Date(m.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2.5">
                  {m.id === currentUserId ? (
                    <Badge tone="info">{m.role}</Badge>
                  ) : (
                    <>
                      <label className="sr-only" htmlFor={`role-${m.id}`}>
                        Role for {m.name}
                      </label>
                      <select
                        id={`role-${m.id}`}
                        value={m.role}
                        disabled={pending}
                        onChange={(e) =>
                          startTransition(() => updateUserRole(m.id, e.target.value as Role))
                        }
                        className="rounded-md border border-border-strong bg-surface px-2 py-1 text-xs"
                      >
                        <option value="admin">Admin</option>
                        <option value="consultant">Consultant</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

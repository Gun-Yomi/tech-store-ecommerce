import { AdminActionMessage } from "@/components/admin/AdminActionMessage";
import { updateUserAdminAction } from "@/lib/admin/actions";
import { getAdminUsers } from "@/lib/admin/data";
import { requireAdmin } from "@/lib/auth/guards";

type UsersAdminPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function stringParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

export default async function AdminUsersPage({
  searchParams,
}: UsersAdminPageProps) {
  const [admin, params] = await Promise.all([requireAdmin(), searchParams]);
  const search = stringParam(params.search) ?? "";
  const users = await getAdminUsers({ search });

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-[#cfe0f2] bg-white p-6 shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f7fb3]">
          Users
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-normal text-[#1f2a44]">
          Basic user management
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5f6f85]">
          Search customer accounts, view roles and status, disable users, and
          safely promote or demote roles without exposing password hashes.
        </p>
      </section>

      <AdminActionMessage success={params.success} error={params.error} />

      <section className="rounded-lg border border-[#cfe0f2] bg-white p-4 shadow-sm">
        <form className="flex flex-col gap-3 sm:flex-row">
          <input
            name="search"
            type="search"
            aria-label="Search users"
            defaultValue={search}
            placeholder="Search name or email"
            className="h-11 flex-1 rounded-lg border border-[#cfe0f2] bg-white px-3 text-sm font-semibold text-[#1f2a44] outline-none focus:border-[#4f9ed8]"
          />
          <button
            type="submit"
            className="h-11 rounded-lg bg-[#334155] px-5 text-sm font-black text-white transition hover:bg-[#2f7fb3]"
          >
            Search
          </button>
        </form>
      </section>

      <section className="overflow-hidden rounded-lg border border-[#cfe0f2] bg-white shadow-sm">
        {users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#edf6ff] text-left">
              <thead className="bg-[#f7fbff] text-xs font-black uppercase tracking-[0.14em] text-[#5f6f85]">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Verified</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-right">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf6ff]">
                {users.map((user) => {
                  const isSelf = user.id === admin.id;

                  return (
                    <tr key={user.id} className="align-top">
                      <td className="px-4 py-4">
                        <p className="min-w-[220px] font-black text-[#1f2a44]">
                          {user.name}
                          {isSelf ? (
                            <span className="ml-2 rounded-full bg-[#eaf6ff] px-2 py-1 text-[11px] font-black text-[#245a8d]">
                              You
                            </span>
                          ) : null}
                        </p>
                        <p className="mt-1 text-xs font-bold text-[#5f6f85]">
                          {user.email}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <form
                          id={`user-admin-form-${user.id}`}
                          action={updateUserAdminAction}
                          className="contents"
                        >
                          <input type="hidden" name="userId" value={user.id} />
                          <select
                            name="role"
                            aria-label={`Role for ${user.email}`}
                            defaultValue={user.role}
                            className="h-10 rounded-lg border border-[#cfe0f2] bg-white px-3 text-sm font-bold text-[#1f2a44] outline-none focus:border-[#4f9ed8]"
                          >
                            <option value="CUSTOMER">Customer</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        </form>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          name="status"
                          form={`user-admin-form-${user.id}`}
                          aria-label={`Status for ${user.email}`}
                          defaultValue={user.status}
                          className="h-10 rounded-lg border border-[#cfe0f2] bg-white px-3 text-sm font-bold text-[#1f2a44] outline-none focus:border-[#4f9ed8]"
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="DISABLED">Disabled</option>
                        </select>
                      </td>
                      <td className="px-4 py-4 text-sm font-black text-[#1f2a44]">
                        {user.emailVerified ? "Yes" : "No"}
                      </td>
                      <td className="px-4 py-4 text-sm font-bold text-[#5f6f85]">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          type="submit"
                          form={`user-admin-form-${user.id}`}
                          className="inline-flex h-10 items-center justify-center rounded-lg border border-[#9fc5e8] bg-white px-4 text-sm font-black text-[#334155] transition hover:border-[#4f9ed8] hover:bg-[#eaf6ff]"
                        >
                          Save
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center">
            <h2 className="text-2xl font-black tracking-normal text-[#1f2a44]">
              No users found
            </h2>
            <p className="mt-3 text-sm font-semibold text-[#5f6f85]">
              Adjust the search term or create an account from the storefront.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

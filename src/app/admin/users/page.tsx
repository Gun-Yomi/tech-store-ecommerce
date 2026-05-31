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
      <section className="rounded-lg border border-[#d7dfbd] bg-white p-6 shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#5f7d33]">
          Users
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-normal text-[#253326]">
          Basic user management
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#60705d]">
          Search customer accounts, view roles and status, disable users, and
          safely promote or demote roles without exposing password hashes.
        </p>
      </section>

      <AdminActionMessage success={params.success} error={params.error} />

      <section className="rounded-lg border border-[#d7dfbd] bg-white p-4 shadow-sm">
        <form className="flex flex-col gap-3 sm:flex-row">
          <input
            name="search"
            type="search"
            defaultValue={search}
            placeholder="Search name or email"
            className="h-11 flex-1 rounded-lg border border-[#d7dfbd] bg-white px-3 text-sm font-semibold text-[#253326] outline-none focus:border-[#6e8f3d]"
          />
          <button
            type="submit"
            className="h-11 rounded-lg bg-[#344554] px-5 text-sm font-black text-white transition hover:bg-[#5f7d33]"
          >
            Search
          </button>
        </form>
      </section>

      <section className="overflow-hidden rounded-lg border border-[#d7dfbd] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#edf1df] text-left">
            <thead className="bg-[#f7f9ef] text-xs font-black uppercase tracking-[0.14em] text-[#60705d]">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Verified</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3 text-right">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf1df]">
              {users.map((user) => {
                const isSelf = user.id === admin.id;

                return (
                  <tr key={user.id} className="align-top">
                    <td className="px-4 py-4">
                      <p className="min-w-[220px] font-black text-[#253326]">
                        {user.name}
                        {isSelf ? (
                          <span className="ml-2 rounded-full bg-[#eef4df] px-2 py-1 text-[11px] font-black text-[#3f5b25]">
                            You
                          </span>
                        ) : null}
                      </p>
                      <p className="mt-1 text-xs font-bold text-[#60705d]">
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
                          defaultValue={user.role}
                          className="h-10 rounded-lg border border-[#d7dfbd] bg-white px-3 text-sm font-bold text-[#253326] outline-none focus:border-[#6e8f3d]"
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
                        defaultValue={user.status}
                        className="h-10 rounded-lg border border-[#d7dfbd] bg-white px-3 text-sm font-bold text-[#253326] outline-none focus:border-[#6e8f3d]"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="DISABLED">Disabled</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 text-sm font-black text-[#253326]">
                      {user.emailVerified ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-4 text-sm font-bold text-[#60705d]">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        type="submit"
                        form={`user-admin-form-${user.id}`}
                        className="inline-flex h-10 items-center justify-center rounded-lg border border-[#b7c891] bg-white px-4 text-sm font-black text-[#344554] transition hover:border-[#6e8f3d] hover:bg-[#eef4df]"
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
      </section>
    </div>
  );
}

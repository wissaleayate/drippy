import { useState, useEffect } from 'react';
import { Users as UsersIcon } from 'lucide-react';

interface AdminUser {
  id: number;
  uuid: string;
  name: string;
  email: string;
  created_at: string;
}

function authHeader() {
  return { Authorization: `Bearer ${localStorage.getItem('adminToken')}` };
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  useEffect(() => {
    setIsLoadingUsers(true);
    fetch('http://127.0.0.1:5000/admin/users', {
      headers: authHeader(),
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setIsLoadingUsers(false);
      })
      .catch((err) => {
        console.error('Failed to load users:', err);
        setIsLoadingUsers(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-ink text-bone">
      <main className="pt-8 pb-24 max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display uppercase tracking-tight text-bone">Users</h1>
          <p className="text-sm text-ash mt-2">Everyone registered on your store.</p>
        </div>

        <section aria-labelledby="users-heading">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-9 w-9 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-volt" aria-hidden="true">
              <UsersIcon className="w-4 h-4" />
            </div>
            <h2 id="users-heading" className="text-xl font-bold font-display uppercase tracking-wider text-bone">Registered Users ({users.length})</h2>
          </div>

          {isLoadingUsers ? <p className="text-sm text-ash" aria-live="polite">Loading...</p> : (
            <div className="overflow-x-auto rounded-2xl border border-white/5">
              <table className="w-full text-left text-sm min-w-[500px]">
                <thead>
                  <tr className="bg-white/[0.02] text-ash text-xs uppercase font-mono">
                    <th className="px-4 py-3" scope="col">Name</th>
                    <th className="px-4 py-3" scope="col">Email</th>
                    <th className="px-4 py-3" scope="col">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((u) => (
                    <tr key={u.uuid}>
                      <td className="px-4 py-3 text-bone">{u.name}</td>
                      <td className="px-4 py-3 text-ash">{u.email}</td>
                      <td className="px-4 py-3 text-ash font-mono text-xs">{u.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
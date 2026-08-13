import { useState, useEffect } from 'react';
import { Settings, Save, Mail, Phone, Store } from 'lucide-react';

interface StoreSettingsData {
  store_email: string;
  store_phone: string;
  store_name: string;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<StoreSettingsData>({
    store_email: '',
    store_phone: '',
    store_name: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:5000/settings')
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load settings:', err);
        setIsLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('http://127.0.0.1:5000/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify(settings),
      });


      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      setMessage('Settings saved successfully.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
      setMessage('Failed to save settings. Is the backend running?');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink text-bone p-4 sm:p-6 md:p-12 pt-20 sm:pt-24">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-9 w-9 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-volt">
            <Settings className="w-4 h-4" />
          </div>
          <h1 className="text-2xl font-black font-display uppercase tracking-tight">Store Settings</h1>
        </div>
        <p className="text-xs text-ash mb-8">General store information used across the site and future emails.</p>

        {isLoading ? (
          <p className="text-sm text-ash">Loading...</p>
        ) : (
          <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col gap-5">
            <div>
              <label className="text-xs font-bold text-ash uppercase tracking-wider mb-2 flex items-center gap-2">
                <Store className="w-3.5 h-3.5" /> Store Name
              </label>
              <input
                type="text"
                value={settings.store_name}
                onChange={(e) => setSettings((s) => ({ ...s, store_name: e.target.value }))}
                placeholder="Drippy"
                className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone placeholder:text-ash focus:outline-none focus:border-volt/50"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-ash uppercase tracking-wider mb-2 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> Store Email
              </label>
              <input
                type="email"
                value={settings.store_email}
                onChange={(e) => setSettings((s) => ({ ...s, store_email: e.target.value }))}
                placeholder="orders@yourstore.com"
                className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone placeholder:text-ash focus:outline-none focus:border-volt/50"
              />
              <p className="text-[11px] text-ash mt-1.5">Used for sending order receipts and notifications once email is set up.</p>
            </div>

            <div>
              <label className="text-xs font-bold text-ash uppercase tracking-wider mb-2 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" /> Store Phone
              </label>
              <input
                type="tel"
                inputMode="numeric"
                value={settings.store_phone}
                onChange={(e) => setSettings((s) => ({ ...s, store_phone: e.target.value.replace(/[^0-9]/g, '') }))}
                placeholder="0560999413"
                className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone placeholder:text-ash focus:outline-none focus:border-volt/50"
              />
            </div>

            {message && (
              <p className={`text-xs font-semibold ${message.includes('Failed') ? 'text-rose-400' : 'text-volt'}`}>
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="self-start flex items-center gap-2 px-5 py-3 rounded-xl bg-volt text-ink text-xs font-mono font-bold uppercase tracking-wider hover:bg-bone transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
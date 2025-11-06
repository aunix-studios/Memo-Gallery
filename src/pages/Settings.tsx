import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { ArrowLeft, Settings as SettingsIcon, Trash2 } from 'lucide-react';
import { clearAllData } from '@/lib/indexedDB';

// Simple theme manager using the `dark` class
function applyTheme(next: 'system' | 'light' | 'dark') {
  const root = document.documentElement;
  if (next === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', prefersDark);
  } else {
    root.classList.toggle('dark', next === 'dark');
  }
}

export default function Settings() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>(() => (localStorage.getItem('theme') as any) || 'system');
  const [notifications, setNotifications] = useState<boolean>(() => localStorage.getItem('notifications_enabled') !== 'false');

  useEffect(() => {
    applyTheme(theme);
  }, []);

  const handleThemeChange = (next: 'system' | 'light' | 'dark') => {
    setTheme(next);
    localStorage.setItem('theme', next);
    applyTheme(next);
    toast.success(`Theme set to ${next}`);
  };

  const handleNotificationsToggle = (checked: boolean) => {
    setNotifications(checked);
    localStorage.setItem('notifications_enabled', String(checked));
    toast.success(checked ? 'Notifications enabled' : 'Notifications disabled');
  };

  const handleClearData = async () => {
    await clearAllData();
    toast.success('All gallery data cleared');
  };

  const handleClearDeviceAccounts = () => {
    localStorage.removeItem('accounts');
    localStorage.removeItem('device_id');
    toast.success('Device accounts cleared');
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="glass border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/gallery')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <SettingsIcon className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Settings</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-3xl space-y-6 animate-fade-in">
        {/* Theme */}
        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle>Theme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>System</Label>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                onClick={() => handleThemeChange('system')}
              >
                System
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <Label>Light</Label>
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                onClick={() => handleThemeChange('light')}
              >
                Light
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <Label>Dark</Label>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                onClick={() => handleThemeChange('dark')}
              >
                Dark
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <Label>Enable in-app toasts</Label>
            <Switch checked={notifications} onCheckedChange={handleNotificationsToggle} />
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" onClick={handleClearData}>
              <Trash2 className="h-4 w-4 mr-2" /> Clear all gallery data (IndexedDB)
            </Button>
            <Button variant="outline" onClick={handleClearDeviceAccounts}>
              <Trash2 className="h-4 w-4 mr-2" /> Clear device accounts
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

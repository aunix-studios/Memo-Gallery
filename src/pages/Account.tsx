import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';

export default function Account() {
  const { user, logout } = useAuth();
  const [accounts, setAccounts] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('device_accounts') || '[]') as string[];
    setAccounts(stored);
    document.title = 'Account • Memo Gallery';
  }, []);

  const handleRemove = (email: string) => {
    const filtered = accounts.filter((e) => e !== email);
    localStorage.setItem('device_accounts', JSON.stringify(filtered));
    setAccounts(filtered);
    toast.success('Removed from this device');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pb-20">
      <header className="glass border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/gallery')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <User className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">My Account</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-xl mx-auto glass">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">Signed in as</p>
            <p className="text-lg font-semibold">{user.email}</p>
            <p className="text-xs text-muted-foreground break-all">ID: {user.id}</p>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => navigate('/login')} variant="outline">Switch account</Button>
            <Button onClick={logout} variant="destructive">Log out</Button>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Accounts on this device (max 5)</h3>
            {accounts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No accounts stored yet.</p>
            ) : (
              <ul className="space-y-2">
                {accounts.map((email) => (
                  <li key={email} className="flex items-center justify-between border rounded-md p-2">
                    <span className="text-sm">{email}</span>
                    <Button size="sm" variant="ghost" onClick={() => handleRemove(email)}>Remove</Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

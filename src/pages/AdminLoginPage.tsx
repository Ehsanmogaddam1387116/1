import { useState, useEffect } from 'react';
import { Lock, User, ArrowRight, Wrench } from 'lucide-react';

type Props = {
  onLogin: () => void;
  onNavigate: (page: string) => void;
};

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';
const STORAGE_KEY = 'toolsan-admin-auth';

export default function AdminLoginPage({ onLogin, onNavigate }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === 'true') {
      onLogin();
    }
  }, [onLogin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      onLogin();
    } else {
      setError('نام کاربری یا رمز عبور اشتباه است');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Wrench size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">پنل مدیریت ابزارسان</h1>
          <p className="text-sm text-primary-300 mt-2">برای ورود اطلاعات خود را وارد کنید</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">نام کاربری</label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg pr-10 pl-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">رمز عبور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg pr-10 pl-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent"
                  dir="ltr"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm text-center">
                {error}
              </div>
            )}

            <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2">
              ورود به پنل
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100">
            <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500 text-center">
              <p>نام کاربری: <span className="font-mono font-bold">admin</span></p>
              <p>رمز عبور: <span className="font-mono font-bold">admin123</span></p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('home')}
            className="w-full text-sm text-gray-400 hover:text-gray-600 mt-4 transition-colors"
          >
            بازگشت به سایت
          </button>
        </div>
      </div>
    </div>
  );
}

export function logoutAdmin() {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function isAdminAuthed(): boolean {
  return sessionStorage.getItem(STORAGE_KEY) === 'true';
}

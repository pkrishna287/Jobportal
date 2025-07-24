import { useState } from 'react';
import { X, User, Shield, Mail, Lock } from 'lucide-react';
import { useAuth, UserRole } from '../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, error: authError, loading: authLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await login(email, password, selectedRole);
    if (success) {
      onClose();
      setEmail('');
      setPassword('');
    }
    // Error is handled by AuthContext
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setSelectedRole('user');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Sign In</h2>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Login as:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole('user')}
                className={`p-4 border rounded-lg flex flex-col items-center space-y-2 transition-all ${
                  selectedRole === 'user' 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-border hover:bg-accent'
                }`}
              >
                <User className="w-6 h-6" />
                <span className="font-medium">Job Seeker</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`p-4 border rounded-lg flex flex-col items-center space-y-2 transition-all ${
                  selectedRole === 'admin' 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-border hover:bg-accent'
                }`}
              >
                <Shield className="w-6 h-6" />
                <span className="font-medium">Employer</span>
              </button>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Backend Authentication Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-1.5"></div>
              <div>
                <p className="text-sm text-amber-800 font-medium mb-1">
                  Real Authentication Required
                </p>
                <p className="text-xs text-amber-700">
                  Please use valid credentials from your backend server.
                  Make sure your backend is running and connected.
                </p>
              </div>
            </div>
          </div>

          {authError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{authError}</p>
            </div>
          )}

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={authLoading}
              className="flex-1 px-6 py-3 border border-border rounded-lg text-muted-foreground hover:bg-accent transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={authLoading || !email || !password}
              className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {authLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

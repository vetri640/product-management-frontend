import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Eye, EyeOff, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 dark:bg-slate-950">
      {/* Left Side - Brand & Presentation */}
      <div className="hidden lg:flex flex-1 relative bg-slate-900 items-center justify-center overflow-hidden">
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-slate-900 to-slate-950 z-10" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent z-20" />

        {/* Animated Abstract Shapes */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-blue-600/20 blur-[120px] z-0"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-cyan-600/20 blur-[100px] z-0"
        />

        <div className="relative z-20 p-12 text-center max-w-2xl w-full flex flex-col items-center">
          <Link to="/" className="mb-12 inline-block">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="flex items-center justify-center"
            >
              <img
                src="/ZuppaLogo.png"
                alt="Zuppa Logo"
                className="h-60 lg:h-55 w-auto object-contain hover:scale-[1.05] transition-transform drop-shadow-lg"
              />
            </motion.div>
          </Link>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <h1 className="text-5xl font-extrabold text-white tracking-tight leading-tight">
              Hardware Management <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                Reimagined
              </span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed max-w-lg mx-auto">
              Enterprise-grade platform for tracking, analyzing, and managing your fleet of autonomous systems and IoT devices.
            </p>
          </motion.div>

          {/* Testimonial / Social Proof */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20 glass-card rounded-2xl p-6 border border-slate-700/50 bg-slate-800/30 max-w-md w-full mx-auto"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="text-sm text-slate-300 font-medium">
                Trusted by 500+ enterprises
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center relative p-8 lg:p-12 overflow-y-auto">
        {/* Mobile Logo */}
        <div className="lg:hidden absolute top-8 left-8">
          <Link to="/">
            <div className="flex items-center justify-center">
              <img
                src="/ZuppaLogo.png"
                alt="Zuppa Logo"
                className="h-12 md:h-16 w-auto object-contain drop-shadow-md"
              />
            </div>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Welcome back</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">Enter your details to access your dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2 group">
              <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-medium group-focus-within:text-blue-600 transition-colors">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@zuppa.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500/20 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 rounded-xl transition-all shadow-sm"
                required
              />
            </div>
            <div className="space-y-2 group">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-medium group-focus-within:text-blue-600 transition-colors">Password</Label>
                <a href="#" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500/20 text-slate-900 dark:text-slate-100 pr-12 rounded-xl transition-all shadow-sm"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium flex items-start gap-3"
              >
                <div className="mt-0.5">⚠️</div>
                <div>{error}</div>
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 rounded-xl text-base font-medium transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
              {isLoading ? 'Authenticating...' : 'Sign In'}
              {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800 text-center space-y-6">
            <p className="text-slate-600 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

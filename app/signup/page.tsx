'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/utils';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }
    // Insert profile details if signup succeeded
    const user = data.user;
    if (user) {
      const { error: profileError } = await supabase.from('profiles').insert([
        { id: user.id, name, phone, email }
      ]);
      if (profileError) {
        setError('Signup succeeded, but saving profile failed: ' + profileError.message);
        setLoading(false);
        return;
      }
    }
    setSuccess(true);
    setLoading(false);
    setTimeout(() => router.push('/'), 1000);
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 pt-24">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-8 w-full max-w-md flex flex-col items-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-balance text-primary text-center">Sign Up</h1>
        <p className="mb-8 text-muted-foreground text-center text-base">Create a new account</p>
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          <div>
            <label className="block mb-1 font-medium" htmlFor="name">Name</label>
            <input id="name" name="name" type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="phone">Phone Number</label>
            <input id="phone" name="phone" type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="password">Password</label>
            <div className="relative">
              <input id="password" name="password" type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 pr-12" />
              <button
                type="button"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/40 rounded p-1 transition"
                onClick={() => setShowPassword(v => !v)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="confirmPassword">Confirm Password</label>
            <div className="relative">
              <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 pr-12" />
              <button
                type="button"
                tabIndex={-1}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/40 rounded p-1 transition"
                onClick={() => setShowConfirmPassword(v => !v)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-2 text-sm text-center border border-red-200">{error}</div>}
          {success && <div className="bg-green-100 text-green-700 p-2 rounded mb-2 text-sm text-center border border-green-200">Signup successful! Please check your email to confirm your account.</div>}
          <button type="submit" disabled={loading} className="bg-primary text-primary-foreground px-8 py-3 rounded-md hover:bg-primary/90 focus:ring-2 focus:ring-primary/40 transition text-lg font-semibold w-full disabled:opacity-60">{loading ? 'Signing up...' : 'Sign Up'}</button>
        </form>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">Login</Link>
        </div>
      </div>
    </div>
  );
} 
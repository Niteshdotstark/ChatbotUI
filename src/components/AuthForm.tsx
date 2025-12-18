// src/components/AuthForm.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { registerUser, loginUser } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { AuthContextType } from '@/contexts/AuthContext'; // Import for type reference

interface AuthFormProps {
  type: 'register' | 'login';
}
type RegisterData = {
  email: string;
  password: string;
  username: string;
  phone_number: string;
  address: string;
};

type LoginData = {
  email: string;
  password: string;
};

// Helper function to calculate trial end date
const calculateTrialEndDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

export default function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const mutation = useMutation({
    mutationFn: async (data: LoginData | RegisterData) => {
      if (type === 'register') {
        return registerUser(data as RegisterData);
      } else {
        return loginUser(data as LoginData);
      }
    },
    onSuccess: (data) => {
      if (type === 'login') {
        // --- Login Success Logic ---
        const userEmail = data.user?.email || email;
        const storedPlanType = localStorage.getItem('planType') as AuthContextType['planType'];
        const storedTrialEndDate = localStorage.getItem('trialEndDate');

        let planTypeToUse = storedPlanType || 'free_trial';
        let trialEndDateToUse = storedTrialEndDate || calculateTrialEndDate(7);

        // Re-check for expiry on login if plan is free_trial
        if (planTypeToUse === 'free_trial' && storedTrialEndDate) {
          const today = new Date();
          const endDate = new Date(storedTrialEndDate);
          if (today > endDate) {
            planTypeToUse = 'expired';
          }
        }

        // Pass plan info to AuthContext's login function
        login(data.access_token, userEmail, planTypeToUse, trialEndDateToUse);
        router.push('/dashboard');

      } else {
        // --- Register Success Logic ---
        // On successful registration, set the initial free trial info in localStorage.
        const trialEndDate = calculateTrialEndDate(7);
        localStorage.setItem('planType', 'free_trial');
        localStorage.setItem('trialEndDate', trialEndDate);

        router.push('/login?registered=true');
      }
    },
    onError: (err: any) => {
      const detail = err.response?.data?.detail;
      const isLogin = type === 'login';

      // 1. Handle 401 Unauthorized specifically (Common for Login)
      if (err.response?.status === 401) {
        setError('Invalid email or password. Please try again.');
        return;
      }

      // 2. Handle 422 Validation Errors (Common for Registration/Pydantic)
      if (Array.isArray(detail)) {
        const passwordErrors = detail
          .filter((d: any) => d.loc && d.loc.includes('password'))
          .map((d: any) => d.msg);

        const emailErrors = detail
          .filter((d: any) => d.loc && d.loc.includes('email'))
          .map((d: any) => d.msg);

        if (passwordErrors.length > 0) {
          setError(passwordErrors.join('. ') + '.');
        } else if (emailErrors.length > 0) {
          setError(emailErrors.join('. ') + '.');
        } else {
          setError(detail.map((d: any) => d.msg).join('. '));
        }
      } 
      // 3. Handle String Errors (e.g., "Email already registered")
      else if (typeof detail === 'string') {
        setError(detail);
      } 
      // 4. Fallback Generic Errors
      else {
        setError(
          isLogin 
            ? 'Login failed. Please check your credentials.' 
            : 'Registration failed. Please check your input.'
        );
      }
    },
  });

  // Email validation
  const isEmailValid = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Phone validation – flexible for international & Indian numbers
  const isPhoneValid = (phone: string): boolean => {
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };
  // Password validation function
  const isPasswordValid = (pwd: string): boolean => {
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasLowerCase = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasMinLength = pwd.length >= 8;
    return hasUpperCase && hasLowerCase && hasNumber && hasMinLength;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (type === 'register') {
      if (!email || !isEmailValid(email)) {
        setError('Please enter a valid email address');
        return;
      }
      if (!username.trim()) {
        setError('Full Name is required');
        return;
      }
      if (!password || !isPasswordValid(password)) {
        setError('Please choose a strong password (see requirements)');
        return;
      }
      if (phoneNumber && !isPhoneValid(phoneNumber)) {
        setError('Please enter a valid phone number');
        return;
      }

      const registerData: RegisterData = {
        email: email.toLowerCase().trim(),
        password,
        username: username.trim(),
        phone_number: phoneNumber.trim() || '',
        address: address.trim() || '',
      };
      mutation.mutate(registerData);
    } else {
      const loginData: LoginData = { email, password };
      mutation.mutate(loginData);
    }
  };

  const isRegister = type === 'register';

  return (
    // Applied new design structure and classes
    <div className="d-flex align-items-center justify-content-center  p-3 p-sm-4 bg-dotstark-light">
      <div className="bg-white rounded-3xl dotstark-shadow-lg max-w-md w-full p-4 mx-sm-4 slide-up">
        <div className="text-center mb-5">
          <div className="w-16 h-16 bg-dotstark-primary rounded-2xl flex items-center justify-center mx-auto mb-6 bounce-in">
            {/* Chat Icon - extracted from the new design snippet */}
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-dotstark-dark mt-2 mb-3 font-heading slide-up">
            {isRegister ? 'Start Your Free Trial' : 'Welcome Back'}
          </h2>
          <p className="text-gray-600 text-lg slide-up" style={{ animationDelay: '0.1s' }}>
            {isRegister ? 'Create your RAG Chat account - 7 days free' : 'Sign in to your RAG Chat account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 slide-up" style={{ animationDelay: '0.2s' }}>
          {isRegister && (
            // Username Field
            <div className='mb-3'>
              <label htmlFor="auth-username" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="auth-username"
                placeholder="Full Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray w-full px-4 py-3 border-2 border-light rounded-5 transition-colors text-lg"
                required
              />
            </div>
          )}

          {/* Email Field with Validation */}
          <div className='mb-3'>
            <label htmlFor="auth-email" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="auth-email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`bg-gray w-full px-4 py-3 border-2 rounded-5 transition-colors text-lg ${email && !isEmailValid(email)
                ? 'border-red-500 focus:border-red-600'
                : 'border-light focus:border-dotstark-primary'
                }`}
              required
            />
            {email && !isEmailValid(email) && (
              <p className="mt-2 text-sm text-red-600">Please enter a valid email address</p>
            )}
          </div>

          {/* Password Field with Strength Validation */}
          <div className='mb-3'>
            <label htmlFor="auth-password" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              Password
            </label>
            <input
              type="password"
              id="auth-password"
              placeholder={isRegister ? "Enter strong password" : "Enter your password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`bg-gray w-full px-4 py-3 border-2 rounded-5 transition-colors text-lg ${
                // ONLY show red border on invalid password if we are REGISTERING
                isRegister && password && !isPasswordValid(password)
                  ? 'border-red-500 focus:border-red-600'
                  : 'border-light focus:border-dotstark-primary'
              }`}
              required
            />

            {/* Live Password Strength Feedback - ONLY visible during Registration */}
            {isRegister && (
              <>
                {password && !isPasswordValid(password) && (
                  <div className="mt-2 text-sm text-red-600 space-y-1">
                    <p>Password must contain:</p>
                    <ul className="list-disc list-inside text-xs">
                      {!/.{8,}/.test(password) && <li>At least 8 characters</li>}
                      {!/[A-Z]/.test(password) && <li>One uppercase letter (A-Z)</li>}
                      {!/[a-z]/.test(password) && <li>One lowercase letter (a-z)</li>}
                      {!/[0-9]/.test(password) && <li>One number (0-9)</li>}
                    </ul>
                  </div>
                )}

                {password && isPasswordValid(password) && (
                  <p className="mt-2 text-sm text-green-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Strong password!
                  </p>
                )}
              </>
            )}
          </div>

          {/* Conditional Fields for Registration */}
          {isRegister && (
            <>
              {/* Phone Number Field */}
              <div className='mb-3'>
                <label htmlFor="auth-phone" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  id="auth-phone"
                  placeholder="+91 98765 43210 or 9876543210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={`bg-gray w-full px-4 py-3 border-2 rounded-5 transition-colors text-lg ${phoneNumber && !isPhoneValid(phoneNumber)
                    ? 'border-red-500 focus:border-red-600'
                    : 'border-light focus:border-dotstark-primary'
                    }`}
                />
                {phoneNumber && !isPhoneValid(phoneNumber) && (
                  <p className="mt-2 text-sm text-red-600">
                    Please enter a valid phone number (10 digits)
                  </p>
                )}
              </div>

              {/* Address Field */}
              <div className='mb-3'>
                <label htmlFor="auth-address" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Address (Optional)
                </label>
                <textarea
                  id="auth-address"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="bg-gray w-full px-4 py-3 border-2 border-light rounded-5 transition-colors text-lg"
                  rows={3}
                />
              </div>
            </>
          )}

          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

          <button
            type="submit"
            className="btn-dotstark text-white text-lg w-full py-4 mt-3 hover-lift"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Processing...' : isRegister ? 'Start Free Trial' : 'Sign In'}
          </button>
        </form>

        <div className="mt-5 text-center space-y-4 slide-up" style={{ animationDelay: '0.3s' }}>
          {isRegister ? (
            <button
              onClick={() => router.push('/login')}
              className="text-dotstark-primary hover:text-orange-600 font-medium transition-colors"
            >
              Already have an account? Sign in
            </button>
          ) : (
            <button
              onClick={() => router.push('/register')}
              className="text-dotstark-primary hover:text-orange-600 font-medium transition-colors"
            >
              Don't have an account? Sign up
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
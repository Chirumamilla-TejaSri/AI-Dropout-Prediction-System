import React, { useState } from 'react';
import { Mail, ArrowLeft, Send, CheckCircle, AlertCircle, Loader, Shield, Key } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState('email'); // 'email', 'sent', 'reset'
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: '',
    resetCode: '',
    newPassword: '',
    confirmPassword: ''
  });

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateEmailStep = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateResetStep = () => {
    const newErrors = {};

    if (!formData.resetCode.trim()) {
      newErrors.resetCode = 'Reset code is required';
    } else if (formData.resetCode.length !== 6) {
      newErrors.resetCode = 'Reset code must be 6 digits';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'Password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendResetLink = async (e) => {
    e.preventDefault();
    
    if (!validateEmailStep()) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Reset link sent to:', formData.email);
      setIsLoading(false);
      setStep('sent');
    }, 2000);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!validateResetStep()) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Password reset successfully');
      setIsLoading(false);
      // Redirect to login page
      window.location.href = '/login';
    }, 2000);
  };

  const handleResendCode = () => {
    setIsLoading(true);
    setTimeout(() => {
      console.log('Code resent to:', formData.email);
      setIsLoading(false);
    }, 1500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const InputField = ({ label, name, type = 'text', icon: Icon, error, ...props }) => (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-slate-300">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-slate-400" />
        </div>
        <input
          id={name}
          name={name}
          type={type}
          value={formData[name]}
          onChange={handleInputChange}
          className={`block w-full pl-10 pr-3 py-3 bg-slate-800/50 border ${
            error ? 'border-red-500' : 'border-slate-700'
          } rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`}
          {...props}
        />
      </div>
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm mt-1">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-slide-in {
          animation: slideIn 0.4s ease-out;
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-bounce {
          animation: bounce 2s ease-in-out infinite;
        }

        .glass-effect {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .gradient-border {
          position: relative;
          padding: 2px;
          border-radius: 1.5rem;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3));
        }

        .gradient-border-content {
          background: rgba(15, 23, 42, 0.95);
          border-radius: 1.375rem;
        }

        .success-checkmark {
          animation: slideIn 0.5s ease-out, pulse 2s ease-in-out infinite;
        }
      `}</style>

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="gradient-border animate-slide-in">
          <div className="gradient-border-content p-8">
            
            {/* Step 1: Enter Email */}
            {step === 'email' && (
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <Key className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-2">Forgot Password?</h1>
                  <p className="text-slate-400">No worries, we'll send you reset instructions</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSendResetLink} className="space-y-6">
                  <div className="animate-fade-in">
                    <InputField
                      label="Email Address"
                      name="email"
                      type="email"
                      icon={Mail}
                      placeholder="Enter your registered email"
                      error={errors.email}
                      autoFocus
                    />

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-8 py-4 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 hover:shadow-2xl hover:shadow-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Reset Link</span>
                          <Send className="w-5 h-5" />
                        </>
                      )}
                    </button>

                    {/* Back to Login */}
                    <div className="mt-6 text-center">
                      <a
                        href="/login"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-medium transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Login</span>
                      </a>
                    </div>
                  </div>
                </form>
              </>
            )}

            {/* Step 2: Email Sent Confirmation */}
            {step === 'sent' && (
              <>
                <div className="text-center mb-8 animate-fade-in">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center success-checkmark">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-2">Check Your Email</h1>
                  <p className="text-slate-400 mb-4">
                    We've sent a password reset link to
                  </p>
                  <p className="text-indigo-400 font-medium">{formData.email}</p>
                </div>

                <div className="space-y-6 animate-fade-in">
                  {/* Instructions */}
                  <div className="glass-effect rounded-xl p-6">
                    <h3 className="font-semibold text-white mb-3">Next Steps:</h3>
                    <ol className="space-y-2 text-sm text-slate-300">
                      <li className="flex gap-3">
                        <span className="text-indigo-400 font-semibold">1.</span>
                        <span>Check your email inbox and spam folder</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-indigo-400 font-semibold">2.</span>
                        <span>Click on the reset link in the email</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-indigo-400 font-semibold">3.</span>
                        <span>Create a new password for your account</span>
                      </li>
                    </ol>
                  </div>

                  {/* Alternative: Enter Code Manually */}
                  <div className="text-center">
                    <p className="text-slate-400 text-sm mb-4">Or enter the 6-digit code from the email</p>
                    <button
                      onClick={() => setStep('reset')}
                      className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                    >
                      Enter Code Manually
                    </button>
                  </div>

                  {/* Resend */}
                  <div className="text-center pt-4 border-t border-slate-700">
                    <p className="text-slate-400 text-sm mb-2">Didn't receive the email?</p>
                    <button
                      onClick={handleResendCode}
                      disabled={isLoading}
                      className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Sending...' : 'Resend Email'}
                    </button>
                  </div>

                  {/* Back to Login */}
                  <div className="text-center">
                    <a
                      href="/login"
                      className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-medium transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Login</span>
                    </a>
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Reset Password with Code */}
            {step === 'reset' && (
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
                  <p className="text-slate-400">Enter the code sent to {formData.email}</p>
                </div>

                {/* Form */}
                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div className="animate-fade-in space-y-5">
                    <InputField
                      label="Reset Code"
                      name="resetCode"
                      type="text"
                      icon={Key}
                      placeholder="Enter 6-digit code"
                      error={errors.resetCode}
                      maxLength={6}
                      autoFocus
                    />

                    <InputField
                      label="New Password"
                      name="newPassword"
                      type="password"
                      icon={Shield}
                      placeholder="••••••••"
                      error={errors.newPassword}
                    />

                    <InputField
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      icon={Shield}
                      placeholder="••••••••"
                      error={errors.confirmPassword}
                    />

                    {/* Password Requirements */}
                    <div className="glass-effect rounded-xl p-4">
                      <p className="text-xs text-slate-400 mb-2">Password must contain:</p>
                      <ul className="text-xs text-slate-500 space-y-1">
                        <li className="flex items-center gap-2">
                          <CheckCircle className={`w-3 h-3 ${formData.newPassword.length >= 8 ? 'text-green-400' : 'text-slate-600'}`} />
                          <span>At least 8 characters</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className={`w-3 h-3 ${/[A-Z]/.test(formData.newPassword) ? 'text-green-400' : 'text-slate-600'}`} />
                          <span>One uppercase letter</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className={`w-3 h-3 ${/[0-9]/.test(formData.newPassword) ? 'text-green-400' : 'text-slate-600'}`} />
                          <span>One number</span>
                        </li>
                      </ul>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-6 py-4 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 hover:shadow-2xl hover:shadow-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          <span>Resetting Password...</span>
                        </>
                      ) : (
                        <>
                          <span>Reset Password</span>
                          <CheckCircle className="w-5 h-5" />
                        </>
                      )}
                    </button>

                    {/* Back Button */}
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setStep('sent')}
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-medium transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm">
            Need help?{' '}
            <a href="#" className="text-indigo-400 hover:text-indigo-300">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
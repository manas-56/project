import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Clear error when user starts typing in the field
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    if (errors.otp) {
      setErrors({ ...errors, otp: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      localStorage.setItem('email', formData.email);
      setSuccessMessage('OTP sent to your email. Please verify to continue.');
      setOtpSent(true);
      
      setTimeout(() => {
        navigate('/verify-otp');
      }, 2000);
      
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Something went wrong, please try again.';
      setErrors({ ...errors, submit: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    
    if (!otp) {
      setErrors({ ...errors, otp: 'OTP is required' });
      return;
    }
    
    setLoading(true);

    try {
      const email = localStorage.getItem('email');
      const response = await axios.post('http://localhost:5000/api/auth/verify-otp', { otp, email });
      
      setSuccessMessage('Account verified successfully! Redirecting to login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Invalid or expired OTP. Please try again.';
      setErrors({ ...errors, otp: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-3 sm:p-6">
        <div className="w-full max-w-md space-y-4">
          {/* LOGO */}
          <div className="text-center mb-2">
            <div className="flex flex-col items-center gap-1 group">
              {/* <div
                className="size-10 rounded-xl bg-primary/10 flex items-center justify-center 
                          group-hover:bg-primary/20 transition-colors"
              >
                <MessageSquare className="size-5 text-primary" />
              </div> */}
              <h1 className="text-xl font-bold mt-1">
                {otpSent ? 'Verify Your Email' : 'Create Account'}
              </h1>
              <p className="text-sm text-base-content/60">
                {otpSent ? 'Enter the OTP sent to your email' : 'Get started with your free account'}
              </p>
            </div>
          </div>

          {successMessage && (
            <div className="alert alert-success py-2 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{successMessage}</span>
            </div>
          )}
          
          {errors.submit && (
            <div className="alert alert-error py-2 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errors.submit}</span>
            </div>
          )}

          <form onSubmit={otpSent ? handleOtpSubmit : handleSubmit} className="space-y-3">
            {!otpSent ? (
              <>
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium">Full Name</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="size-4 text-base-content/40" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      className={`input input-bordered input-sm h-9 w-full pl-10 ${errors.name ? 'input-error' : ''}`}
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.name && <div className="text-error text-xs mt-1">{errors.name}</div>}
                </div>

                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium">Email</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="size-4 text-base-content/40" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      className={`input input-bordered input-sm h-9 w-full pl-10 ${errors.email ? 'input-error' : ''}`}
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.email && <div className="text-error text-xs mt-1">{errors.email}</div>}
                </div>

                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium">Password</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="size-4 text-base-content/40" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className={`input input-bordered input-sm h-9 w-full pl-10 ${errors.password ? 'input-error' : ''}`}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="size-4 text-base-content/40" />
                      ) : (
                        <Eye className="size-4 text-base-content/40" />
                      )}
                    </button>
                  </div>
                  {errors.password && <div className="text-error text-xs mt-1">{errors.password}</div>}
                </div>

                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium">Confirm Password</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="size-4 text-base-content/40" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      className={`input input-bordered input-sm h-9 w-full pl-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="size-4 text-base-content/40" />
                      ) : (
                        <Eye className="size-4 text-base-content/40" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && <div className="text-error text-xs mt-1">{errors.confirmPassword}</div>}
                </div>

                <button type="submit" className="btn btn-primary btn-sm h-9 w-full mt-2" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </>
            ) : (
              <>
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium">Enter OTP Code</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="size-4 text-base-content/40" />
                    </div>
                    <input
                      type="text"
                      className={`input input-bordered input-sm h-9 w-full pl-10 ${errors.otp ? 'input-error' : ''}`}
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={handleOtpChange}
                      maxLength={6}
                    />
                  </div>
                  {errors.otp && <div className="text-error text-xs mt-1">{errors.otp}</div>}
                  <div className="text-base-content/60 text-xs mt-1">
                    OTP has been sent to your email address. The code will expire in 15 minutes.
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-sm h-9 w-full mt-2" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </button>
              </>
            )}

            <div className="text-center mt-2">
              <div className="text-sm text-base-content/60">
                Already have an account?{" "}
                <Link to="/login" className="link link-primary">
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* right side - content area */}
      <div className="hidden lg:flex lg:items-center lg:justify-center bg-base-200">
        <div className="max-w-md p-1 text-center">
          <div className="mockup-window border bg-base-300 mb-4">
            <div className="px-4 py-6 bg-base-200 flex flex-col items-center">
              <div className="radial-progress text-primary" style={{ "--value": 70 }}>70%</div>
              <h3 className="font-bold mt-3">Market Trends</h3>
            </div>
          </div>
          <h2 className="text-xl font-bold mb-1">Join our trading community</h2>
          <p className="text-sm text-base-content/60">
            Track your investments, analyze market trends, and make informed trading decisions with our retro-styled interface.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
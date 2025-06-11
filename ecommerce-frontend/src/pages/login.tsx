import React, { useState } from 'react';
import { login, register } from './../services/login.services';

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  username: string; // Change from 'name' to 'username'
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  name?: string;
  confirmPassword?: string;
  general?: string;
}

const Login: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [registerData, setRegisterData] = useState<RegisterFormData>({
    username: '', // Change from 'name' to 'username'
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateLoginForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!loginData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!loginData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (loginData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegisterForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!registerData. username.trim()) {
      newErrors.name = 'Name is required';
    } else if (registerData.username.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    if (!registerData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!registerData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (registerData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!registerData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value
    }));

   
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateLoginForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await login(loginData);
      console.log('Login successful:', response.data);
      
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      setIsSuccess(true);
      
      
      setLoginData({
        email: '',
        password: ''
      });
    } catch (error: any) {
      console.error('Login error:', error);
      setErrors({
        general: error.response?.data?.message || 'Login failed. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateRegisterForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const { confirmPassword, ...registrationData } = registerData;
      const response = await register(registrationData);
      console.log('Registration successful:', response.data);
      
   
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      setIsSuccess(true);
      
      
      setRegisterData({
      username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      setErrors({
        general: error.response?.data?.message || 'Registration failed. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome!</h3>
          <p className="text-sm text-gray-600 mb-4">
            {isLoginMode ? 'You have been logged in successfully.' : 'Your account has been created successfully.'}
          </p>
          <button
            onClick={() => setIsSuccess(false)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {isLoginMode ? 'Sign In' : 'Create Account'}
        </h2>
        
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => {
              setIsLoginMode(true);
              setErrors({});
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
              isLoginMode 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLoginMode(false);
              setErrors({});
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
              !isLoginMode 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sign Up
          </button>
        </div>
      </div>

      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}

      {isLoginMode ? (
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={loginData.email}
              onChange={handleLoginInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={loginData.password}
              onChange={handleLoginInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="text-blue-600 hover:text-blue-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            } transition duration-200`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={registerData.username}
              onChange={handleRegisterInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={registerData.email}
              onChange={handleRegisterInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={registerData.password}
              onChange={handleRegisterInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={registerData.confirmPassword}
              onChange={handleRegisterInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            } transition duration-200`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default Login;
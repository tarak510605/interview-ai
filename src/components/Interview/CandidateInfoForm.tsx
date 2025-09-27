import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { User, Mail, Phone, CheckCircle } from 'lucide-react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { setCandidateInfo, initializeInterview } from '../../store/slices/interviewSlice';

const CandidateInfoForm: React.FC = () => {
  const dispatch = useDispatch();
  const candidateInfo = useTypedSelector((state) => state.interview.candidateInfo);
  
  const [formData, setFormData] = useState({
    name: candidateInfo.name || '',
    email: candidateInfo.email || '',
    phone: candidateInfo.phone || '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      dispatch(setCandidateInfo(formData));
      dispatch(initializeInterview());
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-secondary-900 mb-3">Personal Information</h2>
        <p className="text-secondary-600 max-w-lg mx-auto">
          We've extracted some information from your resume. Please review and complete any missing details 
          to personalize your interview experience.
        </p>
      </div>

      {/* Resume Info */}
      <div className="bg-success-50 border border-success-200 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-success-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-success-900 mb-1">Resume Processing Complete</h3>
            <p className="text-success-700 text-sm mb-2">
              Your resume has been successfully analyzed and processed.
            </p>
            <div className="inline-flex items-center px-3 py-1 bg-success-100 rounded-lg">
              <span className="text-xs font-medium text-success-800">
                📄 {candidateInfo.resumeFileName}
              </span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-secondary-900 mb-3">
              Full Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-secondary-400" />
              </div>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`input-field pl-12 ${
                  errors.name ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500' : ''
                }`}
                placeholder="Enter your full name"
              />
            </div>
            {errors.name && (
              <p className="mt-2 text-sm text-danger-600 flex items-center">
                <span className="w-1 h-1 bg-danger-600 rounded-full mr-2"></span>
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-secondary-900 mb-3">
              Email Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-secondary-400" />
              </div>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`input-field pl-12 ${
                  errors.email ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500' : ''
                }`}
                placeholder="Enter your email address"
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-danger-600 flex items-center">
                <span className="w-1 h-1 bg-danger-600 rounded-full mr-2"></span>
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-secondary-900 mb-3">
              Phone Number *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-secondary-400" />
              </div>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={`input-field pl-12 ${
                  errors.phone ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500' : ''
                }`}
                placeholder="Enter your phone number"
              />
            </div>
            {errors.phone && (
              <p className="mt-2 text-sm text-danger-600 flex items-center">
                <span className="w-1 h-1 bg-danger-600 rounded-full mr-2"></span>
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className="btn-primary text-base px-8 py-3 shadow-medium hover:shadow-large transform hover:scale-105"
          >
            Begin Technical Interview
          </button>
        </div>
      </form>

      {/* Interview Info */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-primary-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-primary-900 mb-3">Interview Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                  <span className="text-sm text-primary-800">6 technical questions total</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                  <span className="text-sm text-primary-800">2 Easy (20s each)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="text-sm text-primary-800">2 Medium (60s each)</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-danger-500 rounded-full"></div>
                  <span className="text-sm text-primary-800">2 Hard (120s each)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-secondary-500 rounded-full"></div>
                  <span className="text-sm text-primary-800">Auto-save progress</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <span className="text-sm text-primary-800">React & Node.js focus</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateInfoForm;
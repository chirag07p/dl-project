import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { RegisterFormValues, RegisterFormErrors, DemoUserSession } from '../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import {
  BrainIcon,
  LockIcon,
  MailIcon,
  UserIcon,
  EyeIcon,
  EyeOffIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
} from '../components/icons';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ACADEMIC_LEVEL_OPTIONS = [
  { value: '', label: 'Select academic level...' },
  { value: '1st Year - Beginner (Foundational Programming)', label: '1st Year - Beginner (Foundational Programming)' },
  { value: '2nd Year - Intermediate (Data Structures Core)', label: '2nd Year - Intermediate (Data Structures Core)' },
  { value: '3rd Year - Upper Intermediate (Algorithms & Recursion)', label: '3rd Year - Upper Intermediate (Algorithms & Recursion)' },
  { value: '4th Year / Graduate - Advanced Revision', label: '4th Year / Graduate - Advanced Revision' },
];

export const RegisterPage: React.FC = () => {
  const [values, setValues] = useState<RegisterFormValues>({
    fullName: '',
    email: '',
    academicLevel: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formFeedback, setFormFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [demoRegisteredSession, setDemoRegisteredSession] = useState<DemoUserSession | null>(null);

  const validate = (): boolean => {
    const newErrors: RegisterFormErrors = {};

    // Full name validation
    if (!values.fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    } else if (values.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters.';
    }

    // Email validation
    const trimmedEmail = values.email.trim();
    if (!trimmedEmail) {
      newErrors.email = 'University email address is required.';
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      newErrors.email = 'Please provide a valid email format (e.g., student@college.edu).';
    }

    // Academic level validation
    if (!values.academicLevel) {
      newErrors.academicLevel = 'Please select your current academic level.';
    }

    // Password validation
    if (!values.password) {
      newErrors.password = 'Password is required.';
    } else if (values.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    } else if (!/[A-Za-z]/.test(values.password) || !/[0-9]/.test(values.password)) {
      newErrors.password = 'Password must include both letters and numbers.';
    }

    // Confirm password validation
    if (!values.confirmPassword) {
      newErrors.confirmPassword = 'Confirmation password is required.';
    } else if (values.password !== values.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    // Terms agreement
    if (!values.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the academic honor code to register.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof RegisterFormValues, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (formFeedback) {
      setFormFeedback(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      setFormFeedback({
        type: 'error',
        message: 'Please resolve the highlighted validation errors before submitting registration.',
      });
      return;
    }

    setIsSubmitting(true);
    setFormFeedback(null);

    // Simulate realistic frontend submission delay (no backend / network)
    setTimeout(() => {
      setIsSubmitting(false);
      const simulatedSession: DemoUserSession = {
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        academicLevel: values.academicLevel,
        isDemoSession: true,
        simulatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };
      setDemoRegisteredSession(simulatedSession);
      setFormFeedback({
        type: 'success',
        message: 'Demo registration completed! Account verified in frontend mock mode.',
      });
    }, 450);
  };

  const handleFillDemoData = () => {
    setValues({
      fullName: 'Samantha Rivera',
      email: 'samantha.rivera@university.edu',
      academicLevel: '2nd Year - Intermediate (Data Structures Core)',
      password: 'StudentDSA2026',
      confirmPassword: 'StudentDSA2026',
      agreeTerms: true,
    });
    setErrors({});
    setFormFeedback(null);
    setDemoRegisteredSession(null);
  };

  const handleReset = () => {
    setDemoRegisteredSession(null);
    setFormFeedback(null);
    setValues({
      fullName: '',
      email: '',
      academicLevel: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    });
    setErrors({});
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-6">
        {/* Brand / Header */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-900 transition-opacity hover:opacity-90 dark:text-white"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-2xs dark:bg-indigo-500">
              <BrainIcon size={22} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Personalized Learning AI
            </span>
          </Link>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            Create Learner Account
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Register to initialize your personalized DSA adaptive profile
          </p>
        </div>

        {/* Demo Notice Banner */}
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-3.5 text-xs text-indigo-900 dark:border-indigo-950/80 dark:bg-indigo-950/40 dark:text-indigo-200">
          <div className="flex items-start gap-2.5">
            <ShieldCheckIcon size={16} className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
            <div className="space-y-0.5">
              <strong className="font-semibold">Milestone B Frontend Demo Mode:</strong>
              <p className="text-slate-600 dark:text-slate-300">
                Client-side registration form verification only. No database or authentication service is connected. Real passwords are never stored.
              </p>
            </div>
          </div>
        </div>

        {/* Successful Demo Registration View */}
        {demoRegisteredSession ? (
          <Card className="border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/60 dark:bg-emerald-950/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="success" size="sm">
                  Registration Successful
                </Badge>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {demoRegisteredSession.simulatedAt}
                </span>
              </div>
              <CardTitle className="text-lg text-emerald-900 dark:text-emerald-200">
                Welcome to DSA Learning, {demoRegisteredSession.fullName}!
              </CardTitle>
              <CardDescription className="text-emerald-800/80 dark:text-emerald-300/80">
                Your demo profile has been simulated: <code className="font-mono text-xs">{demoRegisteredSession.email}</code>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border border-emerald-200/60 bg-white/80 p-3.5 text-xs text-slate-700 dark:border-emerald-900/50 dark:bg-slate-900/80 dark:text-slate-300">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Learner Name:</span>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{demoRegisteredSession.fullName}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Target Level:</span>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{demoRegisteredSession.academicLevel}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-emerald-100/60 p-3 text-xs text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200">
                <p className="font-medium">Milestone B Verification Completed:</p>
                <p className="mt-0.5 text-emerald-800 dark:text-emerald-300">
                  Form field validation passed, confirm password matching confirmed, and honor code consent verified.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2 border-emerald-100 sm:flex-row dark:border-emerald-900/40">
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="primary" size="sm" fullWidth rightIcon={<ArrowRightIcon size={14} />}>
                  Go to Student Sign In
                </Button>
              </Link>
              <Button variant="outline" size="sm" fullWidth onClick={handleReset}>
                Register Another Demo Learner
              </Button>
            </CardFooter>
          </Card>
        ) : (
          /* Registration Form Card */
          <Card>
            <form onSubmit={handleSubmit} noValidate>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Student Registration</CardTitle>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleFillDemoData}
                    className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                  >
                    Quick-Fill Demo
                  </Button>
                </div>
                <CardDescription>
                  Enter your student information to start DSA adaptive practice.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Form Feedback Alert */}
                {formFeedback && (
                  <div
                    role="alert"
                    className={`flex items-start gap-2.5 rounded-lg p-3 text-xs ${
                      formFeedback.type === 'error'
                        ? 'border border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-300'
                        : 'border border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300'
                    }`}
                  >
                    {formFeedback.type === 'error' ? (
                      <AlertTriangleIcon size={16} className="mt-0.5 shrink-0 text-rose-600 dark:text-rose-400" />
                    ) : (
                      <CheckCircleIcon size={16} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    )}
                    <span>{formFeedback.message}</span>
                  </div>
                )}

                {/* Full Name */}
                <div className="space-y-1">
                  <label
                    htmlFor="reg-name"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <Input
                      id="reg-name"
                      type="text"
                      autoComplete="name"
                      placeholder="e.g. Alex Chen"
                      value={values.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      error={errors.fullName}
                      disabled={isSubmitting}
                      className="pr-9"
                    />
                    <div className="pointer-events-none absolute right-3 top-2.5 text-slate-400">
                      <UserIcon size={16} />
                    </div>
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label
                    htmlFor="reg-email"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    University / College Email
                  </label>
                  <div className="relative">
                    <Input
                      id="reg-email"
                      type="email"
                      autoComplete="email"
                      placeholder="alex.chen@university.edu"
                      value={values.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      error={errors.email}
                      disabled={isSubmitting}
                      className="pr-9"
                    />
                    <div className="pointer-events-none absolute right-3 top-2.5 text-slate-400">
                      <MailIcon size={16} />
                    </div>
                  </div>
                </div>

                {/* Academic Level */}
                <div className="space-y-1">
                  <Select
                    id="reg-level"
                    label="Academic Year / DSA Experience"
                    value={values.academicLevel}
                    onChange={(e) => handleChange('academicLevel', e.target.value)}
                    options={ACADEMIC_LEVEL_OPTIONS}
                    error={errors.academicLevel}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="reg-password"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                      >
                        Password
                      </label>
                      <span className="text-2xs text-slate-400">min 8 chars</span>
                    </div>
                    <div className="relative">
                      <Input
                        id="reg-password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="••••••••"
                        value={values.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        error={errors.password}
                        disabled={isSubmitting}
                        className="pr-9"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none dark:hover:text-slate-300"
                      >
                        {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="reg-confirm-password"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Input
                        id="reg-confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="••••••••"
                        value={values.confirmPassword}
                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                        error={errors.confirmPassword}
                        disabled={isSubmitting}
                        className="pr-9"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? 'Hide confirmation password' : 'Show confirmation password'}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none dark:hover:text-slate-300"
                      >
                        {showConfirmPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Terms / Honor Code Checkbox */}
                <div className="space-y-1 pt-1">
                  <label className="flex cursor-pointer items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                    <input
                      type="checkbox"
                      checked={values.agreeTerms}
                      onChange={(e) => handleChange('agreeTerms', e.target.checked)}
                      disabled={isSubmitting}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900"
                    />
                    <span>
                      I agree to the college academic honor code and acknowledge that this is a simulated demo environment.
                    </span>
                  </label>
                  {errors.agreeTerms && (
                    <p className="text-xs text-rose-600 dark:text-rose-400">{errors.agreeTerms}</p>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex-col gap-3 pt-3">
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={isSubmitting}
                  leftIcon={isSubmitting ? undefined : <LockIcon size={16} />}
                >
                  {isSubmitting ? 'Registering Demo Account...' : 'Complete Registration'}
                </Button>

                <div className="flex w-full items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  <Link
                    to="/"
                    className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400"
                  >
                    ← Back to Overview
                  </Link>
                  <span>
                    Already registered?{' '}
                    <Link
                      to="/login"
                      className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                    >
                      Sign In
                    </Link>
                  </span>
                </div>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
};

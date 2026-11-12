import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { LoginFormValues, LoginFormErrors, DemoUserSession } from '../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import {
  BrainIcon,
  LockIcon,
  MailIcon,
  EyeIcon,
  EyeOffIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
} from '../components/icons';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LoginPage: React.FC = () => {
  const [values, setValues] = useState<LoginFormValues>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formFeedback, setFormFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [demoSession, setDemoSession] = useState<DemoUserSession | null>(null);

  const validate = (): boolean => {
    const newErrors: LoginFormErrors = {};

    // Email validation
    const trimmedEmail = values.email.trim();
    if (!trimmedEmail) {
      newErrors.email = 'Email address is required.';
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email address (e.g., student@university.edu).';
    }

    // Password validation
    if (!values.password) {
      newErrors.password = 'Password is required.';
    } else if (values.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof LoginFormValues, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear field-specific error as user edits
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
        message: 'Please resolve the highlighted validation errors before signing in.',
      });
      return;
    }

    setIsSubmitting(true);
    setFormFeedback(null);

    // Simulate realistic frontend submission delay (no backend / network)
    setTimeout(() => {
      setIsSubmitting(false);
      const simulatedSession: DemoUserSession = {
        fullName: 'Alex Chen (Demo Student)',
        email: values.email.trim(),
        academicLevel: '2nd Year / Intermediate DSA',
        isDemoSession: true,
        simulatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };
      setDemoSession(simulatedSession);
      setFormFeedback({
        type: 'success',
        message: 'Demo login successful! Simulated session active for testing.',
      });
    }, 450);
  };

  const handleFillDemoCredentials = () => {
    setValues({
      email: 'alex.chen@university.edu',
      password: 'DemoStudent2026',
      rememberMe: true,
    });
    setErrors({});
    setFormFeedback(null);
    setDemoSession(null);
  };

  const handleResetDemoSession = () => {
    setDemoSession(null);
    setFormFeedback(null);
    setValues({ email: '', password: '', rememberMe: false });
    setErrors({});
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
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
            Student Sign In
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Sign in to continue your adaptive DSA learning curriculum
          </p>
        </div>

        {/* Demo Notice Banner */}
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-3.5 text-xs text-indigo-900 dark:border-indigo-950/80 dark:bg-indigo-950/40 dark:text-indigo-200">
          <div className="flex items-start gap-2.5">
            <ShieldCheckIcon size={16} className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
            <div className="space-y-0.5">
              <strong className="font-semibold">Milestone B Frontend Demo Mode:</strong>
              <p className="text-slate-600 dark:text-slate-300">
                Client-side validation is active. No backend authentication service or permanent credentials storage is connected.
              </p>
            </div>
          </div>
        </div>

        {/* Active Demo Session Card */}
        {demoSession ? (
          <Card className="border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/60 dark:bg-emerald-950/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="success" size="sm">
                  Active Demo Session
                </Badge>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {demoSession.simulatedAt}
                </span>
              </div>
              <CardTitle className="text-lg text-emerald-900 dark:text-emerald-200">
                Welcome, {demoSession.fullName}
              </CardTitle>
              <CardDescription className="text-emerald-800/80 dark:text-emerald-300/80">
                Signed in with demo identity: <code className="font-mono text-xs">{demoSession.email}</code>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-emerald-200/60 bg-white/80 p-3 text-xs text-slate-700 dark:border-emerald-900/50 dark:bg-slate-900/80 dark:text-slate-300">
                <p className="font-medium text-slate-900 dark:text-slate-100">Testing Checklist:</p>
                <ul className="mt-1.5 list-inside list-disc space-y-1 text-slate-600 dark:text-slate-400">
                  <li>Client-side form validation succeeded</li>
                  <li>No passwords persisted to localStorage</li>
                  <li>Shared layout, theme toggle, and responsive container verified</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2 border-emerald-100 sm:flex-row dark:border-emerald-900/40">
              <Link to="/" className="w-full sm:w-auto">
                <Button variant="primary" size="sm" fullWidth rightIcon={<ArrowRightIcon size={14} />}>
                  Return to Overview
                </Button>
              </Link>
              <Button variant="outline" size="sm" fullWidth onClick={handleResetDemoSession}>
                Sign Out / Reset Form
              </Button>
            </CardFooter>
          </Card>
        ) : (
          /* Login Form Card */
          <Card>
            <form onSubmit={handleSubmit} noValidate>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Sign In</CardTitle>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleFillDemoCredentials}
                    className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                  >
                    Quick-Fill Demo
                  </Button>
                </div>
                <CardDescription>
                  Enter your student credentials below.
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

                {/* Email Address */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="login-email"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      College / University Email
                    </label>
                  </div>
                  <div className="relative">
                    <Input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      placeholder="student@university.edu"
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

                {/* Password */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="login-password"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Password
                    </label>
                    <span className="text-xs text-slate-400">min 6 chars</span>
                  </div>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={values.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      error={errors.password}
                      disabled={isSubmitting}
                      className="pr-10"
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

                {/* Remember Me Option */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <input
                      type="checkbox"
                      checked={values.rememberMe}
                      onChange={(e) => handleChange('rememberMe', e.target.checked)}
                      disabled={isSubmitting}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900"
                    />
                    <span>Remember demo session for this tab</span>
                  </label>
                  <span className="text-xs text-slate-400">
                    Frontend mock
                  </span>
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
                  {isSubmitting ? 'Authenticating Demo Session...' : 'Sign In as Student'}
                </Button>

                <div className="flex w-full items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  <Link
                    to="/"
                    className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400"
                  >
                    ← Back to Overview
                  </Link>
                  <span>
                    New learner?{' '}
                    <Link
                      to="/register"
                      className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                    >
                      Create Account
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

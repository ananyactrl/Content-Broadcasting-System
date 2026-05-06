/**
 * LoginForm — email + password with Zod validation and role-based redirect.
 *
 * On success: stores auth in Zustand, sets middleware cookies, redirects.
 * On failure: shows inline "Invalid credentials" toast.
 */

'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginSchema } from '@/src/utils/validators';
import { login } from '@/src/services/auth.service';
import { useAuth } from '@/src/hooks/useAuth';
import { ROLES } from '@/src/utils/constants';

export default function LoginForm() {
  const { setAuth } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = useCallback(
    async (data) => {
      setIsSubmitting(true);
      try {
        const result = await login(data);
        setAuth({ token: result.token, user: result.user });

        // Set lightweight cookies for middleware route protection
        const maxAge = 60 * 60 * 24 * 7; // 7 days
        document.cookie = `cbs-token=${result.token}; path=/; max-age=${maxAge}; SameSite=Lax`;
        document.cookie = `cbs-role=${result.user.role}; path=/; max-age=${maxAge}; SameSite=Lax`;

        toast.success(`Welcome back, ${result.user.name}!`);

        const destination =
          result.user.role === ROLES.PRINCIPAL
            ? '/dashboard/principal'
            : '/dashboard/teacher';
        router.push(destination);
      } catch (err) {
        toast.error(err?.message ?? 'Invalid credentials. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [setAuth, router]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@school.com"
          aria-invalid={!!errors.email}
          {...register('email')}
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          aria-invalid={!!errors.password}
          {...register('password')}
        />
        {errors.password && (
          <p className="text-xs text-red-500 mt-1" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Signing in…
          </>
        ) : (
          'Sign in'
        )}
      </Button>
    </form>
  );
}

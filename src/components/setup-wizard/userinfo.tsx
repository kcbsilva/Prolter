// src/components/setup-wizard/userinfo.tsx
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const localStorageKey = 'setupStepUser';

export const stepUserSchema = z
  .object({
    fullName: z.string().min(1, 'Name is required'),
    username: z.string().min(4, 'Username must be at least 4 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

export type StepUserData = z.infer<typeof stepUserSchema>;

interface UserInfoStepProps {
  defaultValues?: StepUserData;
  onBack: () => void;
  onNext: (data: StepUserData) => void;
}

export function UserInfoStep({
  defaultValues,
  onBack,
  onNext,
}: UserInfoStepProps) {
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm<StepUserData>({
    resolver: zodResolver(stepUserSchema),
    defaultValues:
      defaultValues ??
      (() => {
        const stored = localStorage.getItem(localStorageKey);
        return stored
          ? JSON.parse(stored)
          : {
            fullName: '',
            username: '',
            password: '',
            confirmPassword: '',
          };
      })(),
  });

  const handleSubmit = async (data: StepUserData) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/settings/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: data.fullName,
          username: data.username,
          password: data.password,
          role: 'admin',
        }),
      });

      if (!res.ok) throw new Error('Failed to create user');

      localStorage.setItem(localStorageKey, JSON.stringify(data));
      onNext(data);
    } catch (err) {
      console.error(err);
      toast({
        title: 'User creation failed',
        description: 'Could not create admin user. Check the console for details.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'bg-[#E5E5E5] text-[#233B6E] placeholder:text-[#233B6E]/60';

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 animate-fade-in-left"
      >
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Admin Full Name" className={inputClass} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="admin" className={inputClass} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={inputClass}
                    {...field}
                  />
                </FormControl>
                <button
                  type="button"
                  className="absolute right-3 top-2 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={inputClass}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between pt-2">
          <Button type="button" variant="outline" onClick={onBack} className="text-[#233B6E]">
            Back
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Next'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

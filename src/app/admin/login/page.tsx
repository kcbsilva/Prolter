// src/app/admin/login/page.tsx

'use client';

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { ProlterLogo } from '@/components/prolter-logo';

type IpApiResponse = { ip: string };

export default function AdminLoginPage() {
  // form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // ui
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // redirect
  const [redirectUrl, setRedirectUrl] = useState("/admin/dashboard");
  // ip
  const [publicIP, setPublicIP] = useState<string | null>(null);
  const [ipLoading, setIpLoading] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, isLoading: authIsLoading } = useAuth();
  const { t } = useLocale();

  // Parse redirect_url from query (Next.js-native)
  useEffect(() => {
    const redirect = searchParams.get("redirect_url");
    if (redirect && redirect.startsWith("/admin")) {
      setRedirectUrl(redirect);
    }
  }, [searchParams]);

  // Fetch public IP (simple + safe)
  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        if (!res.ok) throw new Error("IP fetch failed");
        const data: IpApiResponse = await res.json();
        if (isMounted) setPublicIP(data.ip || "Unavailable");
      } catch {
        if (isMounted) setPublicIP("Unavailable");
      } finally {
        if (isMounted) setIpLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // If authenticated and not currently sending a login request, redirect
  useEffect(() => {
    if (isAuthenticated && !isSubmitting) {
      router.replace(redirectUrl);
    }
  }, [isAuthenticated, isSubmitting, redirectUrl, router]);

  // Submit
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(email, password, redirectUrl);
      // If login doesn't hard-redirect, the effect above will handle it.
      // Optionally: send publicIP to backend for audit/logging.
    } catch (loginError: any) {
      const errorMap: Record<string, string> = {
        'auth.email_not_confirmed': t(
          'auth.email_not_confirmed_error',
          'Your email address has not been confirmed. Please check your inbox (and spam folder) for a confirmation link.'
        ),
      };

      setError(
        errorMap[loginError?.message] ??
          loginError?.message ??
          t('login.error_failed', 'Login failed. Please check your credentials.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show a loader when auth is initializing or a submission is in-flight
  if (authIsLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <div className="flex space-x-2" role="status" aria-live="polite" aria-label={t('login.loading_status', 'Loading authentication status')}>
          <div className="h-3 w-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="h-3 w-3 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="h-3 w-3 bg-foreground rounded-full animate-bounce" />
        </div>
      </div>
    );
  }

  const isBusy = isSubmitting;

  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <div className="flex flex-1">
        {/* Branding section for larger screens */}
        <div className="hidden lg:flex lg:w-3/4 bg-muted flex-col items-center justify-center p-12 text-center relative overflow-hidden">
          <ProlterLogo className="w-4/5 max-w-2xl h-auto" />
        </div>

        {/* Login form section */}
        <div className="w-full lg:w-1/4 flex justify-start items-center bg-muted p-4 md:py-8 md:pl-8 md:pr-12 lg:pl-12 lg:pr-6">
          <Card className="w-full max-w-xs bg-card border text-card-foreground shadow-lg">
            <CardHeader className="items-center pt-8 pb-4">
              <div className="lg:hidden mb-4">
                <ProlterLogo /> {/* Small logo for mobile */}
              </div>
              <CardTitle className="text-xl text-primary pt-4 lg:pt-0">
                {t("login.title", "Admin Login")}
              </CardTitle>
              <CardDescription className="text-muted-foreground text-center px-2">
                {t("login.description", "Enter your credentials to access the admin panel.")}
              </CardDescription>
              <div className="my-2 border-t border-border w-full" />
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="space-y-1.5">
                  <Label htmlFor="email">{t("login.username_label", "Email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="username"
                    autoFocus
                    placeholder={t("login.username_placeholder", "Enter your email")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-required="true"
                    aria-invalid={!!error}
                    aria-describedby={error ? "login-error" : undefined}
                    disabled={isBusy}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">{t("login.password_label", "Password")}</Label>
                    <Link href="/admin/forgot-password" className="text-xs text-primary hover:underline">
                      {t("login.forgot_password", "Forgot Password?")}
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder={t("login.password_placeholder", "Enter your password")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    aria-required="true"
                    aria-invalid={!!error}
                    aria-describedby={error ? "login-error" : undefined}
                    disabled={isBusy}
                  />
                </div>

                {error && (
                  <p id="login-error" className="text-xs text-destructive" aria-live="assertive">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  disabled={isBusy}
                >
                  {isBusy && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
                  {isBusy ? t('login.loading', 'Signing In...') : t("login.submit_button", "Sign In")}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex justify-center items-center text-xs pt-4 pb-6 px-6">
              <div className="text-muted-foreground">
                {t("login.your_ip", "Your IP:")}&nbsp;
                {ipLoading ? (
                  <Skeleton className="h-3 w-20 inline-block bg-muted" />
                ) : (
                  <span className="font-medium text-foreground">{publicIP}</span>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-3 px-8 mt-auto bg-muted">
        <p className="text-center text-sm text-muted-foreground">
          Prolter © 2025 - All rights reserved.
        </p>
      </footer>
    </div>
  );
}

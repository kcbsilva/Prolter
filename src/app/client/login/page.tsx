// src/app/client/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/shared/ui/card';
import { Input } from '@/components/shared/ui/input';
import { Button } from '@/components/shared/ui/button';

// TODO: Set to false when OTP is fully implemented
const BYPASS_OTP = true;

export default function ClientLoginPage() {
  const [step, setStep] = useState<'tax' | 'otp'>('tax');
  const [loading, setLoading] = useState(false);
  const [taxNumber, setTaxNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function sendOtp() {
    setLoading(true);
    setError('');
    
    if (BYPASS_OTP) {
      // Bypass OTP - directly login with tax number
      const res = await fetch('/api/client/auth/direct-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taxNumber }),
      });
      
      setLoading(false);
      if (res.ok) {
        const data = await res.json();
        router.push(`/client/${data.id}/`);
      } else {
        const data = await res.json();
        setError(data.error || 'Login failed');
      }
      return;
    }

    // Normal OTP flow
    const res = await fetch('/api/client/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taxNumber }),
    });
    setLoading(false);
    if (res.ok) {
      setStep('otp');
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to send OTP');
    }
  }

  async function verifyOtp() {
    setLoading(true);
    setError('');
    const res = await fetch('/api/client/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taxNumber, otp }),
    });
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      router.push(`/client/${data.id}/home`);
    } else {
      const data = await res.json();
      setError(data.error || 'Invalid OTP');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Client Portal Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {step === 'tax' && (
            <div>
              <label className="block text-sm mb-1">Tax Number</label>
              <Input 
                value={taxNumber} 
                onChange={(e) => setTaxNumber(e.target.value)}
                placeholder="Enter your tax number"
              />
              <Button className="mt-4 w-full" onClick={sendOtp} disabled={loading || !taxNumber.trim()}>
                {loading ? (BYPASS_OTP ? 'Logging in...' : 'Sending OTP...') : (BYPASS_OTP ? 'Login' : 'Send OTP')}
              </Button>
              {BYPASS_OTP && (
                <p className="text-xs text-yellow-600 mt-2 text-center">
                  OTP verification is temporarily bypassed
                </p>
              )}
            </div>
          )}

          {step === 'otp' && !BYPASS_OTP && (
            <div>
              <label className="block text-sm mb-1">Enter OTP</label>
              <Input 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
              />
              <Button className="mt-4 w-full" onClick={verifyOtp} disabled={loading || !otp.trim()}>
                {loading ? 'Verifying...' : 'Verify & Login'}
              </Button>
              <Button 
                variant="ghost" 
                className="mt-2 w-full text-sm" 
                onClick={() => setStep('tax')}
                disabled={loading}
              >
                Back to Tax Number
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground text-center">
          {step === 'otp' && !BYPASS_OTP && 'Check your email and phone for the OTP.'}
          {BYPASS_OTP && 'Development mode - OTP verification disabled'}
        </CardFooter>
      </Card>
    </div>
  );
}
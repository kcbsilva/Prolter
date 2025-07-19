// src/app/admin/setup-wizard/page.tsx
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Loader2, CheckCircle, Circle } from 'lucide-react';

import { WelcomeStep } from '@/components/setup-wizard/welcome';
import { UserInfoStep } from '@/components/setup-wizard/userinfo';
import { BusinessInfoStep } from '@/components/setup-wizard/businessinfo';
import { PopInfoStep } from '@/components/setup-wizard/popinfo';
import { NASInfoStep } from '@/components/setup-wizard/nasinfo';
import { ProlterLogo } from '@/components/prolter-logo';

const steps = [
  { label: 'Admin Setup', key: 'setupStepUser', component: UserInfoStep },
  { label: 'Business Setup', key: 'setupStep2', component: BusinessInfoStep },
  { label: 'PoP Setup', key: 'setupStep3', component: PopInfoStep },
  { label: 'Device Setup', key: 'setupStep5', component: NASInfoStep, isFinal: true },
];

export default function SetupWizardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showFinalScreen, setShowFinalScreen] = React.useState(false);
  const stepDirection = React.useRef<'forward' | 'back'>('forward');

  const goToStep = (index: number) => {
    setIsLoading(true);
    stepDirection.current = index > currentStep ? 'forward' : 'back';
    setTimeout(() => {
      setCurrentStep(index);
      localStorage.setItem('setupStep', index.toString());
      setIsLoading(false);
    }, 300);
  };

  const saveStepData = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const loadStepData = (key: string) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : undefined;
    } catch {
      return undefined;
    }
  };

  const handleFinalSubmit = async (data: any) => {
    if (isLoading) return;
    setIsLoading(true);
    saveStepData('setupStep5', data);
    localStorage.setItem('setupComplete', 'true');

    const payload = {
      user: loadStepData('setupStepUser'),
      step2: loadStepData('setupStep2'),
      step3: loadStepData('setupStep3'),
      step5: data,
    };

    try {
      const res = await fetch('/api/setup/prolter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to submit setup');

      steps.forEach((s) => localStorage.removeItem(s.key));
      localStorage.removeItem('setupStep');
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
      setShowFinalScreen(true);
      setTimeout(() => router.push('/app'), 5000);
    } catch (err) {
      console.error(err);
      alert('Setup failed. Please try again.');
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const savedStep = localStorage.getItem('setupStep');
    const complete = localStorage.getItem('setupComplete');
    if (!complete && savedStep !== null) {
      setCurrentStep(Number(savedStep));
    }
  }, []);

  const renderStep = () => {
    if (currentStep === 0) {
      return <WelcomeStep onNext={() => goToStep(1)} />;
    }

    const { component: StepComponent, key, isFinal } = steps[currentStep - 1];
    const defaultValues = loadStepData(key);

    return (
      <StepComponent
        defaultValues={defaultValues}
        onBack={() => goToStep(currentStep - 1)}
        onNext={(data: any) => {
          saveStepData(key, data);
          isFinal ? handleFinalSubmit(data) : goToStep(currentStep + 1);
        }}
      />
    );
  };

  const renderSidebarStep = (label: string, index: number) => {
    const isDone = index < currentStep - 1;
    const isCurrent = index === currentStep - 1;
    return (
      <div
        key={label}
        className={`flex items-center gap-2 py-2 pl-4 pr-2 rounded transition ${
          isCurrent ? 'bg-[#233B6E] text-white font-semibold' : 'text-[#081124]'
        }`}
      >
        {isDone ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : (
          <Circle className="h-4 w-4" />
        )}
        <span className="text-sm">{label}</span>
      </div>
    );
  };

  const renderFinalScreen = () => (
    <motion.div
      key="final"
      className="text-center py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-2xl font-bold text-yellow-500 mb-4">🎉 Setup Complete!</h2>
      <p className="text-muted-foreground mb-6">Your Prolter system is ready to use.</p>
      <button
        onClick={() => router.push('/app')}
        className="bg-[#fca311] hover:bg-[#fca311]/90 text-white font-semibold py-2 px-6 rounded transition"
      >
        Go to Prolter
      </button>
    </motion.div>
  );

  return (
    <div className="min-h-screen w-full bg-animated-prolter flex items-center justify-center px-4">
      <div className="w-full max-w-5xl rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-2xl overflow-hidden flex min-h-[600px]">
        {/* Sidebar (light left) */}
        <aside className="w-64 py-6 px-4 flex flex-col justify-between bg-[#E5E5E5] text-[#081124]">
          <div className="flex flex-col items-center">
            <ProlterLogo className="h-10 w-auto mb-6 text-[#081124]" />
            <div className="space-y-1 w-full">
              {steps.map((s, i) => renderSidebarStep(s.label, i))}
            </div>
          </div>
          <div className="text-xs text-[#233B6E]/60 text-center">© 2025 Prolter</div>
        </aside>

        {/* Main Content (dark right) */}
        <main className="flex-1 p-10 flex items-center justify-center bg-[#14213D]/60 text-white backdrop-blur-md border-l border-white/10">
          <div className="w-full max-w-2xl">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  className="flex justify-center items-center h-48"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Loader2 className="h-6 w-6 animate-spin text-yellow-500" />
                </motion.div>
              ) : showFinalScreen ? (
                renderFinalScreen()
              ) : (
                <motion.div
                  key={`step-${currentStep}`}
                  initial={{ opacity: 0, x: stepDirection.current === 'forward' ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: stepDirection.current === 'forward' ? -30 : 30 }}
                  transition={{ duration: 0.4 }}
                >
                  {renderStep()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

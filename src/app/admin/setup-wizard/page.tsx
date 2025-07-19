// src/app/setup-wizard/page.tsx
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Loader2 } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { StepProgressBar } from '@/components/setup-wizard/StepProgressBar';

import { WelcomeStep } from '@/components/setup-wizard/welcome';
import { CountryCityStep } from '@/components/setup-wizard/countrycity';
import { BusinessInfoStep } from '@/components/setup-wizard/businessinfo';
import { UserInfoStep } from '@/components/setup-wizard/userinfo';
import { PopInfoStep } from '@/components/setup-wizard/popinfo';
import { IPInfoStep } from '@/components/setup-wizard/ipinfo';
import { NASInfoStep } from '@/components/setup-wizard/nasinfo';

export default function SetupWizardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showFinalScreen, setShowFinalScreen] = React.useState(false);

  const stepDirection = React.useRef<'forward' | 'back'>('forward');

  const steps = [
    {
      label: 'Location',
      key: 'setupStep1',
      component: CountryCityStep,
    },
    {
      label: 'Business Info',
      key: 'setupStep2',
      component: BusinessInfoStep,
    },
    {
      label: 'Admin User',
      key: 'setupStepUser',
      component: UserInfoStep,
    },
    {
      label: 'PoP Info',
      key: 'setupStep3',
      component: PopInfoStep,
    },
    {
      label: 'IP Info',
      key: 'setupStep4',
      component: IPInfoStep,
    },
    {
      label: 'NAS Info',
      key: 'setupStep5',
      component: NASInfoStep,
      isFinal: true,
    },
  ];

  const goToStep = (index: number) => {
    setIsLoading(true);
    stepDirection.current = index > currentStep ? 'forward' : 'back';
    setTimeout(() => {
      setCurrentStep(index);
      localStorage.setItem('setupStep', index.toString());
      setIsLoading(false);
    }, 400);
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
    saveStepData('setupStep5', data);
    localStorage.setItem('setupComplete', 'true');

    const payload = {
      step1: loadStepData('setupStep1'),
      step2: loadStepData('setupStep2'),
      user: loadStepData('setupStepUser'),
      step3: loadStepData('setupStep3'),
      step4: loadStepData('setupStep4'),
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
    } catch (err) {
      console.error(err);
      alert('Setup failed. Please try again.');
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

    const { component: StepComponent, key, isFinal } = steps[currentStep - 1] ?? {};
    const defaultValues = loadStepData(key);

    return (
      <StepComponent
        defaultValues={defaultValues}
        onBack={() => goToStep(currentStep - 1)}
        onNext={(data: any) => {
          saveStepData(key, data);
          if (isFinal) {
            handleFinalSubmit(data);
          } else {
            goToStep(currentStep + 1);
          }
        }}
      />
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
        className="bg-yellow-500 text-black font-semibold py-2 px-6 rounded hover:bg-yellow-400 transition"
      >
        Go to Prolter
      </button>
    </motion.div>
  );

  return (
    <div className="flex justify-center items-center min-h-screen p-4 pt-8">
      <div className="w-full max-w-2xl border border-[#fca311] rounded-lg shadow-xl bg-card">
        <Card className="border-none shadow-none bg-transparent">
          {!showFinalScreen && currentStep > 0 && (
            <StepProgressBar
              currentStep={currentStep}
              labels={steps.map((s) => s.label)}
            />
          )}
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

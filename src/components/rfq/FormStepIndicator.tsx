import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  number: number;
  title: string;
  description: string;
}

interface FormStepIndicatorProps {
  currentStep: number;
  completedSteps: Set<number>;
  steps: Step[];
}

const FormStepIndicator: React.FC<FormStepIndicatorProps> = ({
  currentStep,
  completedSteps,
  steps,
}) => {
  return (
    <div className="w-full">
      {/* Desktop View - Horizontal Stepper */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Progress Bar */}
          <div className="absolute top-5 left-0 w-full h-0.5 bg-muted">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step) => {
              const isCompleted = completedSteps.has(step.number);
              const isCurrent = currentStep === step.number;
              const isPending = step.number > currentStep;

              return (
                <div key={step.number} className="flex flex-col items-center w-full max-w-[200px]">
                  {/* Step Circle */}
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 relative z-10',
                      isCompleted &&
                        'bg-primary text-primary-foreground shadow-md shadow-primary/20',
                      isCurrent &&
                        'bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110',
                      isPending && 'bg-muted text-muted-foreground'
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <span>{step.number}</span>
                    )}
                  </div>

                  {/* Step Label */}
                  <div className="mt-3 text-center">
                    <p
                      className={cn(
                        'text-sm font-semibold transition-colors',
                        (isCompleted || isCurrent) && 'text-foreground',
                        isPending && 'text-muted-foreground'
                      )}
                    >
                      {step.title}
                    </p>
                    <p
                      className={cn(
                        'text-xs mt-1 transition-colors',
                        isCurrent && 'text-muted-foreground',
                        !isCurrent && 'text-muted-foreground/60'
                      )}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile View - Vertical Compact Stepper */}
      <div className="md:hidden">
        <div className="flex items-center gap-3 bg-muted/30 p-4 rounded-lg">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-md">
              {currentStep}
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">{steps[currentStep - 1]?.title}</p>
            <p className="text-xs text-muted-foreground">
              Pasul {currentStep} din {steps.length}
            </p>
          </div>
          <div className="flex-shrink-0 text-sm text-muted-foreground">
            {completedSteps.size}/{steps.length - 1} completat
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormStepIndicator;

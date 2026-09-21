import React from 'react';
import { Check } from 'lucide-react';

export default function StepIndicator({
  currentStep = 1,
  totalSteps = 3,
  steps = [
    { title: 'About you', desc: 'Age, gender & academics' },
    { title: 'Your digital life', desc: 'Screen time & habits' },
    { title: 'Your daily rhythm', desc: 'Rest, activity & stress' },
  ],
}) {
  return (
    <div className="calm-step-indicator">
      <div className="step-counter-badge">
        <span>Step {currentStep} of {totalSteps}</span>
        <span className="step-counter-divider">·</span>
        <span className="step-counter-title">{steps[currentStep - 1]?.title}</span>
      </div>

      <div className="step-dots-row" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps}>
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;

          return (
            <div
              key={index}
              className={`step-dot-item ${isCurrent ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
            >
              <div className="step-dot-pill">
                {isCompleted ? (
                  <Check size={14} strokeWidth={2.5} />
                ) : (
                  <span>{stepNumber}</span>
                )}
              </div>
              <span className="step-dot-label">{step.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

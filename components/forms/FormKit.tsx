"use client";

import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

export function FormShell({
  eyebrow,
  title,
  description,
  step,
  totalSteps,
  aside,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  step?: number;
  totalSteps?: number;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="kk-form-shell">
      <div className="kk-form-main">
        <Card className="kk-form-main-card">
          <CardHeader className="kk-form-header">
            <div className="flex flex-wrap items-center gap-3">
              {eyebrow ? <Badge variant="accent">{eyebrow}</Badge> : null}
              {step && totalSteps ? <span className="kk-form-step-pill">Step {step} of {totalSteps}</span> : null}
            </div>
            <div className="space-y-3">
              <CardTitle className="kk-form-title">{title}</CardTitle>
              {description ? <CardDescription className="kk-form-description">{description}</CardDescription> : null}
            </div>
            {step && totalSteps ? <FormProgress currentStep={step} totalSteps={totalSteps} /> : null}
          </CardHeader>
          <CardContent className="pt-0">{children}</CardContent>
        </Card>
      </div>
      {aside ? <aside className="kk-form-aside">{aside}</aside> : null}
    </section>
  );
}

export function FormProgress({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  const value = Math.max(0, Math.min(100, (currentStep / totalSteps) * 100));

  return (
    <div className="kk-form-progress" aria-label={`Step ${currentStep} of ${totalSteps}`}>
      <div className="kk-form-progress-meta">
        <span>Progress</span>
        <span>{Math.round(value)}%</span>
      </div>
      <Progress value={value} />
      <div className="kk-form-progress-dots">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <span key={index} className={index < currentStep ? "is-active" : ""} />
        ))}
      </div>
    </div>
  );
}

export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card className="kk-form-section">
      <CardHeader className="kk-form-section-heading">
        <CardTitle className="text-[1.15rem]">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}

export function FormGrid({
  columns = 2,
  children,
}: {
  columns?: 1 | 2 | 3;
  children: ReactNode;
}) {
  return <div className={`kk-form-grid kk-form-grid-${columns}`}>{children}</div>;
}

export function FormField({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="kk-form-field">
      <label htmlFor={htmlFor} className="kk-form-label">
        <span>{label}</span>
        {required ? <span className="kk-form-required">*</span> : null}
      </label>
      {children}
      {error ? (
        <p className="kk-form-error">{error}</p>
      ) : hint ? (
        <p className="kk-form-hint">{hint}</p>
      ) : null}
    </div>
  );
}

export function FormNotice({
  tone,
  children,
}: {
  tone: "error" | "success" | "info";
  children: ReactNode;
}) {
  return <Alert className="kk-form-notice" variant={tone}>{children}</Alert>;
}

export function FormActions({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Separator className="my-6" />
      <div className="kk-form-actions">{children}</div>
    </>
  );
}

export function FormStepActions({
  backLabel = "Back",
  nextLabel = "Continue",
  onBack,
  onNext,
  disableBack,
  disableNext,
  submit,
}: {
  backLabel?: string;
  nextLabel?: string;
  onBack?: () => void;
  onNext?: () => void;
  disableBack?: boolean;
  disableNext?: boolean;
  submit?: boolean;
}) {
  return (
    <FormActions>
      {onBack ? (
        <Button type="button" variant="outline" onClick={onBack} disabled={disableBack}>
          {backLabel}
        </Button>
      ) : (
        <span />
      )}
      <Button type={submit ? "submit" : "button"} variant="secondary" onClick={submit ? undefined : onNext} disabled={disableNext}>
        {nextLabel}
      </Button>
    </FormActions>
  );
}

export function ChoicePills<T extends string>({
  options,
  value,
  onChange,
}: {
  options: Array<{ label: string; value: T }>;
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="kk-choice-pills">
      {options.map((option) => (
        <Button
          key={option.value}
          type="button"
          variant={option.value === value ? "secondary" : "outline"}
          className={`kk-choice-pill ${option.value === value ? "is-active" : ""}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}

export function ReviewList({
  items,
}: {
  items: Array<{ label: string; value: ReactNode }>;
}) {
  return (
    <dl className="kk-review-list">
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value || "-"}</dd>
        </div>
      ))}
    </dl>
  );
}

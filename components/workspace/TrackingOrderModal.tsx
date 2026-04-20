"use client";

import { supportContact } from "@/lib/support-contact";

type TrackingOrderModalProps = {
  open: boolean;
  equipmentName: string;
  bookingLabel: string;
  statusLabel: string;
  scheduledLabel: string;
  operatorIncluded?: boolean;
  contactPhone?: string | null;
  contactLabel?: string;
  onClose: () => void;
};

export function TrackingOrderModal({
  open,
  equipmentName,
  bookingLabel,
  statusLabel,
  scheduledLabel,
  operatorIncluded = false,
  contactPhone,
  contactLabel = "Call Owner",
  onClose,
}: TrackingOrderModalProps) {
  if (!open) {
    return null;
  }

  const dialTarget = contactPhone?.trim() || supportContact.phoneE164;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-background/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-surface-container-highest bg-surface-container-lowest shadow-2xl">
        <div className="flex flex-col gap-5 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-headline text-xl font-bold text-on-background">Tracking Order</h3>
              <p className="mt-1 text-sm text-on-surface-variant">{bookingLabel}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
              aria-label="Close tracking dialog"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="space-y-1">
            <p className="font-headline text-lg font-bold text-on-background">{equipmentName}</p>
            <p className="text-sm text-on-surface-variant">{scheduledLabel}</p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-fixed/30 px-3 py-1.5 text-xs font-semibold text-on-primary-fixed">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            {statusLabel}
          </span>

          <div className="rounded-xl bg-surface-container-low p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant">
              Operator
            </p>
            <p className="mt-2 text-sm font-semibold text-on-surface">
              {operatorIncluded ? "Included with this booking" : "Owner-managed equipment only"}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <a
              href={`tel:${dialTarget}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-container py-3 font-label font-bold text-on-primary shadow-lg shadow-primary-container/20 transition-opacity hover:opacity-90"
            >
              <span className="material-symbols-outlined text-lg">call</span>
              {contactLabel}
            </a>
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl py-3 font-label font-medium text-on-surface-variant transition-colors hover:bg-surface-container-low"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

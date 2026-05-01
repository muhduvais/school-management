"use client";

import { useEffect, useRef } from "react";

interface DeleteConfirmModalProps {
  open: boolean;
  title?: string;
  description?: string;
  itemName?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({
  open,
  title = "Delete item",
  description = "This action cannot be undone.",
  itemName,
  loading = false,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  // Focus the cancel button when modal opens (safe default)
  useEffect(() => {
    if (open) confirmRef.current?.focus();
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      {/* Dim overlay */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
        onClick={onCancel}
      />

      {/* Panel */}
      <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in">

        {/* Top accent bar */}
        <div className="h-1 w-full bg-red-500" />

        <div className="px-6 pt-6 pb-5">
          {/* Icon */}
          <div className="flex items-start gap-4">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600 shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </div>

            <div className="flex-1 min-w-0 pt-0.5">
              <h2
                id="modal-title"
                className="text-base font-semibold text-slate-900 leading-tight"
              >
                {title}
              </h2>

              <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                {itemName ? (
                  <>
                    You're about to delete{" "}
                    <span className="font-medium text-slate-700">"{itemName}"</span>.{" "}
                    {description}
                  </>
                ) : (
                  description
                )}
              </p>
            </div>
          </div>

          {/* Warning note */}
          <div className="mt-4 flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-100 rounded-lg">
            <svg className="w-3.5 h-3.5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <span className="text-xs text-red-700 font-medium">
              This action is permanent and cannot be reversed.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>

          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-sm"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Deleting…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
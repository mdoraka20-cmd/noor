import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error instanceof Error ? error.message : String(error),
    };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo): void {
    console.error('Application ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      let friendlyMessage = 'সিস্টেমে একটি অপ্রত্যাশিত ত্রুটি হয়েছে। অনুগ্রহ করে পেজটি রিলোড করুন।';
      try {
        const parsed = JSON.parse(this.state.errorMessage);
        if (parsed && parsed.operationType && parsed.error) {
          friendlyMessage = `ডাটাবেস অপারেশনে ত্রুটি (${parsed.operationType}): ${parsed.error}`;
        }
      } catch {
        if (this.state.errorMessage) {
          friendlyMessage = this.state.errorMessage;
        }
      }

      return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white border border-rose-300 rounded-xl shadow-lg p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-slate-900">অ্যাপ্লিকেশন ত্রুটি (Error)</h2>
            <p className="text-xs text-slate-600 break-words leading-relaxed">{friendlyMessage}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              রিলোড করুন
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

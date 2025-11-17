/**
 * Broadcast Form Component
 * 
 * Form for creating a new broadcast (patients only).
 * Allows patients to send messages to all verified doctors.
 */

'use client';

import { useState, FormEvent } from 'react';
import TextArea from '@/components/form/input/TextArea';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import { validateBroadcastForm } from '@/utils/validators';
import { getErrorMessage, getFieldErrors } from '@/utils/error-handler';
import type { CreateBroadcastRequest } from '@/types/broadcast.types';

type BroadcastFormProps = {
  onSubmit: (data: CreateBroadcastRequest) => Promise<void>;
  isLoading?: boolean;
  error?: Error | null;
  onSuccess?: () => void;
};

export default function BroadcastForm({
  onSubmit,
  isLoading = false,
  error = null,
  onSuccess,
}: BroadcastFormProps) {
  const [message, setMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<{
    message?: string;
  }>({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationErrors({});

    // Validate form
    const validation = validateBroadcastForm({ message });
    if (!validation.isValid) {
      setValidationErrors(validation.errors || {});
      return;
    }

    try {
      await onSubmit({ message });
      setMessage('');
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      // Error is handled by parent component
      const fieldErrors = getFieldErrors(err);
      if (fieldErrors) {
        setValidationErrors({
          message: fieldErrors.message?.[0],
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
          {getErrorMessage(error)}
        </div>
      )}

      {/* Message input */}
      <div>
        <Label className="text-base font-semibold text-gray-900 dark:text-white">
          Describe Your Medical Concern <span className="text-error-500">*</span>
        </Label>
        <TextArea
          placeholder="Example: I've been experiencing headaches and fever for the past 2 days. I also feel nauseous..."
          value={message}
          onChange={(value) => {
            setMessage(value);
            if (validationErrors.message) {
              setValidationErrors({ ...validationErrors, message: undefined });
            }
          }}
          disabled={isLoading}
          rows={8}
          error={!!validationErrors.message}
          className="mt-2"
        />
        {validationErrors.message && (
          <p className="mt-2 text-sm text-error-500">
            {validationErrors.message}
          </p>
        )}
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          Be as detailed as possible. Include symptoms, duration, and any relevant information. Your consultation request will be sent to all verified doctors.
        </p>
      </div>

      {/* Submit button */}
      <div className="pt-2">
        <Button 
          type="submit" 
          disabled={isLoading || !message.trim()}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 text-base shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending Request...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Request Consultation
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}


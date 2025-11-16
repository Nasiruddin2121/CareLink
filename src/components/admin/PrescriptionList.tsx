"use client";

import React from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { DocsIcon } from "@/icons/index";
import type { AdminPrescription } from "@/types/admin.types";

interface PrescriptionListProps {
  prescriptions: AdminPrescription[];
  isLoading?: boolean;
  count?: number;
  onViewPrescription?: (id: string) => void;
}

const PrescriptionList: React.FC<PrescriptionListProps> = ({
  prescriptions,
  isLoading = false,
  count,
  onViewPrescription,
}) => {
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Unknown";
    }
  };

  const getMedicinePreview = (medicineDetails: string | null) => {
    if (!medicineDetails) return "No medicine details";
    return medicineDetails.length > 100
      ? `${medicineDetails.substring(0, 100)}...`
      : medicineDetails;
  };

  if (isLoading && prescriptions.length === 0) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (prescriptions.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <DocsIcon className="h-6 w-6 text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          No prescriptions found
        </p>
        {count !== undefined && count > 0 && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
            Showing {prescriptions.length} of {count} prescriptions
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {prescriptions.map((prescription) => {
        const sender = prescription.sender;
        const receiver = prescription.receiver;
        const medicinePreview = getMedicinePreview(prescription.medicine_details);

        return (
          <div
            key={prescription.id}
            className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-orange-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-orange-500/40"
          >
            <div className="flex items-start gap-4">
              {/* Sender Avatar */}
              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-gray-200 dark:border-gray-700">
                <Image
                  src={sender.avatar_url || sender.avatar || "/images/user/owner.jpg"}
                  alt={sender.name}
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Prescription Info */}
              <div className="flex flex-1 flex-col justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                      {sender.name} → {receiver.name}
                    </h4>
                    <span className="flex-shrink-0 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                      Prescription
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Patient:</span>
                    <span>{prescription.patient_name || "Unknown"}</span>
                    <span className="text-gray-400 dark:text-gray-600">•</span>
                    <span>{formatDate(prescription.created_at)}</span>
                  </div>
                  <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-2 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300">
                    <span className="font-medium text-orange-500 dark:text-orange-400">Medicine:</span> {medicinePreview}
                  </div>
                </div>

                {/* Actions */}
                {onViewPrescription && (
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() => onViewPrescription(prescription.id)}
                      className="rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-orange-600"
                    >
                      View
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PrescriptionList;

/**
 * User Utility Functions
 * 
 * Utility functions for user-related operations.
 */

/**
 * Get user type label for display
 * 
 * Converts user type to a human-readable label.
 * Handles both frontend constants ('medicine_supplier') and backend values ('shop_owner').
 * 
 * @param userType - User type (patient, doctor, shop_owner, medicine_supplier, admin)
 * @returns Human-readable label (Patient, Doctor, Shop Owner, Admin, User)
 */
export const getUserTypeLabel = (userType: string | undefined): string => {
  if (!userType) {
    return "User"; // Fallback (should not occur now, but kept for safety)
  }
  
  switch (userType) {
    case "patient":
      return "Patient";
    case "doctor":
      return "Doctor";
    case "shop_owner": // Backend returns "shop_owner"
    case "medicine_supplier": // Frontend constant
      return "Shop Owner";
    case "admin":
      return "Admin";
    default:
      return "User";
  }
};


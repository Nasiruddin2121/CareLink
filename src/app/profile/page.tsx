/**
 * Profile Page - CareLink
 * 
 * Modern vertical stacked layout for profile and password update.
 * Primary color is orange.
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { useAuth } from '@/hooks/useAuth';
import { useUpdateProfile } from '@/hooks/useUpdateProfile';
import { useChangePassword } from '@/hooks/useChangePassword';
import { getCurrentUser } from '@/services/api/auth.service';
import type { User } from '@/types/user.types';

import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import { getUserTypeLabel } from '@/utils/user.utils';

export default function ProfilePage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const {
    updateProfile,
    loading: updateLoading,
    error: updateError,
    clearError: clearUpdateError,
  } = useUpdateProfile();
  const {
    changeUserPassword,
    loading: passwordLoading,
    error: passwordError,
    clearError: clearPasswordError,
  } = useChangePassword();

  const [profileData, setProfileData] = useState({
    name: '',
    first_name: '',
    last_name: '',
  });

  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    profile?: string;
    password?: string;
  }>({});

  const avatarSrc = user?.avatar_url || user?.avatar || '/images/user/owner.jpg';
  const userTypeLabel = user ? getUserTypeLabel(user.type) : '';

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          const userWithExtras = currentUser as User & { first_name?: string; last_name?: string };
          setProfileData({
            name: currentUser.name || '',
            first_name: userWithExtras.first_name || '',
            last_name: userWithExtras.last_name || '',
          });
        }
      } catch (err) {
        console.error('Failed to load user:', err);
      }
    };

    if (user) {
      const userWithExtras = user as User & { first_name?: string; last_name?: string };
      setProfileData({
        name: user.name || '',
        first_name: userWithExtras.first_name || '',
        last_name: userWithExtras.last_name || '',
      });
    } else {
      loadUser();
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    clearUpdateError();
    setValidationErrors({});
    setProfileSuccess(null);

    try {
      const result = await updateProfile(profileData);
      if (result.success) {
        setProfileSuccess('Your CareLink profile has been updated!');
        if (refreshUser) await refreshUser();
      }
    } catch (err) {
      console.error('Profile update failed:', err);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    clearPasswordError();
    setValidationErrors({});
    setPasswordSuccess(null);

    if (passwordData.new_password !== passwordData.confirm_password) {
      setValidationErrors({ password: 'New passwords do not match.' });
      return;
    }
    if (passwordData.new_password.length < 8) {
      setValidationErrors({ password: 'Password must be at least 8 characters.' });
      return;
    }
    if (passwordData.old_password === passwordData.new_password) {
      setValidationErrors({ password: 'New password must differ from current password.' });
      return;
    }

    try {
      const result = await changeUserPassword(passwordData.old_password, passwordData.new_password);
      if (result.success) {
        setPasswordSuccess('Password successfully updated!');
        setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
      }
    } catch (err) {
      console.error('Password change failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
      <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">

        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-700 dark:text-gray-300 font-medium hover:text-orange-500 dark:hover:text-orange-400 transition"
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">CareLink Profile</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Update your personal info and secure your account</p>
        </div>

        {/* User Card */}
        {user && (
          <div className="mb-10 flex flex-col items-center rounded-3xl bg-gradient-to-r from-orange-500 to-orange-900 p-6 shadow-lg text-white">
            <div className="h-24 w-24 mb-4 overflow-hidden rounded-full border-2 border-white">
              <Image src={avatarSrc} width={96} height={96} alt={user.name || 'User'} className="h-full w-full object-cover" />
            </div>
            <h2 className="text-xl font-semibold">{user.name || 'User'}</h2>
            <p className="text-sm">{user.email}</p>
            <p className="mt-1 text-xs font-bold">{userTypeLabel}</p>
          </div>
        )}

        {/* Personal Information Card */}
        <div className="mb-8 rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md">
          <h2 className="mb-5 text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">Personal Information</h2>

          <form onSubmit={handleProfileUpdate} className="space-y-5">
            {profileSuccess && <div className="rounded-lg border border-green-300 bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">{profileSuccess}</div>}
            {updateError && <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">{updateError}</div>}
            {validationErrors.profile && <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">{validationErrors.profile}</div>}

            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" type="text" placeholder="John Doe" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} />
            </div>

            <div>
              <Label htmlFor="first_name">First Name</Label>
              <Input id="first_name" type="text" placeholder="John" value={profileData.first_name} onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })} />
            </div>

            <div>
              <Label htmlFor="last_name">Last Name</Label>
              <Input id="last_name" type="text" placeholder="Doe" value={profileData.last_name} onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })} />
            </div>

            <Button type="submit" disabled={updateLoading} className="w-full bg-orange-500 hover:bg-orange-600 text-white">{updateLoading ? 'Updating...' : 'Update Profile'}</Button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="mb-8 rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md">
          <h2 className="mb-5 text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">Change Password</h2>

          <form onSubmit={handlePasswordChange} className="space-y-5">
            {passwordSuccess && <div className="rounded-lg border border-green-300 bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">{passwordSuccess}</div>}
            {passwordError && <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">{passwordError}</div>}
            {validationErrors.password && <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">{validationErrors.password}</div>}

            <div>
              <Label htmlFor="old_password">Current Password</Label>
              <Input id="old_password" type="password" placeholder="Enter current password" value={passwordData.old_password} onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
              required />
            </div>

            <div>
              <Label htmlFor="new_password">New Password</Label>
              <Input id="new_password" type="password" placeholder="Enter new password" value={passwordData.new_password} onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })} required minLength={8} />
              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">Must be at least 8 characters long</p>
            </div>

            <div>
              <Label htmlFor="confirm_password">Confirm New Password</Label>
              <Input id="confirm_password" type="password" placeholder="Confirm new password" value={passwordData.confirm_password} onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })} required minLength={8} />
            </div>

            <Button type="submit" disabled={passwordLoading} className="w-full bg-orange-500 hover:bg-orange-600 text-white">{passwordLoading ? 'Changing...' : 'Change Password'}</Button>
          </form>
        </div>
      </div>
    </div>
  );
}

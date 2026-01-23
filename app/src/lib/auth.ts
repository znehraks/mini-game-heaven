'use client';

import { createClient } from '@/lib/supabase/client';

export async function signInWithDiscord() {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'discord',
    options: {
      redirectTo: `${window.location.origin}/callback`,
    },
  });

  if (error) {
    console.error('Discord sign in error:', error);
    throw error;
  }
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

export async function getCurrentUser() {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error('Get user error:', error);
    return null;
  }

  return user;
}

// Guest mode utilities
const GUEST_KEY = 'mini-game-heaven-guest';

export interface GuestUser {
  id: string;
  name: string;
  createdAt: number;
}

export function createGuestUser(): GuestUser {
  const guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const guest: GuestUser = {
    id: guestId,
    name: `Guest_${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    createdAt: Date.now(),
  };

  localStorage.setItem(GUEST_KEY, JSON.stringify(guest));
  return guest;
}

export function getGuestUser(): GuestUser | null {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem(GUEST_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as GuestUser;
  } catch {
    return null;
  }
}

export function clearGuestUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(GUEST_KEY);
}

export function isGuestUser(): boolean {
  return getGuestUser() !== null;
}

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App instance safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Google Auth Provider with Google Drive file scope
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive.file');
provider.setCustomParameters({
  prompt: 'select_account',
});

// In-memory access token cache (NOT in localStorage per security guidelines)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export interface StudentProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  studentClass?: string;
  rollNo?: string;
  joinedAt: string;
  lastActive: string;
  totalTimeSpentMinutes: number;
  totalDownloadsCount: number;
  lastBackupDate?: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalDownloads: number;
  totalTimeSpentHours: number;
  studentsList: StudentProfile[];
}

// Key for local profile metadata
const STUDENT_PROFILE_KEY = 'school_build_student_profile';
const ADMIN_SESSION_KEY = 'school_build_admin_session';

// Initialize Auth State Listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // If user is logged in but token was cleared on page reload,
        // we keep the Firebase User profile active
        if (onAuthSuccess) onAuthSuccess(user, '');
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Google Sign-In with Drive Scope
export const googleSignIn = async (): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);

    const accessToken = credential?.accessToken || '';
    cachedAccessToken = accessToken;

    // Save/update student profile
    const existing = getStoredStudentProfile();
    const updatedProfile: StudentProfile = {
      uid: result.user.uid,
      displayName: result.user.displayName || 'শিক্ষার্থী',
      email: result.user.email || '',
      photoURL: result.user.photoURL || undefined,
      studentClass: existing?.studentClass || '১০ম শ্রেণী',
      rollNo: existing?.rollNo || '০১',
      joinedAt: existing?.joinedAt || new Date().toISOString(),
      lastActive: new Date().toISOString(),
      totalTimeSpentMinutes: existing?.totalTimeSpentMinutes || 15,
      totalDownloadsCount: existing?.totalDownloadsCount || 0,
      lastBackupDate: existing?.lastBackupDate,
    };
    saveStoredStudentProfile(updatedProfile);

    return { user: result.user, accessToken };
  } catch (error: any) {
    console.error('Google Sign-in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

// Manual quick student login for offline / non-Google usage
export const quickStudentLogin = (name: string, studentClass: string, roll: string): StudentProfile => {
  const profile: StudentProfile = {
    uid: `student-${Date.now()}`,
    displayName: name.trim() || 'শিক্ষার্থী',
    email: `${name.toLowerCase().replace(/\s+/g, '')}@schoolbuild.edu`,
    studentClass: studentClass || '১০ম শ্রেণী',
    rollNo: roll || '০১',
    joinedAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    totalTimeSpentMinutes: 20,
    totalDownloadsCount: 0,
  };
  saveStoredStudentProfile(profile);
  return profile;
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logoutStudent = async () => {
  await signOut(auth);
  cachedAccessToken = null;
  localStorage.removeItem(STUDENT_PROFILE_KEY);
};

export const getStoredStudentProfile = (): StudentProfile | null => {
  try {
    const raw = localStorage.getItem(STUDENT_PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveStoredStudentProfile = (profile: StudentProfile) => {
  try {
    localStorage.setItem(STUDENT_PROFILE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save student profile', err);
  }
};

// -------------------------------------------------------------
// Admin Authentication & Session Management
// -------------------------------------------------------------
export const adminLogin = (password: string): boolean => {
  // Default master admin password for School Build
  if (password === 'admin123' || password === 'admin' || password === 'school2026') {
    sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
    return true;
  }
  return false;
};

export const isAdminLoggedIn = (): boolean => {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
};

export const adminLogout = () => {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
};

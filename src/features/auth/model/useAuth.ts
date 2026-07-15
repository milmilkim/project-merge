import { useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
  type User,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/shared/lib/firebase';

export interface AuthState {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

/**
 * 구글 로그인 세션 + 관리자 여부.
 * isAdmin은 admins/{uid} 문서 존재로 판별(이메일 비노출). 실제 권한 강제는 Firestore Rules.
 */
export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        let admin = false;
        try {
          const snap = await getDoc(doc(db, 'admins', u.uid));
          admin = snap.exists();
        } catch {
          admin = false;
        }
        // 언마운트됐거나 그 사이 계정이 바뀌었으면 stale write 방지
        if (!active || auth.currentUser?.uid !== u.uid) return;
        setIsAdmin(admin);
      } else {
        setIsAdmin(false);
      }
      if (active) setLoading(false);
    });
    return () => {
      active = false;
      unsub();
    };
  }, []);

  const signIn = async () => {
    await signInWithPopup(auth, new GoogleAuthProvider());
  };
  const signOut = async () => {
    await fbSignOut(auth);
  };

  return { user, loading, isAdmin, signIn, signOut };
}

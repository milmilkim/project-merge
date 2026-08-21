import { useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  deleteUser,
  getAdditionalUserInfo,
  onAuthStateChanged,
  reauthenticateWithPopup,
  signInWithPopup,
  signOut as fbSignOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/shared/lib/firebase';

export interface AuthState {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  /** resolve 값: 신규 가입 여부(첫 로그인이면 true) */
  signIn: () => Promise<boolean>;
  signOut: () => Promise<void>;
  /** 닉네임(Auth displayName) 변경. 게시글/댓글의 authorName은 작성 시점 스냅샷이라 소급 안 됨 */
  updateNickname: (name: string) => Promise<void>;
  /** 회원 탈퇴(Auth 계정 삭제). 최근 로그인 요구 시 자동 재인증 */
  deleteAccount: () => Promise<void>;
}

/**
 * 구글 로그인 세션 + 관리자 여부.
 * isAdmin은 admins/{uid} 문서 존재로 판별(이메일 비노출). 실제 권한 강제는 Firestore Rules.
 * 닉네임은 별도 컬렉션 없이 Auth 프로필(displayName)로만 관리한다.
 */
export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  // updateProfile은 User 객체를 제자리 변경해 onAuthStateChanged가 안 울린다 → 수동 리렌더용
  const [, setProfileVersion] = useState(0);

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
    const cred = await signInWithPopup(auth, new GoogleAuthProvider());
    return getAdditionalUserInfo(cred)?.isNewUser ?? false;
  };
  const signOut = async () => {
    await fbSignOut(auth);
  };
  const updateNickname = async (name: string) => {
    if (!auth.currentUser) return;
    await updateProfile(auth.currentUser, { displayName: name.trim() });
    setProfileVersion((v) => v + 1);
  };
  const deleteAccount = async () => {
    const u = auth.currentUser;
    if (!u) return;
    try {
      await deleteUser(u);
    } catch (e) {
      if ((e as { code?: string }).code !== 'auth/requires-recent-login') throw e;
      await reauthenticateWithPopup(u, new GoogleAuthProvider());
      await deleteUser(u);
    }
  };

  return { user, loading, isAdmin, signIn, signOut, updateNickname, deleteAccount };
}

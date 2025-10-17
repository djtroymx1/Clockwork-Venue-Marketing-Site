
"use client";

import { useState, useEffect } from 'react';

// This is a mock auth hook for demonstration purposes.
// In a real app, this would integrate with Firebase Auth.

interface User {
  uid: string;
  email: string;
  role: 'DJ' | 'Manager' | 'Admin' | 'Floor' | 'Host';
  orgId: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching user data
    const mockUser: User = {
      uid: 'user-manager-123',
      email: 'manager@stageflow.test',
      role: 'Manager',
      orgId: 'org-main-club-1'
    };

    // To test non-manager view, switch to this user:
    // const mockUser: User = {
    //   uid: 'user-dj-456',
    //   email: 'dj@stageflow.test',
    //   role: 'DJ',
    //   orgId: 'org-main-club-1'
    // };

    setTimeout(() => {
      setUser(mockUser);
      setLoading(false);
    }, 500);

    // In a real app:
    // const unsubscribe = onAuthStateChanged(auth, (user) => {
    //   if (user) {
    //     // fetch user role and orgId from Firestore
    //     // setUser({ ... });
    //   } else {
    //     setUser(null);
    //   }
    //   setLoading(false);
    // });
    // return () => unsubscribe();
  }, []);

  return { user, loading };
}

    
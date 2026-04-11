import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { useAuth } from './AuthContext';

export interface Post {
  id: string;
  type: 'lost' | 'found';
  title: string;
  description: string;
  location?: string;
  date?: any;
  authorUid: string;
  authorName: string;
  imageUrl?: string;
  createdAt: any;
  status: 'active' | 'resolved';
}

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setPosts([]);
      setLoading(false);
      return;
    }

    const path = 'posts';
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      setPosts(postsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, [user]);

  const addPost = async (postData: Omit<Post, 'id' | 'authorUid' | 'authorName' | 'createdAt' | 'status'>) => {
    if (!user) return;
    const path = 'posts';
    try {
      await addDoc(collection(db, path), {
        ...postData,
        authorUid: user.uid,
        authorName: user.displayName || '익명 사용자',
        createdAt: serverTimestamp(),
        status: 'active'
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const updatePostStatus = async (postId: string, status: 'active' | 'resolved') => {
    const path = `posts/${postId}`;
    try {
      await updateDoc(doc(db, 'posts', postId), { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const deletePost = async (postId: string) => {
    const path = `posts/${postId}`;
    try {
      await deleteDoc(doc(db, 'posts', postId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  return { posts, loading, addPost, updatePostStatus, deletePost };
}

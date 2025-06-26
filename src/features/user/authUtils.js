import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import app from '../../services/firestore'; 

const auth = getAuth(app);

export const loginAdmin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const getCurrentUserId = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user ? user.uid : null);
    });
  });
};

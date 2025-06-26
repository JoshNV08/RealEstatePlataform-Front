import { db } from './firestore';
import { 
  collection, addDoc, getDocs, query, where, doc as firestoreDoc, getDoc, updateDoc, deleteDoc, serverTimestamp 
} from 'firebase/firestore';
import { getCurrentUserId } from '../features/user/authUtils';

const propertiesCollection = collection(db, 'properties');

// Agrega una nueva propiedad (con timestamp de Firestore)
export const addProperty = async (propertyData) => {
  try {
    const adminId = await getCurrentUserId();
    const newProperty = {
      ...propertyData,
      adminId,
      createdAt: serverTimestamp(),
      status: propertyData.status || 'publicada',
    };
    const docRef = await addDoc(propertiesCollection, newProperty);
    return docRef.id;
  } catch (e) {
    throw e;
  }
};

// Devuelve todas las propiedades de un admin (usuario logueado)
export const getPropertiesByAdmin = async () => {
  try {
    const adminId = await getCurrentUserId();
    const q = query(propertiesCollection, where('adminId', '==', adminId));
    const querySnapshot = await getDocs(q);
    const properties = [];
    querySnapshot.forEach((docSnap) => {
      properties.push({ id: docSnap.id, ...docSnap.data() });
    });
    return properties;
  } catch (e) {
    throw e;
  }
};

// Obtiene una propiedad por su ID
export const getPropertyById = async (propertyId) => {
  try {
    const docRef = firestoreDoc(db, 'properties', propertyId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log('No existe la propiedad!');
      return null;
    }
  } catch (e) {
    throw e;
  }
};

// Actualiza una propiedad
export const updateProperty = async (propertyId, updatedData) => {
  try {
    const propertyRef = firestoreDoc(db, 'properties', propertyId);
    await updateDoc(propertyRef, updatedData);
  } catch (e) {
    throw e;
  }
};

// Borra una propiedad
export const deleteProperty = async (propertyId) => {
  try {
    const propertyRef = firestoreDoc(db, 'properties', propertyId);
    await deleteDoc(propertyRef);
  } catch (e) {
    throw e;
  }
};
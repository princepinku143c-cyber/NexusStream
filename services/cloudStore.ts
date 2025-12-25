
import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { Blueprint } from '../types';

export const saveBlueprintToCloud = async (userId: string, blueprint: Blueprint) => {
    if (!db) throw new Error("Database not initialized");
    
    try {
        const docRef = await addDoc(collection(db, "blueprints"), {
            userId,
            ...blueprint,
            savedAt: Date.now()
        });
        console.log("Document written with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
};

export const getUserBlueprints = async (userId: string): Promise<Blueprint[]> => {
    if (!db) return [];

    try {
        const q = query(
            collection(db, "blueprints"), 
            where("userId", "==", userId),
            orderBy("savedAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        const blueprints: Blueprint[] = [];
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Ensure ID from firestore is used for deletion purposes
            blueprints.push({
                ...data,
                id: doc.id, 
            } as Blueprint);
        });
        return blueprints;
    } catch (e) {
        console.error("Error fetching docs: ", e);
        return [];
    }
};

export const deleteBlueprintFromCloud = async (docId: string) => {
    if (!db) return;
    try {
        await deleteDoc(doc(db, "blueprints", docId));
    } catch (e) {
        console.error("Error deleting doc: ", e);
        throw e;
    }
};

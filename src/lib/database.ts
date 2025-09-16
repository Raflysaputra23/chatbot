/* eslint-disable @typescript-eslint/no-explicit-any */
import app from "./firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, onSnapshot, setDoc, updateDoc } from "firebase/firestore";

const db = getFirestore(app);

const col = (dbName: string) => {
    return collection(db, dbName);
};

const addData = async (docName: string, data: any, id: string) => {
    try {
        await setDoc(doc(db, docName, id), data);   
        return {
            status: true,
        }
    } catch (e) {
        console.error("Error adding document: ", e);
        return {
            status: false,
        }
    }
};

const updateData = async (docName: string, data: any, id: string) => {
    const docRef = await doc(col(docName), id);
    try {
        await updateDoc(docRef, data);
        return {
            status: true
        }
    } catch(error) {
        console.error("Error updating document: ", error);
        return {
            status: false
        }
    }
}

const deleteData = async (docName: string, id: string) => {
    const docRef = await doc(col(docName), id);
    try {
        await deleteDoc(docRef);
        return {
            status: true
        }
    } catch(error) {
        console.error("Error deleted document: ", error);
        return {
            status: false
        }
    }
}

const getData = async (docName: string) => {
    const querySnapshot = await getDocs(col(docName));
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }));
    return { status: true, data };
}

const getLiveDataById = (id: string, docName: string, callback: (data: []) => void) => {
    const docRef = doc(col(docName), id);

    const unsubcribe = onSnapshot(docRef, (doc) => {
        if(doc.exists()) {
            callback(doc.data().chats);
        } else {
            callback([]);
        }
    });

    return unsubcribe;
}

const getDataById = async (docName: string, id: string) => {
    const docRef = await doc(col(docName), id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { status: true, id: docSnap.id, data: docSnap.data() };
    } else {
        return {
            status: false
        };
    }
}

export { addData, updateData, deleteData, getData, getDataById, getLiveDataById };
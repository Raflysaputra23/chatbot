
import { GoogleAuthProvider } from "firebase/auth";
import { auth } from "./firebase";

const googleProvider = new GoogleAuthProvider();    

export { auth, googleProvider };
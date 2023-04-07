import User from "../models/User";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../util/firebase";
import { db, firebaseAdmin } from "../util/admin";
import { getAuth, signInWithEmailAndPassword, User as FirebaseUser } from "firebase/auth";

class UserRepository {

    constructor() {
        initializeApp(firebaseConfig);
    }

    async add(user: User, callback: (token?: string) => void) {
        try {
            const userRecord = await firebaseAdmin.auth().createUser({
                email: user.email,
                password: user.password,
                displayName: user.name,
            });
        
            await db.collection("Users").doc(userRecord.uid).set({
                name: user.name,
                cpf: user.cpf,
                telephone_number: user.telephone_number,
            });
        
            const customToken = await firebaseAdmin.auth().createCustomToken(userRecord.uid);
            
            console.log("Successfully created a new user.", userRecord.uid);
            callback(customToken);
        } catch (error) {
            console.log("Error creating a new user. ", error);
        }
    }

    async login(user: User, callback: (userAuth?: FirebaseUser) => void) {
        try {
            const auth = getAuth();
            await signInWithEmailAndPassword(auth, user.email, user.password)
                .then((userCredential) => {
                    const userAuth = userCredential.user;
                    callback(userAuth);
                })
                .catch((error) => {
                    callback(error);
                });
        } catch (error) {
            console.log("Error on user login. ", error);
        }
    }
      
}

export default UserRepository;
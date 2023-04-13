import User from "../models/User";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../util/firebase";
import { db, firebaseAdmin } from "../util/admin";
import { getAuth, signInWithEmailAndPassword, User as FirebaseUser } from "firebase/auth";

class UserRepository {

    constructor() {
        initializeApp(firebaseConfig);
    }

    async add(user: User, callback: any) {
        firebaseAdmin.auth().createUser({
            email: user.email,
            password: user.password,
            displayName: user.name,
        }).then((userRecord) => {
            db.collection("Users").doc(userRecord.uid).set({
                name: user.name,
                cpf: user.cpf,
                telephone_number: user.telephone_number,
            }).then(() => {
                firebaseAdmin.auth().createCustomToken(userRecord.uid).then((customToken) => {
                    console.log("Successfully created a new user.", userRecord.uid);
                    callback(null, customToken);
                }).catch((error) => {
                    console.log("Error creating a custom token. ", error);
                    callback(error);
                });
            }).catch((error) => {
                console.log("Error adding user to Firestore. ", error);
                callback(error);
            });
        }).catch((error) => {
            console.log("Error creating a new user. ", error);
            callback(error);
        });
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

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
                const customClaims = { displayName: user.name, cpf:  user.cpf, telephone_number: user.telephone_number };
                firebaseAdmin.auth().createCustomToken(userRecord.uid, customClaims).then((customToken) => {
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
    
    async login(user: User, callback: (customToken?: string) => void) {
        try {
            const auth = getAuth();
            await signInWithEmailAndPassword(auth, user.email, user.password)
                .then(async (userCredential) => {
                    const userAuth = userCredential.user;
                    const expiresInSecs = 259200; // 72 horas em segundos
                    const customClaims = { 
                    userAuth: userAuth, 
                    expiresIn: expiresInSecs // define o tempo de expiração em segundos
                    };
                    const customToken = await firebaseAdmin.auth().createCustomToken(userAuth.uid, customClaims);
                    callback(customToken);
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

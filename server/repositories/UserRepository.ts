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
                    console.error("Error creating a custom token. ", error);
                    callback(error);
                });
            }).catch((error) => {
                console.error("Error adding user to Firestore. ", error);
                callback(error);
            });
        })
    }

    async login(user: User, acessToken: string, callback: (accessToken?: string) => void) {
        const auth = getAuth();
        if (acessToken.length > 0) {
            // Authentication with provided JWT accessToken
            await firebaseAdmin.auth()
                .verifyIdToken(acessToken)
                .then((decodedToken) => {
                    callback(acessToken);
                    console.log('Successfully user login using accessToken. ' + decodedToken);
                })
                .catch((error) => {
                    callback(error);
                    console.error('Error on user accessToken login. ' + error);
                });
        } else {
            // Authentication with provided email and password
            await signInWithEmailAndPassword(auth, user.email, user.password)
                .then((userCredential) => {
                    // Await the return of a JWT accessToken
                    userCredential.user.getIdToken()
                        .then((acessToken) => {
                            console.log('Successfully user login. ' + userCredential.user.uid);
                            callback(acessToken);
                        })
                        .catch((error) => {
                            console.error('Error to create a accessToken on user login. ' + error);
                            callback(error);
                        })
                })
                .catch((error) => {
                    console.error("Error on user login. ", error);
                    callback(error);
                });
        }
    }
}

export default UserRepository;

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
                const customClaims = { displayName: user.name, cpf: user.cpf, telephone_number: user.telephone_number };
                firebaseAdmin.auth().createCustomToken(userRecord.uid, customClaims).then((customToken) => {
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

    async login(user: User, acessToken: string, callback: (customToken?: string) => void) {
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
                    console.error("Error on user login. ", error);
                    callback(error);
                    console.error('Error on user accessToken login. ' + error);
                });
        } else {
            // Authentication with provided email and password
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
        }

    }

    async uploadUserPhoto(filePath: string, fileName: string, contentType: string, userUid: string, callback: any) {
        const storage = firebaseAdmin.storage().bucket();
        await storage.upload(filePath, {
            destination: fileName,
            metadata: {
                contentType: contentType
            }
        })
        .then((uploadResponse) => {
            const success = uploadResponse[0].cloudStorageURI.href;
            db.collection("Users").doc(userUid).update({
                photo_url: success
            });
            callback(null, success);
        })
        .catch((error) => {
            callback(error);
        });
    }
}

export default UserRepository;

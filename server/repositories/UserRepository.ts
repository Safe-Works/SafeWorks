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
        .catch((error) => {
            console.error("Error creating a new user. ", error);
            callback(error);
        })
    }

    get(uid: string, callback: any) {
        db.collection("Users")
            .doc(uid)
            .get()
            .then((userDoc) => {
                if (!userDoc.exists) {
                    callback(`User with uid ${uid} does not exist`, null);
                } else {
                    const userData = userDoc.data();
                    callback(null, userData);
                }
            })
            .catch((error) => {
                console.error("Error getting user from Firestore. ", error);
                callback(error, null);
            });
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
                .catch((error) => {
                    console.error("Error on user login. ", error);
                    callback(error);
                });
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
            .then(async (uploadResponse) => {
                const file = uploadResponse[0];
                const donwloadUrl = await file.getSignedUrl({
                    action: 'read',
                    expires: '12-31-2025'
                });
                db.collection("Users").doc(userUid).update({
                    photo_url: donwloadUrl
                });
                callback(null, donwloadUrl);
            })
            .catch((error) => {
                callback(error);
            });
    }

    async update(user: User, photo: any, callback: any) {
        if (photo) {
            const filePath = photo.path;
            const fileName = photo.filename;
            const contentType = photo.mimetype;
            this.uploadUserPhoto(filePath ?? "", fileName ?? "", contentType ?? "", user.uid ?? "", (error: any, success: any) => {
                if (success) {
                    console.log('Success image upload ' + success)
                } else {
                    return callback(error);
                }
            })
        }
        const { uid, email, password, name, cpf, telephone_number, username, address } = user;
        // Usando Object.fromEntries para criar um objeto sem campos vazios
        const updatedData = Object.fromEntries(
            Object.entries({
                email,
                password,
                name,
                cpf,
                telephone_number,
                username,
                address
            }).filter(([key, value]) => value !== undefined)
        );
        if (Object.keys(updatedData).length === 0) {
            // Sem campo para atualizar, retorna null
            return callback(null);
        }
        try {
            if (password) {
                await firebaseAdmin.auth().updateUser(uid ?? "", { password });
            }
            if (name) {
                await firebaseAdmin.auth().updateUser(uid ?? "", { displayName: name });
            }

            const userRecord = await firebaseAdmin.auth().getUser(uid ?? "");

            await db.collection("Users").doc(uid ?? "").update(updatedData);

            const userDoc = await db.collection("Users").doc(uid ?? "").get();
            if (!userDoc.exists) {
                callback(`User with uid ${uid} does not exist`, null);
            } else {
                const userData = userDoc.exists ? userDoc.data() : null;
                if (!userData) {
                    callback(`User with uid ${uid} does not exist or has no data`, null);
                } else {
                    const customClaims = {
                        displayName: userData.name,
                        cpf: userData.cpf,
                        telephone_number: userData.telephone_number,
                        userAuth: userRecord,
                        photo_url: userData.photo_url
                    };
                    const customToken = await firebaseAdmin.auth().createCustomToken(uid ?? "", customClaims);
                    callback(null, customToken);
                }
            }
        } catch (error) {
            console.error("Error updating user in repository. ", error);
            callback(error);
        }
    }

}

export default UserRepository;

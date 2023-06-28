import User from "../models/User";
import { db, firebaseAdmin } from "../../util/admin";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import AppRepository from "./AppRepository";
class UserRepository extends AppRepository {

    async add (user: User): Promise<any> {
        try {
            let result;
            await firebaseAdmin.auth().createUser({
                email: user.email,
                password: user.password,
                displayName: user.name,
            }).then(async (userRecord) => {
                const created = this.getDateTime();
                await db.collection("Users").doc(userRecord.uid).set({
                    email: user.email,
                    name: user.name,
                    username: null,
                    cpf: user.cpf,
                    telephone_number: user.telephone_number,
                    district: null,
                    photo_url: null,
                    balance: 0,
                    contracted_services: [],
                    worker: null,
                    created: created,
                    modified: null,
                    deleted: null
                }).then(async () => {
                    const customClaims = { displayName: user.name, cpf: user.cpf, telephone_number: user.telephone_number };
                    await firebaseAdmin.auth().createCustomToken(userRecord.uid, customClaims)
                        .then((customToken) => {
                            console.log("Successfully created a new user.", userRecord.uid);
                            result = customToken;
                        }).catch((error) => {
                            console.error("Error creating a custom token. ", error);
                            throw error;
                        });
                }).catch((error) => {
                    console.error("Error adding user to Firestore. ", error);
                    throw error;
                });
            }).catch((error) => {
                console.error("Error adding user to Authentication. ", error);
                throw error;
            });

            return result;
        } catch(error) {
            console.error("Error adding user to Authentication: ", error);
            throw error;
        }
    }

    async getById (uid: string): Promise<any> {
        try {
            db.collection("Users")
                .doc(uid)
                .get()
                .then((userDoc) => {
                    if (!userDoc.exists) {
                        return null;
                    } else {
                        return userDoc.data();
                    }
                })
                .catch((error) => {
                    console.error("Error getting user from Firestore. ", error);
                    throw error;
                });
            
        } catch (error) {
            console.error("Error getting user by id: ", error);
            throw error;
        }
    }

    async update(user: User, photo: any): Promise<any> {
        const modified = this.getDateTime();
        const { uid, email, password, name, cpf, telephone_number, username, district } = user;
        // Usando Object.fromEntries para criar um objeto sem campos vazios
        const updatedData = Object.fromEntries(
            Object.entries({
                email,
                password,
                name,
                cpf,
                telephone_number,
                username,
                district,
                modified: modified
            }).filter(([key, value]) => value !== undefined)
        );

        if (photo) {
            const filePath = photo.path;
            const contentType = photo.mimetype;
            await this.uploadUserPhoto(filePath ?? "", contentType ?? "", user.uid ?? "")
        }
        if (Object.keys(updatedData).length === 0) {
            // Sem campo para atualizar, retorna null
            return null;
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
                return `User with uid ${uid} does not exist`;
            } else {
                const userData = userDoc.exists ? userDoc.data() : null;
                if (!userData) {
                    return `User with uid ${uid} does not exist or has no data`;
                } else {
                    const customClaims = {
                        displayName: userData.name,
                        cpf: userData.cpf,
                        telephone_number: userData.telephone_number,
                        userAuth: userRecord,
                        photo_url: userData.photo_url
                    };
                    const customToken = await firebaseAdmin.auth().createCustomToken(uid ?? "", customClaims);
                    return customToken;
                }
            }
        } catch (error) {
            console.error("Error updating user in repository. ", error);
            throw error;
        }
    }

    async login (user: User, accessToken: string): Promise<any> {
        try {
            const auth = getAuth();
            let result;
            if (accessToken.length > 0) {
                // Authentication with provided JWT accessToken
                await firebaseAdmin.auth()
                    .verifyIdToken(accessToken)
                    .then((decodedToken) => {
                        console.log('Successfully user login using accessToken. ' + decodedToken.uid);
                        result = decodedToken;
                    })
                    .catch((error) => {
                        console.error('Error on user accessToken login: ' + error);
                        throw error;
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
                        result = await firebaseAdmin.auth().createCustomToken(userAuth.uid, customClaims);
                    })
                    .catch((error) => {
                        console.error("Error logging user: ", error);
                        throw error;
                    });
            }

            return result;
        } catch (error) {
            console.error("Error logging user: ", error);
            throw error;
        }
    }

    async uploadUserPhoto(filePath: string, contentType: string, userUid: string): Promise<any> {
        try {
            const storage = firebaseAdmin.storage().bucket();
            const fileName = userUid + '_profile_photo';
            const modified = this.getDateTime();
            let result;

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
                    await db.collection("Users").doc(userUid).update({
                        photo_url: donwloadUrl[0],
                        modified: modified
                    });
                    result = donwloadUrl;
                })
                .catch((error) => {
                    console.error('Error uploading user photo: ' + error);
                    throw error;
                });

            return result;
        } catch (error) {
            console.error('Error uploading user photo: ' + error);
            throw error;
        }
    }

}

export default UserRepository;

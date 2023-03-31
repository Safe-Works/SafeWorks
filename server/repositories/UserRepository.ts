import User from "../models/User";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../util/firebase";
import { db, firebaseAdmin } from "../util/admin";

class UserRepository {

    constructor() {
        initializeApp(firebaseConfig);
    }

    async add(user: User, callback: (uid?: string) => void) {
        await firebaseAdmin.auth()
            .createUser({
                email: user.email,
                password: user.password,
                displayName: user.name,
            })
            .then(async (userRecord) => {
                console.log("Successfully created a new user.", userRecord.uid);
                // Creating the user doc in firestore
                await db.collection("Users").doc(userRecord.uid).set({
                    name: user.name,
                    cpf: user.cpf,
                    telephone_number: user.telephone_number
                })
                callback(userRecord.uid);
            })
            .catch((error) => {
                console.log("Error creating a new user. ", error);
            })
    }

}

export default UserRepository;
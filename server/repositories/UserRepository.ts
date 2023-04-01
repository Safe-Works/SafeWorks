import User from "../models/User";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../util/firebase";
import { db, firebaseAdmin } from "../util/admin";

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
      
          console.log("Successfully created a new user.", userRecord.uid);
      
          await db.collection("Users").doc(userRecord.uid).set({
            name: user.name,
            cpf: user.cpf,
            telephone_number: user.telephone_number,
          });
      
          const customToken = await firebaseAdmin.auth().createCustomToken(userRecord.uid);
      
          callback(customToken);
        } catch (error) {
          console.log("Error creating a new user. ", error);
        }
      }
      
}

export default UserRepository;
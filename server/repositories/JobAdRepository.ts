import JobAdvertisement from "../models/JobAdvertisement";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../util/firebase";
import { db } from "../util/admin";
import { format } from "date-fns";

class JobAdRepository {
    constructor() {
        initializeApp(firebaseConfig);
    }
    async add(job: JobAdvertisement, callback: any) {
        try {
            const created = format(new Date(), "dd/MM/yyyy HH:mm:ss");

            const newJob = {
                ...job,
                created: created,
                expired: false
            };

            const docRef = await db.collection("JobAdvertisement").add(newJob);
            const uid = docRef.id;
            callback(null, uid);
        } catch (error) {
            console.error("Error adding job advertisement to Firestore: ", error);
            callback(error); 
        }
    }

}
export default JobAdRepository;

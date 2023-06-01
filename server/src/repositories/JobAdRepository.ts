import JobAdvertisement from "../models/JobAdvertisement";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../util/firebase";
import { db } from "../../util/admin";
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

    async findByTerm(term: string): Promise<any[]> {
        try {
            const results: any[] = [];
            const jobAdRef = db.collection("JobAdvertisement");
            const snapshotTitle = await jobAdRef
                .where('title', '>=', term)
                .where('title', '<=', term + '\uf8ff')
                .get();
            
            const snapshotCategory = await jobAdRef
                .where('category', '>=', term)
                .where('category', '<=', term + '\uf8ff')
                .get();
            
            snapshotTitle.forEach(doc => {
                results.push(doc.data());
            });

            snapshotCategory.forEach(doc => {
                if (results.length != 0) {
                    results.forEach(docResults => {
                        if (doc.data().uid != docResults) {
                            results.push(doc.data());
                        }
                    })
                } else {
                    results.push(doc.data());
                }
            });

            if (results.length === 0) {
                console.log('No matching JobAdvertisement documents.');
            }

            return results;
        } catch (error) {
            console.error('Error finding JobAdvertisement documents:', error);
            throw error;
        }
    }

}
export default JobAdRepository;

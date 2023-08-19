import AppRepository from "./AppRepository";
import { db, firebaseAdmin } from "../../util/admin";
import * as admin from 'firebase-admin';

class JobContractRepository extends AppRepository {

    async getAll(): Promise<any> {
        try {
            let jobs;
            await db.collection("JobContracts")
                .where('deleted', '==', null)
                .get()
                .then((querySnapshot) => {
                    jobs = querySnapshot.docs.map((doc) => {
                        const data = doc.data();
                        return { ...data, uid: doc.id };
                    })
                });
            
            return jobs;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getTotalJobs(): Promise<number> {
        try {
            const querySnapshot = await db.collection("JobContracts")
                .where("deleted", "==", null)
                .get();
            
            return querySnapshot.size;
        } catch (error) {
            console.error('Error retrieving total job constracts:', error);
            throw new Error('Failed to retrieve total job contracts');
        }
    }

    async getNextPage(ITEMS_PER_PAGE: number, lastDocument?: admin.firestore.QueryDocumentSnapshot): Promise<admin.firestore.QuerySnapshot> {
        let query = db.collection("JobContracts").orderBy("created").limit(ITEMS_PER_PAGE);
        query = query.where('deleted', '==', null);
        if (lastDocument) {
            query = query.startAfter(lastDocument);
        }
        const snapshot = await query.get();

        return snapshot;
    }

}

export default JobContractRepository;
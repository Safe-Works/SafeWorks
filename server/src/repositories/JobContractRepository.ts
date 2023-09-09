import AppRepository from "./AppRepository";
import { db, firebaseAdmin } from "../../util/admin";
import * as admin from 'firebase-admin';

class JobContractRepository extends AppRepository {
    async add(jobContract: JobContract): Promise<string> {
        try {
            // Verifique se o ID do cliente é igual ao ID do trabalhador
            if (jobContract.client.id === jobContract.worker.id) {
                throw new Error("Não é permitido criar um contrato entre o mesmo cliente e trabalhador.");
            }
    
            const created = this.getDateTime();
            const newJobContract = {
                ...jobContract,
                expired: false,
                created: created,
                modified: null,
                deleted: null,
                paid: true,
                status: "open"
            };
            const docRef = await db.collection("JobContracts").add(newJobContract);
            const uid = docRef.id;
    
            // Atualizar o anúncio relacionado ao contrato
            const advertisementId = jobContract.advertisement.id;
            const advertisementRef = db.collection("JobAdvertisements").doc(advertisementId);
            const advertisementDoc = await advertisementRef.get();
    
            if (advertisementDoc.exists) {
                const contractInfo = {
                    id: uid,
                    worker: {
                        name: jobContract.worker.name,
                        id: jobContract.worker.id
                    },
                    client: {
                        name: jobContract.client.name,
                        id: jobContract.client.id
                    },
                    value: jobContract.price
                };
    
                const advertisementData = advertisementDoc.data();
                const contractsArray = advertisementData?.Contracts || [];
                contractsArray.push(contractInfo);
    
                // Atualize o campo "Contracts" no documento JobAdvertisement
                await advertisementRef.update({ Contracts: contractsArray });
            }
    
            // Debite o valor do contrato da conta do cliente
            await this.updateUserBalance(jobContract.client.id, -jobContract.price);
    
            // Atualizar o cliente
            await this.updateUserContractedServices(jobContract.client.id, uid, jobContract.advertisement.title, jobContract.price);
    
            // Atualizar o trabalhador
            await this.updateWorkerSelledServices(jobContract.worker.id, uid, jobContract.advertisement.title, jobContract.price);
    
            return uid;
        } catch (error) {
            console.error("Error adding job contract to Firestore: ", error);
            throw error;
        }
    }
    
    async updateUserBalance(userId: string, amount: number) {
        const userRef = db.collection("Users").doc(userId);
        await db.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
    
            if (userDoc.exists) {
                const userData = userDoc.data();
                const currentBalance = userData?.balance || 0;
                const newBalance = currentBalance + amount;
    
                // Atualize o campo "balance" no documento do cliente
                transaction.update(userRef, { balance: newBalance });
            }
        });
    }
    
    async updateUserContractedServices(userId: string, contractId: string, advertisementTitle: string, price: number) {
        const userRef = db.collection("Users").doc(userId);
        const userDoc = await userRef.get();
    
        if (userDoc.exists) {
            const userContracts = userDoc.data()?.contracted_services || [];
    
            userContracts.push({
                id: contractId,
                advertisementTitle,
                value: price
            });
    
            // Atualize o campo "contracted_services" no documento do cliente
            await userRef.update({ contracted_services: userContracts });
        }
    }
    
    async updateWorkerSelledServices(userId: string, contractId: string, advertisementTitle: string, price: number) {
        const userRef = db.collection("Users").doc(userId);
        const userDoc = await userRef.get();
    
        if (userDoc.exists) {
            const userWorker = userDoc.data()?.worker || {};
            const workerContracts = userWorker.selled_services || [];
    
            workerContracts.push({
                id: contractId,
                advertisementTitle,
                value: price
            });
    
            // Atualize o campo "selled_services" dentro do objeto Worker no documento do trabalhador
            await userRef.update({ worker: { ...userWorker, selled_services: workerContracts } });
        }
    }
    
    
    async create(): Promise<any> {
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

    async getAll(): Promise<any> {
        try {
            let jobs;
            await db.collection("JobContracts")
                .where('deleted', '==', null)
                .orderBy('created', 'asc')
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
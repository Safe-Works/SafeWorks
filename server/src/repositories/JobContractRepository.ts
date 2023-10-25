import AppRepository from "./AppRepository";
import { db } from "../../util/admin";
import * as admin from 'firebase-admin';
import EmailNotificationModel from '../models/EmailNotificationModel';
import Favorites from "../models/Favorites";

class JobContractRepository extends AppRepository {
    async add(jobContract: JobContract): Promise<any> {
        try {
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
                paid: false,
                status: "open",
                client_finished: false,
                worker_finished: false,
                finished: null,
            };
            const docRef = await db.collection("JobContracts").add(newJobContract);
            const uid = docRef.id;

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

                await advertisementRef.update({ Contracts: contractsArray });
            }

            await this.updateUserBalance(jobContract.client.id, -jobContract.price);

            const clientContact = await this.updateUserContractedServices(jobContract.client.id, uid, jobContract.advertisement.title, jobContract.price);
            const workerContact = await this.updateWorkerSelledServices(jobContract.worker.id, uid, jobContract.advertisement.title, jobContract.price);

            const emailModel = new EmailNotificationModel();
            const clientEmailContent = emailModel.clientEmailWorkerNotification(jobContract, uid, workerContact);
            const workerEmailContent = emailModel.createEmailWorkerNotification(jobContract, uid, clientContact);

            await emailModel.sendCustomEmail(workerContact?.email, "Venda de serviço!", workerEmailContent);
            await emailModel.sendCustomEmail(clientContact?.email, "Serviço contratado!", clientEmailContent);
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
                transaction.update(userRef, { balance: newBalance });
            }
        });
    }

    async verifyUserBalance(userId: string, contractValue: number): Promise<boolean> {
        const userRef = db.collection("Users").doc(userId);
        const userDoc = await userRef.get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            const currentBalance = userData?.balance || 0;
            if (currentBalance >= contractValue) {
                return true;
            }
        }
        return false;
    }
    
    async updateUserContractedServices(userId: string, contractId: string, advertisementTitle: string, price: number) {
        const userRef = db.collection("Users").doc(userId);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
            const userData = userDoc.data();
            const userContracts = userData?.contracted_services || [];
            userContracts.push({
                id: contractId,
                advertisementTitle,
                value: price
            });

            await userRef.update({ contracted_services: userContracts });
            return {
                email: userData?.email,
                telephone_number: userData?.telephone_number
            };
        }
    }

    async updateWorkerSelledServices(userId: string, contractId: string, advertisementTitle: string, price: number) {
        const userRef = db.collection("Users").doc(userId);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
            const userData = userDoc.data();
            const userWorker = userData?.worker || {};
            const workerContracts = userWorker.selled_services || [];

            workerContracts.push({
                id: contractId,
                advertisementTitle,
                value: price
            });

            await userRef.update({ worker: { ...userWorker, selled_services: workerContracts } });
            return {
                email: userData?.email,
                telephone_number: userData?.telephone_number
            };
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

    async getAllJobsFromUserUid(userUid: string): Promise<any> {
        try {
            let jobs;
            
            await db.collection("JobContracts")
                .where('client.id', '==', userUid)
                .where('deleted', '==', null)
                .orderBy('created', 'asc')
                .get()
                .then((querySnapshot) => {
                    jobs = querySnapshot.docs.map((doc) => {
                        const data = doc.data();
                        return { ...data, uid: doc.id };
                    })
                })
                .catch((error) => {
                    console.error("Error getting Jobs from Firestore. ", error);
                    throw error;
                });

            return jobs;
        } catch (error) {
            console.error('Error retrieving jobs from User UID: ', error);
            throw error;
        }
    }

    async finishContract(jobUid: string, userType: string): Promise<any> {
        try {
            const jobRef = db.collection("JobContracts").doc(jobUid);
            const jobDoc = await jobRef.get();

            if (jobDoc.exists && jobDoc.data()?.expired === false) {
                if (userType === 'client') {
                    await jobRef.update({ client_finished: true });
                } else {
                    await jobRef.update({ worker_finished: true });
                }
                const finishedJob = (await jobRef.get()).data();
                if (finishedJob?.client_finished && finishedJob?.worker_finished) {
                    await jobRef.update({ status: 'finished', paid: true, finished: this.getDateTime() })
                }
            }

            return (await jobRef.get()).data();
        } catch (error) {
            console.error('Error finishing contract: ', error);
            throw error;
        }
    }

    async evaluateJob(evaluation: any): Promise<any> {
        try {
            console.log("cheogu na repoioty")
            console.log(evaluation)
            // const userUid = favorite.userUid;
            //
            // const userRef = db.collection("Users").doc(userUid);
            // const userDoc = (await userRef.get()).data();
            // const workers = userDoc?.favorite_list ?? [];
            //
            // const updatedFavorites = [...workers, favorite.workerUid];
            //
            // await userRef.update({
            //     "favorite_list": updatedFavorites,
            // });
            //
            // return (await userRef.get()).data();
        } catch (error) {
            console.error("Error adding new evaluation: ", error);
            throw error;
        }
    }

}

export default JobContractRepository;
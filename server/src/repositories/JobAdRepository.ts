import JobAdvertisement from "../models/JobAdvertisement";
import Worker from "../models/Worker";
import { db, firebaseAdmin } from "../../util/admin";
import * as uuid from 'uuid';
import * as admin from 'firebase-admin';
import AppRepository from "./AppRepository";
const FieldValue = admin.firestore.FieldValue;

class JobAdRepository extends AppRepository {

    async add(job: JobAdvertisement, photos: any): Promise<string> {
        try {
            const created = this.getDateTime();
            const userId = job.worker.id;
            const newJob = {
                ...job,
                expired: false,
                created: created,
                modified: null,
                deleted: null
            };

            const docRef = await db.collection("JobAdvertisements").add(newJob);
            const uid = docRef.id;

            // Atualiza usuário com os dados do Worker
            this.updateWorker(userId, job);

            if (!photos || photos.length === 0) {
                return uid;
            }
            const photoUrls = this.updateJobMedia(photos, uid);

            await db.collection("JobAdvertisements").doc(uid).update({
                media: photoUrls,
            });

            return uid;
        } catch (error) {
            console.error("Error adding job advertisement to Firestore: ", error);
            throw error; 
        }
    }

    async update(job: JobAdvertisement, photos: any): Promise<string> {
        try {
            const { displacement_fee, delivery_time, uid } = job;

            const existingJob = await db.collection("JobAdvertisements").doc(uid).get();
            const existingJobData = existingJob.data();

            const modified = this.getDateTime();

            let updatedJob = {
                ...job,
                modified: modified,
            };

            let mediaUrls: any[] = [];
            if (job.media) mediaUrls = job.media?.split(',').map((url: any) => url.trim());
            updatedJob.media = mediaUrls;

            await db.collection("JobAdvertisements").doc(uid).update(updatedJob);

            if (existingJobData) {
                if (!displacement_fee && 'displacement_fee' in existingJobData) {
                    await db.collection("JobAdvertisements").doc(uid).update({
                        displacement_fee: FieldValue.delete()
                    });
                }
                if (!delivery_time && 'delivery_time' in existingJobData) {
                    await db.collection("JobAdvertisements").doc(uid).update({
                        delivery_time: FieldValue.delete()
                    });
                }
            }

            if (!photos || photos.length === 0) {
                return uid;
            }
            const photoUrls = this.updateJobMedia(photos, uid);
            mediaUrls.forEach((url: string) => {
                if (!updatedJob.media.includes(url)) {
                    mediaUrls.splice(mediaUrls.indexOf(url), 1);
                }
            });
            updatedJob.media?.concat(photoUrls);

            await db.collection("JobAdvertisements").doc(uid).update({ media: updatedJob.media });

            return uid;
        } catch (error) {
            console.error("Error updating job advertisement in Firestore: ", error);
            throw error;
        }
    }

    async getById(uid: string): Promise<any> {
        try {
            let result;
            await db.collection("JobAdvertisements")
                .doc(uid)
                .get()
                .then((jobAdDoc) => {
                    if (!jobAdDoc.exists) {
                        result = null;
                    } else {
                        const jobAdData = jobAdDoc.data();
                        if (jobAdData?.deleted === null) {
                            result = jobAdData;
                        } else {
                            result = null;
                        }
                    }
                })
                .catch((error) => {
                    console.error("Error getting JobAdvertisement from Firestore. ", error);
                    throw error;
                })

            return result;
        } catch (error) {
            console.error('Error retrieving job by ID:', error);
            throw error;
        }
    }

    async getTotalJobs(): Promise<number> {
        try {
            const querySnapshot = await db.collection("JobAdvertisements")
                .where('deleted', '==', null)
                .get();

            return querySnapshot.size;
        } catch (error) {
            console.error('Error retrieving total jobs:', error);
            throw new Error('Failed to retrieve total jobs');
        }
    }

    async getTotalJobsByWorker(workerId: string): Promise<number> {
        try {
            const querySnapshot = await db
                .collection("JobAdvertisements")
                .where('worker.id', '==', workerId)
                .where('deleted', '==', null)
                .get();

            return querySnapshot.size;
        } catch (error) {
            console.error('Error retrieving total jobs by worker:', error);
            throw new Error('Failed to retrieve total jobs by worker');
        }
    }

    async findByTerm(term: string): Promise<any[]> {
        try {
            const results: any[] = [];
            const jobAdRef = db.collection("JobAdvertisements");
            const snapshotTitle = await jobAdRef
                .where('title', '>=', term)
                .where('title', '<=', term + '\uf8ff')
                .get();

            const snapshotCategory = await jobAdRef
                .where('category.name', '>=', term)
                .where('category.name', '<=', term + '\uf8ff')
                .get();

            snapshotTitle.forEach(doc => {
                console.log(doc.data().deleted)
                if (!doc.data().deleted) {
                    results.push(doc.data());
                }
            });

            snapshotCategory.forEach(doc => {
                if (results.length != 0) {
                    results.forEach(docResults => {
                        if (doc.data().uid != docResults && !doc.data().deleted) {
                            results.push(doc.data());
                        }
                    })
                } else {
                    if (!doc.data().deleted) {
                        results.push(doc.data());
                    }
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

    async deleteJobById(jobId: string): Promise<void> {
        try {
            const jobRef = db.collection("JobAdvertisements").doc(jobId);
            const deleted = this.getDateTime();

            await jobRef.update({
                deleted: deleted,
            });
        } catch (error) {
            console.error('Error deleting job:', error);
            throw error;
        }
    }

    async uploadJobPhoto(filePath: string, contentType: string, jobUid: string): Promise<string> {
        const storage = firebaseAdmin.storage().bucket();
        const uniqueId = uuid.v4();
        const fileName = `${jobUid}_${uniqueId}_JobAd_photo`;
        const modified = this.getDateTime();

        try {
            const [file] = await storage.upload(filePath, {
                destination: fileName,
                metadata: {
                    contentType: contentType
                }
            });

            const downloadUrls = await file.getSignedUrl({
                action: 'read',
                expires: '12-31-2025'
            });

            const downloadUrl = downloadUrls[0];

            await db.collection("JobAdvertisements").doc(jobUid).update({
                media: FieldValue.arrayUnion(downloadUrl),
                modified: modified
            });

            return downloadUrl;
        } catch (error) {
            console.error("Error uploading image: ", error);
            throw error;
        }
    }

    async updateWorker(userId: string, job: JobAdvertisement): Promise<any> {
        try {
            const userDoc = await db.collection("Users").doc(userId ?? "").get();
            const user = userDoc.data();
            const modified = this.getDateTime();

            if (!user?.worker) {
                // Se o usuário não tiver um Worker, cria um novo
                const worker: Worker = {
                    area: [job.category.name],
                };
                await db.collection("Users").doc(userId ?? "").update({ worker });
            } else {
                // Se o usuário já tiver um Worker, adiciona a nova área se não existir
                const currentAreas = user.worker.area ?? [];
                if (!currentAreas.includes(job.category.name)) {
                    const updatedWorker: Worker = {
                        ...user.worker,
                        area: [...currentAreas, job.category.name],
                    };
                    await db.collection("Users").doc(userId ?? "").update({
                        worker: updatedWorker,
                        modified: modified
                    });
                }
            }
        } catch (error) {
            console.error("Error updating user worker in repository. ", error);
            throw error;
        }
    }

    async updateJobMedia(photos: any, uid: string): Promise<Array<string>> {
        try {
            const photoUrls = [];
            for (const photo of photos) {
                const filePath = photo.path;
                const contentType = photo.mimetype;
                try {
                    const downloadUrl = await this.uploadJobPhoto(filePath ?? "", contentType ?? "", uid ?? "");
                    photoUrls.push(downloadUrl);
                } catch (error) {
                    console.error('Error uploading image: ', error);
                    throw error;
                }
            }
            return photoUrls;
        } catch (error) {
            console.error("Error updating Job media. ", error);
            throw error;
        }
    }

    // Função para obter a próxima página de documentos
    async getNextPage(ITEMS_PER_PAGE: number, lastDocument?: admin.firestore.QueryDocumentSnapshot): Promise<admin.firestore.QuerySnapshot> {
        let query = db.collection("JobAdvertisements")
            .orderBy('created')
            .limit(ITEMS_PER_PAGE);
    
        query = query.where('deleted', '==', null);
        if (lastDocument) {
            query = query.startAfter(lastDocument);
        }
        const snapshot = await query.get();
        return snapshot;
    }

    // Função para obter a próxima página de documentos por trabalhador
    async getNextPageByWorker(workerId: string, ITEMS_PER_PAGE: number, lastDocument?: admin.firestore.QueryDocumentSnapshot): Promise<admin.firestore.QuerySnapshot> {
        let query = db
            .collection("JobAdvertisements")
            .where('worker.id', '==', workerId)
            .orderBy('created')
            .limit(ITEMS_PER_PAGE);

        query = query.where('deleted', '==', null);

        if (lastDocument) {
            query = query.startAfter(lastDocument);
        }

        const snapshot = await query.get();
        return snapshot;
    }


}
export default JobAdRepository;

import JobAdvertisement from "../models/JobAdvertisement";
import Worker from "../models/Worker";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../util/firebase";
import { db, firebaseAdmin } from "../../util/admin";
import { format } from "date-fns";
import * as uuid from 'uuid';
import * as admin from 'firebase-admin';
const FieldValue = admin.firestore.FieldValue;
class JobAdRepository {

    constructor() {
        initializeApp(firebaseConfig);
    }

    async add(job: JobAdvertisement, photos: any): Promise<string> {
        try {
            const created = format(new Date(), "dd/MM/yyyy HH:mm:ss");
            const userId = job.worker.id;
            const newJob = {
                ...job,
                created: created,
                expired: false,
            };

            const docRef = await db.collection("JobAdvertisement").add(newJob);
            const uid = docRef.id;

            // Atualiza usuário com os dados do Worker
            const userDoc = await db.collection("Users").doc(userId ?? "").get();
            const user = userDoc.data();

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
                        modified: created
                    });
                }
            }

            if (photos) {
                const photoUrls = [];

                for (let i = 0; i < photos.length; i++) {
                    const photo = photos[i];
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

                await db.collection("JobAdvertisement").doc(uid).update({
                    media: photoUrls,
                });
            }

            return uid;
        } catch (error) {
            console.error("Error adding job advertisement to Firestore: ", error);
            throw error; // Lança o erro para ser capturado no bloco catch externo
        }
    }



    async uploadJobPhoto(filePath: string, contentType: string, jobUid: string): Promise<string> {
        const storage = firebaseAdmin.storage().bucket();
        const uniqueId = uuid.v4(); // Gerar um identificador único
        const fileName = `${jobUid}_${uniqueId}_JobAd_photo`;
        const modified = format(new Date(), "dd/MM/yyyy HH:mm:ss");

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

            await db.collection("JobAdvertisement").doc(jobUid).update({
                media: FieldValue.arrayUnion(downloadUrl),
                modified: modified
            });

            return downloadUrl;
        } catch (error) {
            console.error("Error uploading image: ", error);
            throw error;
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

import Portfolio from "../models/Portfolio";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../util/firebase";
import { db } from "../../util/admin";
import { format } from "date-fns";
import { firestore } from 'firebase-admin';
import Certification from "../models/Certification";


class PortfolioRepository {

    constructor() {
        initializeApp(firebaseConfig);
    }

    async add(portfolioData: Portfolio, userUid: string,  callback: any) {
        try {
            const created = format(new Date(), "dd/MM/yyyy HH:mm:ss");
            const UserUid = userUid;

            const newPortfolio = {
                created: created,
                description: portfolioData.description,
                years_experience: portfolioData.years_experience,
            };

            const portfolioDocRef = db.collection("Users")
                .doc(UserUid)
                .collection("Worker")
                .doc("PortfolioData");

            await portfolioDocRef.set({
                portfolioData: firestore.FieldValue.arrayUnion(newPortfolio)
            });
        } catch (error) {
            console.error("Error adding Portfolio to Firestore: ", error);
            callback(error);
        }
    }

    get(userUid: string, callback: any) {
        const dataDocRef = db.collection("Users")
            .doc(userUid)
            .collection("Worker")
            .doc("PortfolioData");

        const certificationsDocRef = db.collection("Users")
            .doc(userUid)
            .collection("Worker")
            .doc("Certifications");

        Promise.all([dataDocRef.get(), certificationsDocRef.get()])
            .then(([dataDoc, certificationsDoc]) => {
                if (!dataDoc.exists) {
                    callback(`Data document with uid ${userUid} does not exist`, null);
                    return;
                }

                const data = dataDoc.data();
                const certifications = certificationsDoc.exists ? certificationsDoc.data() : {};

                // Combinar as informações dos dois documentos em um único objeto
                const combinedData = { ...data, certifications };

                callback(null, combinedData);
            })
            .catch((error) => {
                console.error("Error getting Data and Certifications from Firestore: ", error);
                callback(error, null);
            });
    }


    delete(userUid: string, callback: any) {
        db.collection("Users")
            .doc(userUid).collection("Worker")
            .doc("Certifications")
            .delete()
            .then(() => {
                callback(null);
            })
            .catch((error) => {
                console.error("Error deleting portfolio from Firestore. ", error);
                callback(error);
            });
        // testar portfolios: firestore.FieldValue.delete()

    }

    // delete(userUid: string, callback: any) {
    //     const dataDocRef = db.collection("Users")
    //         .doc(userUid)
    //         .collection("Worker")
    //         .doc("Data");
    //
    //     const certificationsDocRef = db.collection("Users")
    //         .doc(userUid)
    //         .collection("Worker")
    //         .doc("Certifications");
    //
    //     Promise.all([dataDocRef.delete(), certificationsDocRef.delete()])
    //         .then(() => {
    //             callback(null);
    //         })
    //         .catch((error) => {
    //             console.error("Error deleting portfolio from Firestore. ", error);
    //             callback(error);
    //
    //         });
    // }


    async update(certification: Certification, userUid: string,  callback: any) {
        try {
            const UserUid = userUid;

            const newCertification = {
                title: certification.title,
                description: certification.description,
                issue_organization: certification.issue_organization,
                issue_date: certification.issue_date,
                certification_url: certification.certification_url
            };


            const portfolioDocRef = await db.collection("Users")
                .doc(UserUid)
                .collection("Worker")
                .doc("Certifications")

            await portfolioDocRef.set({
                certification: firestore.FieldValue.arrayUnion(newCertification)
            }, { merge: true });


            callback(null, UserUid);
        } catch (error) {
            console.error("Error updating Certifications to Firestore: ", error);
            callback(error);
        }
    }
}

export default PortfolioRepository;

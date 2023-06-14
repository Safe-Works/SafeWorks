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


    delete(userUid: string, title: string, callback: any) {
        const portfolioRef = db.collection('Users').doc(userUid).collection('Worker').doc('Certifications');

        portfolioRef.get().then((doc) => {
            if (!doc.exists) {
                console.log('Portfolio not found.');
                return;
            }

            const data = doc.data();
            if (!data) {
                console.log('Data is undefined.');
                return;
            }

            const certification = data.certification;
            const certificationIndex = certification.findIndex((certification: any) => certification.title === title);

            if (certificationIndex === -1) {
                console.log('Certification not found.');
                return;
            }

            // Remove a certificação do array
            certification.splice(certificationIndex, 1);

            // Atualiza o documento no banco de dados
            portfolioRef.set({ certification })
                .then(() => {
                    console.log('Certification deleted successfully.');
                })
                .catch((error) => {
                    console.error('Error deleting certification:', error);
                });

        }).catch((error) => {
            console.error('Error getting portfolio:', error);
        });
    }


    // deleteCertification(certificationTitle: string) {
    //     // Lógica para buscar o portfólio no banco de dados
    //     const portfolioRef = db.collection('Users').doc(userUid).collection('Worker').doc('PortfolioData');
    //
    //     portfolioRef.get().then((doc) => {
    //         if (doc.exists) {
    //             const portfolioData = doc.data();
    //             const certifications = portfolioData.certifications;
    //
    //             // Procura a certificação com o título correspondente
    //             const certificationIndex = certifications.findIndex((certification: any) => certification.title === certificationTitle);
    //
    //             if (certificationIndex !== -1) {
    //                 // Remove a certificação do array
    //                 certifications.splice(certificationIndex, 1);
    //
    //                 // Atualiza o documento no banco de dados
    //                 portfolioRef.update({ certifications })
    //                     .then(() => {
    //                         console.log('Certification deleted successfully.');
    //                     })
    //                     .catch((error) => {
    //                         console.error('Error deleting certification:', error);
    //                     });
    //             } else {
    //                 console.log('Certification not found.');
    //             }
    //         } else {
    //             console.log('Portfolio not found.');
    //         }
    //     }).catch((error) => {
    //         console.error('Error getting portfolio:', error);
    //     });
    // }


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

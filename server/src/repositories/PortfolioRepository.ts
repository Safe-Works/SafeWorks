import Portfolio from "../models/Portfolio";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../util/firebase";
import { db } from "../../util/admin";
import { format } from "date-fns";
import Certification from "../models/Certification";

class PortfolioRepository {
    constructor() {
        initializeApp(firebaseConfig);
    }

    async add(portfolio: Portfolio, userUid: string, callback: any) {
        try {
            const userRef = db.collection("Users").doc(userUid);
            const userDoc = await userRef.get();

            if (!userDoc.exists) {
                console.error("User does not exist.");
                callback("User does not exist.", null);
                return;
            }

            const userData = userDoc.data();
            const worker = userData?.worker || {};

            const newPortfolio = {
                created: format(new Date(), "dd/MM/yyyy HH:mm:ss"),
                description: portfolio.description || "",
                years_experience: portfolio.years_experience || 0,
                certifications: portfolio.certifications || [],
            };

            if (!worker.portfolio) {
                // Cria um novo portfólio
                await userRef.set(
                    {
                        worker: {
                            ...worker,
                            portfolio: newPortfolio,
                        },
                    },
                    { merge: true }
                );
            } else {
                // Atualiza o portfólio existente
                const existingCertifications = worker.portfolio.certifications || [];
                const updatedCertifications = [
                    ...existingCertifications,
                    ...newPortfolio.certifications,
                ];

                await userRef.set(
                    {
                        worker: {
                            ...worker,
                            portfolio: {
                                ...worker.portfolio,
                                ...newPortfolio,
                                certifications: updatedCertifications,
                            },
                        },
                    },
                    { merge: true }
                );
            }

            callback(null, userUid);
        } catch (error) {
            console.error("Error adding portfolio:", error);
            callback(error, null);
        }
    }

    get(userUid: string, callback: any) {
        const userRef = db.collection("Users").doc(userUid);

        userRef
            .get()
            .then((userDoc) => {
                if (!userDoc.exists) {
                    callback(`User with uid ${userUid} does not exist`, null);
                    return;
                }

                const worker = userDoc.data()?.worker;
                const portfolio = worker?.portfolio || {};
                const certifications = portfolio.certifications || [];

                const combinedData = {
                    ...portfolio,
                    certifications,
                };

                callback(null, combinedData);
            })
            .catch((error) => {
                console.error(
                    "Error getting User and Certifications from Firestore: ",
                    error
                );
                callback(error, null);
            });
    }

    delete(userUid: string, title: string, callback: any) {
        const userRef = db.collection("Users").doc(userUid);

        userRef
            .get()
            .then((doc) => {
                if (!doc.exists) {
                    console.log("User does not exist.");
                    callback("User does not exist.", null);
                    return;
                }

                const userData = doc.data();
                const workerData = userData?.worker || {};
                const portfolio = workerData.portfolio || {};
                const certifications = portfolio.certifications || [];

                // Encontra o índice da certificação com base no título
                const certificationIndex = certifications.findIndex(
                    (certification: any) => certification.title === title
                );

                if (certificationIndex === -1) {
                    console.log("Certification not found.");
                    callback("Certification not found.", null);
                    return;
                }

                // Remove a certificação do array
                certifications.splice(certificationIndex, 1);

                // Atualiza o documento no banco de dados
                userRef
                    .set(
                        {
                            worker: {
                                ...workerData,
                                portfolio: {
                                    ...portfolio,
                                    certifications: certifications,
                                },
                            },
                        },
                        { merge: true }
                    )
                    .then(() => {
                        console.log("Certification deleted successfully.");
                        callback(null, userUid);
                    })
                    .catch((error) => {
                        console.error("Error deleting certification:", error);
                        callback(error, null);
                    });
            })
            .catch((error) => {
                console.error("Error getting user data:", error);
                callback(error, null);
            });
    }

    async update(
        certification: Certification,
        userUid: string,
        callback: any
    ) {
        try {
            const userRef = db.collection("Users").doc(userUid);
            const userDoc = await userRef.get();

            if (!userDoc.exists) {
                console.error("User does not exist.");
                callback("User does not exist.", null);
                return;
            }

            const userData = userDoc.data();
            const workerData = userData?.worker || {};
            const portfolio = workerData.portfolio || {};
            const certifications = portfolio.certifications || [];

            const newCertification = {
                title: certification.title,
                description: certification.description,
                issue_organization: certification.issue_organization,
                issue_date: certification.issue_date,
                certification_url: certification.certification_url,
            };

            const updatedCertifications = [...certifications, newCertification];

            await userRef.set(
                {
                    worker: {
                        ...workerData,
                        portfolio: {
                            ...portfolio,
                            certifications: updatedCertifications,
                        },
                    },
                },
                { merge: true }
            );

            callback(null, userUid);
        } catch (error) {
            console.error("Error updating Certifications to Firestore: ", error);
            callback(error, null);
        }
    }
}

export default PortfolioRepository;

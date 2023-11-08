import Portfolio from "../models/Portfolio";
import { db } from "../../util/admin";
import Certification from "../models/Certification";
import AppRepository from "./AppRepository";

class PortfolioRepository extends AppRepository {

    async add(portfolio: Portfolio): Promise<any> {
        try {
            let result;
            const created = this.getDateTime();
            const userUid = portfolio.user_uid;
            const newPortfolio = {
                ...portfolio,
                certifications: [],
                created: created,
                modified: null,
                deleted: null
            };

            await db.collection("Portfolios").add(newPortfolio)
                .then(async (docRef) => {
                    const userRef = db.collection("Users").doc(userUid);
                    const userDoc = await userRef.get();
                    const worker = {
                        ...await userDoc.data()?.worker,
                        portfolio: docRef.id
                    }
                    await userRef.update({ worker: worker });

                    result = newPortfolio;
                })
                .catch((error) => {
                    console.error("Error adding portfolio: ", error);
                    throw error;
                });

            return result;
        } catch (error) {
            console.error("Error adding portfolio: ", error);
            throw error;
        }
    }

    async addCertification(certification: Certification, portfolioUid: string): Promise<any> {
        try {
            const modified = this.getDateTime();
            const portfolioRef = db.collection("Portfolios").doc(portfolioUid);
            const portfolio = (await portfolioRef.get()).data();
            const certifications = portfolio?.certifications ?? [];

            const newCertification = {
                id: portfolioUid + (portfolio?.certifications.length + 1),
                title: certification.title,
                description: certification.description,
                issue_organization: certification.issue_organization,
                issue_date: certification.issue_date,
                certification_url: certification.certification_url ?? null,
            };
            const updatedCertifications = [...certifications, newCertification];

            await portfolioRef.update({
                "certifications": updatedCertifications,
                "modified": modified
            });

            return (await portfolioRef.get()).data();
        } catch (error) {
            console.error("Error adding Certification on Portfolio: ", error);
            throw error;
        }
    }

    async update(portfolio: Portfolio, uid: string): Promise<any> {
        try {
            const modified = this.getDateTime();
            const updatedPortfolio = {
                ...portfolio,
                modified: modified
            };

            await db.collection("Portfolios").doc(uid).update(updatedPortfolio);

            return this.getById(uid);
        } catch (error) {
            console.error("Error updating Portfolio: ", error);
            throw error;
        }
    }

    async getById(uid: string): Promise<any> {
        try {
            let result = null;
            await db.collection("Portfolios")
                .doc(uid)
                .get()
                .then((portfolioDoc) => {
                    if (portfolioDoc.exists) {
                        const portfolioData = portfolioDoc.data();
                        if (portfolioData?.deleted === null) {
                            result = portfolioData;
                        }
                    }
                })
                .catch((error) => {
                    console.error("Error getting Portfolio from Firestore. ", error);
                    throw error;
                });

            return result;
        } catch (error) {
            console.error("Error retrieving Portfolio by ID: ", error);
            throw error;
        }
    }

    async deleteCertification(portfolioUid: string, certificationId: string) {
        try {
            const modified = this.getDateTime();
            const portfolioRef = db.collection("Portfolios").doc(portfolioUid);
            const portfolio = (await portfolioRef.get()).data();
            const certifications = portfolio?.certifications;

            const certificationIndex = certifications.findIndex(
                (certification: any) => certification.id === certificationId
            );

            if (certificationIndex === -1) {
                return null;
            }

            // Remove a certificação do array
            certifications.splice(certificationIndex, 1);

            await portfolioRef.update({
                "certifications": certifications,
                "modified": modified
            });

            return (await portfolioRef.get()).data();
        } catch (error) {
            console.error("Error deleting Certification on Portfolio: ", error);
            throw error;
        }
    }

}

export default PortfolioRepository;

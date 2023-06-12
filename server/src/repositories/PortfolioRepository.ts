import Portfolio from "../models/Portfolio";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../util/firebase";
import { db } from "../../util/admin";
import { format } from "date-fns";
import { firestore } from 'firebase-admin';


class PortfolioRepository {

    constructor() {
        initializeApp(firebaseConfig);
    }

    async add(portfolio: Portfolio, userUid: string,  callback: any) {
        try {
            //const created = format(new Date(), "dd/MM/yyyy HH:mm:ss");
            const UserUid = userUid;

            const newPortfolio = {
                created: format(new Date(), "dd/MM/yyyy HH:mm:ss"),
                description: portfolio.description,
                certifications: portfolio.certifications,
                years_experience: portfolio.years_experience,
            };

            const portfolioDocRef = db.collection("Users")
                .doc(UserUid)
                .collection("Worker")
                .doc("Portfolios");

            await portfolioDocRef.update({
                portfolios: firestore.FieldValue.arrayUnion(newPortfolio)
            });
        } catch (error) {
            console.error("Error adding Portfolio to Firestore: ", error);
            callback(error);
        }
    }


    getAll(callback: any) {
        db.collection("Portfolios")
            .get()
            .then((snapshot) => {
                const portfolios: any[] = [];
                snapshot.forEach((doc) => {
                    const portfolioData = doc.data();
                    portfolios.push(portfolioData);
                });
                callback(null, portfolios);
            })
            .catch((error) => {
                console.error("Error getting portfolios from Firestore. ", error);
                callback(error, null);
            });
    }

    get(userUid: string, callback: any) {
        db.collection("Users")
            .doc(userUid).collection("Worker")
            .doc("Portfolio")
            .get()
            .then((PortfolioDoc) => {
                if (!PortfolioDoc.exists) {
                    callback(`Portfolio with uid ${userUid} does not exist`, null);
                } else {
                    const PortfolioData = PortfolioDoc.data();
                    callback(null, PortfolioData);
                }
            })
            .catch((error) => {
                console.error("Error getting Portfolio from Firestore. ", error);
                callback(error, null);
            });
    }

    delete(userUid: string, callback: any) {
        db.collection("Users")
            .doc(userUid).collection("Worker")
            .doc("Portfolio")
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


    async update(portfolio: Portfolio, userUid: string,  callback: any) {
        try {
            const UserUid = userUid;

            const updatePortfolio = {
                description: portfolio.description,
                certifications: portfolio.certifications,
                years_experience: portfolio.years_experience,
            };

            await db.collection("Users")
                .doc(UserUid)
                .collection("Worker")
                .doc("Portfolio")
                .update(updatePortfolio);

            callback(null, UserUid);
        } catch (error) {
            console.error("Error updating Portfolio to Firestore: ", error);
            callback(error);
        }
    }
}

export default PortfolioRepository;

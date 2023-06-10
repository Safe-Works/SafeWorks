import Portfolio from "../models/Portfolio";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../util/firebase";
import { db } from "../../util/admin";
import { format } from "date-fns";

class PortfolioRepository {

    constructor() {
        initializeApp(firebaseConfig);
    }

    async add(portfolio: Portfolio, callback: any) {
        try {
            const created = format(new Date(), "dd/MM/yyyy HH:mm:ss");

            const newPortfolio = {
                created: created,
                description: portfolio.description,
                uid: portfolio.uid
            };

            const docRef = await db.collection("Portfolios").add(newPortfolio);
            const uid = docRef.id;
            callback(null, uid);
        } catch (error) {
            console.error("Error adding Portfolio to Firestore: ", error);
            callback(error);
        }
    }
    get(uid: string, callback: any) {
        db.collection("Portfolios")
            .doc(uid)
            .get()
            .then((PortfolioDoc) => {
                if (!PortfolioDoc.exists) {
                    callback(`Portfolio with uid ${uid} does not exist`, null);
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

    delete(uid: string, callback: any) {
        db.collection("Portfolios")
            .doc(uid)
            .delete()
            .then(() => {
                callback(null);
            })
            .catch((error) => {
                console.error("Error deleting portfolio from Firestore. ", error);
                callback(error);
            });
    }



}
export default PortfolioRepository;

import { db } from "../../util/admin";
import Favorites from "../models/Favorites";

class EvaluationRepository {

    async add(favorite: Favorites): Promise<any> {
        try {
            const userUid = favorite.userUid;

            const userRef = db.collection("Users").doc(userUid);
            const userDoc = (await userRef.get()).data();
            const workers = userDoc?.favorite_list ?? [];

            const updatedFavorites = [...workers, favorite.workerUid];

            await userRef.update({
                "favorite_list": updatedFavorites,
            });

            return (await userRef.get()).data();
        } catch (error) {
            console.error("Error adding new favorite: ", error);
            throw error;
        }
    }

    async getById(uid: string): Promise<any> {
        let result = null;
        try {
            const userDoc = await db.collection("Users").doc(uid).get();

            if (userDoc.exists) {
                const userData = userDoc.data();
                if (userData?.deleted === null && userData?.favorite_list) {
                    return userData.favorite_list;
                }
            }

            return result;
        } catch (error) {
            console.error("Error retrieving Favorites by ID: ", error);
            throw error;
        }
    }

    async delete(userUid: string, workerUid: string) {
        try {
            const favoriteRef = db.collection("Users").doc(userUid);
            const favorite = (await favoriteRef.get()).data();
            const favorites = favorite?.favorite_list;

            const favoriteIndex = favorites.indexOf(workerUid);

            if (favoriteIndex === -1) {
                return null;
            }

            favorites.splice(favoriteIndex, 1);

            await favoriteRef.update({
                "favorite_list": favorites,
            });

            return (await favoriteRef.get()).data();

        } catch (error) {
            console.error("Error deleting Favorite on Favorites: ", error);
            throw error;
        }
    }
}
export default EvaluationRepository
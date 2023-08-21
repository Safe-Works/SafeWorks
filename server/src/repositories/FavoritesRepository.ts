import {db} from "../../util/admin";
import Favorites from "../models/Favorites";

class FavoritesRepository {

    async add(favorite: Favorites): Promise<any> {
        try {
            const userUid = favorite.userUid;

            const userRef = db.collection("Users").doc(userUid);
            const userDoc = (await userRef.get()).data();
            const workers = userDoc?.workerUid ?? [];

            const updatedFavorites = [...workers, favorite.workerUid];

            await userRef.update({
                "workerUid": updatedFavorites,
            });

            return (await userRef.get()).data();
        } catch (error) {
            console.error("Error adding new favorite: ", error);
            throw error;
        }
    }
}
export default FavoritesRepository
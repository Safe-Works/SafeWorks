import {Request, Response} from "express";
import Favorites from "../models/Favorites";
import FavoritesRepository from "../repositories/FavoritesRepository";

const favoritesRepository = new FavoritesRepository();

class FavoritesController {
    async add(req: Request, res: Response): Promise<void> {
        try {

            const favorite: Favorites = req.body;
            const result = await favoritesRepository.add(favorite);

            res.status(201).json({ statusCode: 201, favorite: result });
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error to add favorite: ", error.message);
                res.status(500).json({ statusCode: 500, error: 'favorite/failed-add', message: error.message });
            }
        }
    }
}
export default FavoritesController;
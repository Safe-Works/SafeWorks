import {Request, Response} from "express";
import Favorites from "../models/Favorites";
import EvaluationRepository from "../repositories/EvaluationRepository";
import {Console} from "inspector";

const evaluationRepository = new EvaluationRepository();

class EvaluationController {
    async add(req: Request, res: Response): Promise<void> {
        try {

            const evaluation = req.body;
            console.log(evaluation)
            //const result = await evaluationRepository.add(evaluation);
            const result = "oi";

            res.status(201).json({ statusCode: 201, favorite: result });
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error to add favorite: ", error.message);
                res.status(500).json({ statusCode: 500, error: 'favorite/failed-add', message: error.message });
            }
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const favoriteId = req.params.uid;
            const favorite = await evaluationRepository.getById(favoriteId);

            if (favorite) {
                res.status(200).json({ statusCode: 200, favorite: favorite });
            } else {
                res.status(404).json({ statusCode: 404, error: 'favorite/not-found' });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error to get Favorite by id:', error.message);
                res.status(500).json({ statusCode: 500, error: 'favorite/failed-get', message: error.message });
            }
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const userUid = req.params.userUid;
            const workerUid = req.params.workerUid
            const user = await evaluationRepository.getById(userUid);
            if (user) {
                const result = await evaluationRepository.delete(userUid, workerUid);
                if (result) {
                    res.status(200).json({ statusCode: 200, favorite: result, message: 'Favorite deleted successfully from Favorites.' });
                } else {
                    res.status(404).json({ statusCode: 404, error: 'favorite/not-found' });
                }
            } else {
                res.status(404).json({ statusCode: 404, error: 'favorite/not-found' });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error to deleted Favorite from Favorites: ', error.message);
                res.status(500).json({ statusCode: 500, error: 'favorite/failed-deleteFavorite', message: error.message })
            }
        }
    }
}
export default EvaluationController;
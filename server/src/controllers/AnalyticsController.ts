import { Request, Response } from "express";
import AnalyticsRepository from "../repositories/AnalyticsRepository";

const analysticsRepository = new AnalyticsRepository();

class AnalyticsController {

    async getAllJobAds(req: Request, res: Response): Promise<void> {
        try {
            const jobAds = await analysticsRepository.getAllJobAds();
            if (jobAds) {
                res.status(200).json({ statusCode: 200, jobs: jobAds });
            } else {
                res.status(404).json({ statusCode: 404, error: 'analytics/not-found-getAllJobAds' });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error get all job advertisements on analytics: ", error.message);
                res.status(500).json({ statusCode: 500, error: 'analytics/failed-getAllJobAds', message: error.message })
            }
        }
    };

    async getAllJobs(req: Request, res: Response): Promise<void> {
        try {
            const jobs = await analysticsRepository.getAllJobs();
            if (jobs) {
                res.status(200).json({ statusCode: 200, jobs: jobs });
            } else {
                res.status(404).json({ statusCode: 404, error: 'analytics/not-found-getAllJobs' });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error get all job contracts on analytics: ", error.message);
                res.status(500).json({ statusCode: 500, error: 'analytics/failed-getAllJobs', message: error.message })
            }
        }
    };

    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await analysticsRepository.getAllUsers();
            if (users) {
                res.status(200).json({ statusCode: 200, users: users });
            } else {
                res.status(404).json({ statusCode: 404, error: 'analytics/not-found-getAllUsers' });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error get all users on analytics: ", error.message);
                res.status(500).json({ statusCode: 500, error: 'analytics/failed-getAllUsers', message: error.message })
            }
        }
    };

}

export default AnalyticsController;
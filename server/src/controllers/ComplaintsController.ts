import { Request, Response } from "express";
import ComplaintsRepository from "../repositories/ComplaintsRepository";

const complaintsRepository = new ComplaintsRepository();

class ComplaintsController {

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const complaints = await complaintsRepository.getAll();
            if (complaints) {
                res.status(200).json({ statusCode: 200, complaints: complaints });
            } else {
                res.status(404).json({ statusCode: 404, error: "comaplaints/not-found" });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error to get all complaints: ", error.message);
                res.status(500).json({
                    statusCode: 500,
                    error: "comaplaints/failed-getAll",
                    message: error.message,
                });
            }
        }
    }

    async updateStatus(req: Request, res: Response): Promise<void> {
        try {
            const complaintUid = req.params.uid;
            const status = req.body.status;
            const complaints = await complaintsRepository.updateStatus(complaintUid, status);
            if (complaints) {
                res.status(200).json({ statusCode: 200, complaints: complaints });
            } else {
                res.status(404).json({ statusCode: 404, error: 'complaint/not-found' });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error to start analysis of complaint: ", error.message);
                res.status(500).json({
                    statusCode: 500,
                    error: "comaplaints/failed-updateStatus",
                    message: error.message,
                });
            }
        }
    }

}

export default ComplaintsController;
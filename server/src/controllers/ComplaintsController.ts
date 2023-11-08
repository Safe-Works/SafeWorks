import { Request, Response } from "express";
import ComplaintsRepository from "../repositories/ComplaintsRepository";

const complaintsRepository = new ComplaintsRepository();

class ComplaintsController {

    async add(req: Request, res: Response): Promise<void> {
        try {
            const complaint = req.body;
            const result = await complaintsRepository.add(complaint);

            res.status(201).json({ statusCode: 201, evaluation: result });
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error to add complaint: ", error.message);
                res.status(500).json({ statusCode: 500, error: 'complaint/failed-add', message: error.message });
            }
        }
    }

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
            const body = req.body;
            const complaints = await complaintsRepository.updateStatus(complaintUid, body);
            if (complaints) {
                res.status(200).json({ statusCode: 200, complaints: complaints });
            } else {
                res.status(404).json({ statusCode: 404, error: 'complaint/not-found' });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error to update complaint status: ", error.message);
                res.status(500).json({
                    statusCode: 500,
                    error: "comaplaints/failed-updateStatus",
                    message: error.message,
                });
            }
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const complaintUid = req.params.uid;
            const result = await complaintsRepository.delete(complaintUid);

            if (result) {
                res.status(200).json({ statusCode: 200, complaints: result });
            } else {
                res.status(404).json({ statusCode: 404, error: 'complaint/not-found' });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error to delete complaint: ", error.message);
                res.status(500).json({
                    statusCode: 500,
                    error: "comaplaints/failed-delete",
                    message: error.message,
                });
            }
        }
    }

}

export default ComplaintsController;
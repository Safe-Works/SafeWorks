import { Request, Response } from "express";
import JobContractRepository from "../repositories/JobContractRepository";
import * as admin from "firebase-admin";
import CheckoutModel from "../models/CheckoutModel";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

const jobContractRepository = new JobContractRepository();

interface PaginatedResponse {
  jobs: any[];
  total: number;
  currentPage: number;
}
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || "",
});
class JobContractController {
  async add(req: Request, res: Response): Promise<void> {
    /*
            #swagger.start
            #swagger.path = '/jobcontracts'
            #swagger.method = 'post'
            #swagger.description = 'Endpoint to add a new Job Contract'
            #swagger.produces = ["application/json"]
            #swagger.tags = ['JobContract']
        */
    try {
      /*
                #swagger.parameters['jobContract'] = {
                    in: 'body',
                    description: 'JobContract data to add',
                    required: true,
                    schema: { $ref: "#/definitions/AddJobContract" }
                }
            */
      const jobContract: JobContract = req.body;
      const hasSufficientBalance =
        jobContract.paid === true
          ? await jobContractRepository.verifyUserBalance(
              jobContract.client.id,
              jobContract.price * jobContract.quantity || 1
            )
          : true;
      if (!hasSufficientBalance) {
        res.status(402).json({
          statusCode: 402,
          error: "jobContract/insufficient-balance",
          message: "Você não possui saldo suficiente",
        });
        return;
      }

      const result = await jobContractRepository.add(jobContract, jobContract.external_payment);
      /* 
        #swagger.responses[201] = { 
            schema: { $ref: "#/definitions/CreatedJobContract" },
            description: 'Created JobContract UID' 
        } 
      */
      res.status(201).json({ statusCode: 201, jobAd: result });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error to add job contract: ", error.message);
        res.status(500).json({
          statusCode: 500,
          error: "jobContract/failed-add",
          message: error.message,
        });
      }
    }
    // #swagger.end
  }

  async checkout(req: Request, res: Response): Promise<void> {
    const checkout: CheckoutModel = req.body;
    const URL = "https://safe-works.azurewebsites.net/#";
    const URL_NOTIFY =
      "https://safeworks-server.vercel.app";
    try {
      const preference = new Preference(client);
      const response = await preference.create({
        body: {
          items: [
            {
              id: checkout.id,
              title: checkout.title,
              quantity: checkout.quantity,
              unit_price: checkout.price,
              picture_url: checkout.picture_url,
            },
          ],
          auto_return: "approved",
          back_urls: {
            success: `${URL}/contracts`,
            failure: `${URL}/contracts`,
          },
          notification_url: `${URL_NOTIFY}/api/jobs/notify`,
        },
      });

      // Retorna a resposta para o cliente
      res.status(200).json(response);
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          "Erro ao adicionar contrato de trabalho: ",
          error.message
        );
        res.status(500).json({
          statusCode: 500,
          error: "jobContract/failed-add",
          message: error.message,
        });
      }
    }
  }

  async notify(req: Request, res: Response): Promise<void> {
    const { query } = req;
    const topic = query.topic || query.type;
    const payment = new Payment(client);

    try {
      if (topic === "payment") {
        const paymentId = query.id || query["data.id"];
        const paymentInfo = await payment.get({
          id: Number(paymentId),
        });
        if (
          paymentInfo.status === "approved" &&
          paymentInfo.additional_info?.items
        ) {
          const contractId = paymentInfo.additional_info.items[0].id;
          const jobContract = await jobContractRepository.getById(contractId);
          if (!jobContract.paid && jobContract.status === "pending") {
            const responseUpdateContract = await jobContractRepository.update(
              jobContract.uid,
              {
                paid: true,
                payment_id: paymentId as string,
                status: "open",
                payment_status: paymentInfo.status,
              }
            );

            if (responseUpdateContract.statusCode === 201) {
              res.status(201).json({ statusCode: 201, message: "success" });
              return;
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Erro ao gerenciar pagamento: ", error.message);
        res.status(500).json({
          statusCode: 500,
          error: "jobContract/failed-add",
          message: error.message,
        });
      }
    }

    // Se não houver correspondência ou algum erro, retornar uma resposta padrão
    res.status(200).json({ statusCode: 200, message: "success" });
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const jobs = await jobContractRepository.getAll();
      if (jobs) {
        res.status(200).json({ statusCode: 200, jobs: jobs });
      } else {
        res
          .status(404)
          .json({ statusCode: 404, error: "jobContract/not-found" });
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error to get all job contracts: ", error.message);
        res.status(500).json({
          statusCode: 500,
          error: "jobContract/failed-getAll",
          message: error.message,
        });
      }
    }
  }

  async getAllPaginate(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const itemsPerPage = parseInt(req.query.limit as string) || 10;
      let lastDocument: admin.firestore.QueryDocumentSnapshot | undefined =
        undefined;
      // Caso não seja a primeira página, obtem o último documento da página anterior
      if (page > 1) {
        const previousPageSnapshot = await jobContractRepository.getNextPage(
          itemsPerPage,
          lastDocument
        );
        const previousDocuments = previousPageSnapshot.docs;
        const totalDocuments = previousDocuments.length;
        if (totalDocuments >= itemsPerPage) {
          lastDocument = previousDocuments[totalDocuments - 1];
        }
      }
      const totalJobsSnapshot = await jobContractRepository.getTotalJobs();
      // Obtem a página atual
      const currentPageSnapshot = await jobContractRepository.getNextPage(
        itemsPerPage,
        lastDocument
      );

      const jobs = currentPageSnapshot.docs.map((doc) => {
        const data = doc.data();
        return { ...data, uid: doc.id };
      });
      const total = totalJobsSnapshot;
      const response: PaginatedResponse = {
        jobs,
        total,
        currentPage: page,
      };

      res.status(200).json(response);
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          "Error to get all paginated job contracts: ",
          error.message
        );
        res.status(500).json({
          statusCode: 500,
          error: "jobContract/failed-getAllPaginate",
          message: error.message,
        });
      }
    }
  }

  async getAllJobsFromClient(req: Request, res: Response): Promise<void> {
    try {
      const clientUid = req.params.uid;
      const jobs = await jobContractRepository.getAllJobsFromClient(clientUid);
      if (jobs) {
        res.status(200).json({ statusCode: 200, jobs: jobs });
      } else {
        res
          .status(404)
          .json({ statusCode: 404, error: "jobContract/not-found" });
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error to get all Jobs from User UID: ", error.message);
        res.status(500).json({
          statusCode: 500,
          error: "jobContract/failed-getAllFromClient",
          message: error.message,
        });
      }
    }
  }

  async getAllJobsFromWorker(req: Request, res: Response): Promise<void> {
    try {
      const workerUid = req.params.uid;
      const jobs = await jobContractRepository.getAllJobsFromWorker(workerUid);
      if (jobs) {
        res.status(200).json({ statusCode: 200, jobs: jobs });
      } else {
        res
          .status(404)
          .json({ statusCode: 404, error: "jobContract/not-found" });
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error to get all Jobs from User UID: ", error.message);
        res.status(500).json({
          statusCode: 500,
          error: "jobContract/failed-getAllFromWorker",
          message: error.message,
        });
      }
    }
  }

    async finishContract(req: Request, res: Response): Promise<void> {
        try {
            const jobUid = req.params.uid;
            const userType = req.params.user_type;
            const jobs = await jobContractRepository.finishContract(jobUid, userType);
            if (jobs) {
                res.status(200).json({ statusCode: 200, jobs: jobs });
            } else {
                res.status(404).json({ statusCode: 404, error: 'jobContract/not-found' });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error to finish the contract: ', error.message);
                res.status(500).json({ statusCode: 500, error: 'jobContract/failed-finishContract', message: error.message })
            }
        }
    }

    async evaluateJob(req: Request, res: Response): Promise<void> {
        try {
            const evaluation = req.body;
            const result = await jobContractRepository.evaluateJob(evaluation);

            res.status(201).json({ statusCode: 201, evaluation: result });
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error to evaluate Job: ", error.message);
                res.status(500).json({ statusCode: 500, error: 'evalateJob/failed-add', message: error.message });
            }
        }
    }

  async saveComplaints(req: Request, res: Response): Promise<void> {
    try {
      const complaint = req.body;
      const result = await jobContractRepository.saveComplaints(complaint);

      res.status(201).json({ statusCode: 201, evaluation: result });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error to report Job: ", error.message);
        res.status(500).json({ statusCode: 500, error: 'complaint/failed-add', message: error.message });
      }
    }
  }

  async deleteComplaints(req: Request, res: Response): Promise<void> {
    try {
      const contractUid = req.params.uid;
      const result = await jobContractRepository.deleteComplaints(contractUid);

      res.status(201).json({ statusCode: 201, evaluation: result });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error to delete Complaint: ", error.message);
        res.status(500).json({ statusCode: 500, error: 'complaint/failed-delete', message: error.message });
      }
    }
  }
}

export default JobContractController;

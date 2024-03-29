import AppRepository from "./AppRepository";
import { db } from "../../util/admin";
import * as admin from "firebase-admin";
import EmailNotificationModel from "../models/EmailNotificationModel";
import UserRepository from "./UserRepository";

class JobContractRepository extends AppRepository {
  async add(
    jobContract: JobContract,
    external_payment?: boolean
  ): Promise<any> {
    try {
      if (jobContract.client.id === jobContract.worker.id) {
        throw new Error(
          "Não é permitido criar um contrato entre o mesmo cliente e trabalhador."
        );
      }

      const created = this.getDateTime();
      const newJobContract = {
        ...jobContract,
        expired: false,
        created: created,
        modified: null,
        deleted: null,
        paid: jobContract.paid,
        status: jobContract.paid ? "open" : "pending",
        client_finished: false,
        worker_finished: false,
        finished: null,
      };
      if (newJobContract?.quantity && newJobContract.quantity > 0) {
        newJobContract.price = newJobContract.price * newJobContract.quantity;
      }
      const docRef = await db.collection("JobContracts").add(newJobContract);
      const uid = docRef.id;
      const advertisementId = newJobContract.advertisement.id;
      const advertisementRef = db
        .collection("JobAdvertisements")
        .doc(advertisementId);
      const advertisementDoc = await advertisementRef.get();

      if (advertisementDoc.exists) {
        const contractInfo = {
          id: uid,
          worker: {
            name: newJobContract.worker.name,
            id: newJobContract.worker.id,
          },
          client: {
            name: newJobContract.client.name,
            id: newJobContract.client.id,
          },
          value: newJobContract.price,
        };

        const advertisementData = advertisementDoc.data();
        const contractsArray = advertisementData?.Contracts || [];
        contractsArray.push(contractInfo);

        await advertisementRef.update({ Contracts: contractsArray });
      }
      if (!external_payment) {
        await this.updateUserBalance(
          newJobContract.client.id,
          -newJobContract.price
        );
        const clientContact = await this.updateUserContractedServices(
          newJobContract.client.id,
          uid,
          newJobContract.advertisement.title,
          newJobContract.price
        );
        const workerContact = await this.updateWorkerSelledServices(
          newJobContract.worker.id,
          uid,
          newJobContract.advertisement.title,
          newJobContract.price
        );
        const emailModel = new EmailNotificationModel();
        const clientEmailContent = emailModel.createEmailClientNotification(
          newJobContract,
          uid,
          workerContact
        );
        const workerEmailContent = emailModel.createEmailWorkerNotification(
          newJobContract,
          uid,
          clientContact
        );

        await emailModel.sendCustomEmail(
          workerContact?.email,
          "Venda de serviço!",
          workerEmailContent
        );
        await emailModel.sendCustomEmail(
          clientContact?.email,
          "Serviço contratado!",
          clientEmailContent
        );
      }
      return uid;
    } catch (error) {
      console.error("Error adding job contract to Firestore: ", error);
      throw error;
    }
  }

  async update(
    jobContractId: string,
    updatedData: Partial<JobContract>
  ): Promise<any> {
    try {
      const jobContractRef = db.collection("JobContracts").doc(jobContractId);
      const jobContractDoc = await jobContractRef.get();
      if (jobContractDoc.exists) {
        const existingData = jobContractDoc.data() as JobContract;

        // Atualiza apenas as propriedades fornecidas
        const updatedContract: JobContract = {
          ...existingData,
          ...updatedData,
          modified: this.getDateTime(),
        };

        // Atualiza o documento no Firestore
        await jobContractRef.update(updatedContract);

        // Se a propriedade 'paid' for atualizada, atualiza o status
        if (updatedData.paid !== undefined) {
          const newStatus = updatedData.paid ? "open" : "pending";
          await jobContractRef.update({ status: newStatus });
          if (updatedData.paid) {
            const clientContact = await this.updateUserContractedServices(
              updatedContract.client.id,
              jobContractId,
              updatedContract.advertisement.title,
              updatedContract.price
            );
            const workerContact = await this.updateWorkerSelledServices(
              updatedContract.worker.id,
              jobContractId,
              updatedContract.advertisement.title,
              updatedContract.price
            );
            const emailModel = new EmailNotificationModel();
            const clientEmailContent = emailModel.createEmailClientNotification(
              updatedContract,
              jobContractId,
              workerContact
            );
            const workerEmailContent = emailModel.createEmailWorkerNotification(
              updatedContract,
              jobContractId,
              clientContact
            );

            await emailModel.sendCustomEmail(
              workerContact?.email,
              "Venda de serviço!",
              workerEmailContent
            );
            await emailModel.sendCustomEmail(
              clientContact?.email,
              "Serviço contratado!",
              clientEmailContent
            );
          }
        }

        return { statusCode: 201 };
      } else {
        throw new Error(
          `Contrato de trabalho com ID ${jobContractId} não encontrado.`
        );
      }
    } catch (error) {
      console.error(
        "Erro ao atualizar o contrato de trabalho no Firestore: ",
        error
      );
      throw error;
    }
  }

  async updateUserBalance(userId: string, amount: number) {
    const userRef = db.collection("Users").doc(userId);
    await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);

      if (userDoc.exists) {
        const userData = userDoc.data();
        const currentBalance = userData?.balance || 0;
        const newBalance = currentBalance + amount;
        transaction.update(userRef, { balance: newBalance });
      }
    });
  }

  async verifyUserBalance(
    userId: string,
    contractValue: number
  ): Promise<boolean> {
    const userRef = db.collection("Users").doc(userId);
    const userDoc = await userRef.get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      const currentBalance = userData?.balance || 0;
      if (currentBalance >= contractValue) {
        return true;
      }
    }
    return false;
  }

  async updateUserContractedServices(
    userId: string,
    contractId: string,
    advertisementTitle: string,
    price: number
  ) {
    const userRef = db.collection("Users").doc(userId);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      const userData = userDoc.data();
      const userContracts = userData?.contracted_services || [];
      userContracts.push({
        id: contractId,
        advertisementTitle,
        value: price,
      });

      await userRef.update({ contracted_services: userContracts });
      return {
        email: userData?.email,
        telephone_number: userData?.telephone_number,
      };
    }
  }

  async updateWorkerSelledServices(
    userId: string,
    contractId: string,
    advertisementTitle: string,
    price: number
  ) {
    const userRef = db.collection("Users").doc(userId);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      const userData = userDoc.data();
      const userWorker = userData?.worker || {};
      const workerContracts = userWorker.selled_services || [];

      workerContracts.push({
        id: contractId,
        advertisementTitle,
        value: price,
      });

      await userRef.update({
        worker: { ...userWorker, selled_services: workerContracts },
      });
      return {
        email: userData?.email,
        telephone_number: userData?.telephone_number,
      };
    }
  }

  async create(): Promise<any> {
    try {
      let jobs;
      await db
        .collection("JobContracts")
        .where("deleted", "==", null)
        .get()
        .then((querySnapshot) => {
          jobs = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return { ...data, uid: doc.id };
          });
        });

      return jobs;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAll(): Promise<any> {
    try {
      let jobs;
      await db
        .collection("JobContracts")
        .where("deleted", "==", null)
        .orderBy("created", "asc")
        .get()
        .then((querySnapshot) => {
          jobs = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return { ...data, uid: doc.id };
          });
        });

      return jobs;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getById(id: string): Promise<any> {
    try {
      const docRef = db.collection("JobContracts").doc(id);
      const doc = await docRef.get();

      if (doc.exists) {
        const data = doc.data();
        return { ...data, uid: doc.id };
      } else {
        // Caso o documento não exista
        return null;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getTotalJobs(): Promise<number> {
    try {
      const querySnapshot = await db
        .collection("JobContracts")
        .where("deleted", "==", null)
        .get();

      return querySnapshot.size;
    } catch (error) {
      console.error("Error retrieving total job constracts:", error);
      throw new Error("Failed to retrieve total job contracts");
    }
  }

  async getNextPage(
    ITEMS_PER_PAGE: number,
    lastDocument?: admin.firestore.QueryDocumentSnapshot
  ): Promise<admin.firestore.QuerySnapshot> {
    let query = db
      .collection("JobContracts")
      .orderBy("created")
      .limit(ITEMS_PER_PAGE);
    query = query.where("deleted", "==", null);
    if (lastDocument) {
      query = query.startAfter(lastDocument);
    }
    const snapshot = await query.get();

    return snapshot;
  }

  async getAllJobsFromClient(clientUid: string): Promise<any> {
    try {
      const jobs = [];
      const jobContracts = db.collection("JobContracts");
      const complaints = db.collection("Complaints");
      const query = jobContracts
        .where("client.id", "==", clientUid)
        .where("deleted", "==", null)
        .orderBy("created", "asc")
        .get();
      const querySnapshot = await query;

      for (const doc of querySnapshot.docs) {
        const jobContractData = doc.data();

        if (jobContractData.complaint_uid) {
          const complaintRef = complaints.doc(jobContractData.complaint_uid);
          const complaintSnapshot = await complaintRef.get();
          const complaintData = complaintSnapshot.data();

          // Create a new Job object with the JobContract and Complaint data
          const job = {
            ...jobContractData,
            complaint: {
              uid: jobContractData.complaint_uid,
              ...complaintData
            },
            uid: doc.id,
          };
          jobs.push(job);
        } else {
          const job = {
            ...jobContractData,
            uid: doc.id,
          };
          jobs.push(job);
        }
      }

      return jobs;
    } catch (error) {
      console.error("Error retrieving jobs from User UID: ", error);
      throw error;
    }
  }

  async getAllJobsFromWorker(workerUid: string): Promise<any> {
    try {
      const jobs = [];
      const jobContracts = db.collection("JobContracts");
      const complaints = db.collection("Complaints");
      const query = jobContracts
        .where("worker.id", "==", workerUid)
        .where("deleted", "==", null)
        .orderBy("created", "asc")
        .get();
      const querySnapshot = await query;

      for (const doc of querySnapshot.docs) {
        const jobContractData = doc.data();

        if (jobContractData.complaint_uid) {
          const complaintRef = complaints.doc(jobContractData.complaint_uid);
          const complaintSnapshot = await complaintRef.get();
          const complaintData = complaintSnapshot.data();

          if (complaintData?.deleted) {
            const job = {
              ...jobContractData,
              uid: doc.id,
            };
            jobs.push(job);
          } else {
            // Create a new Job object with the JobContract and Complaint data
            const job = {
              ...jobContractData,
              complaint: {
                uid: jobContractData.complaint_uid,
                ...complaintData
              },
              uid: doc.id,
            };
            jobs.push(job);
          }
        } else {
          const job = {
            ...jobContractData,
            uid: doc.id,
          };
          jobs.push(job);
        }
      }

      return jobs;
    } catch (error) {
      console.error("Error retrieving jobs from Worker: ", error);
      throw error;
    }
  }

  async finishContract(jobUid: string, userType: string): Promise<any> {
    try {
      const jobRef = db.collection("JobContracts").doc(jobUid);
      const jobDoc = await jobRef.get();
      const jobData = jobDoc.data();
      let userUid;

      if (jobDoc.exists && jobDoc.data()?.expired === false) {
        if (userType === "client") {
          userUid = jobData?.client.id;
          await jobRef.update({ client_finished: true });
        }
        if (userType === "worker") {
          userUid = jobData?.worker.id;
          await jobRef.update({ worker_finished: true });
        }
        const finishedJob = (await jobRef.get()).data();
        await this.sendEmailFinishedContract(jobUid, finishedJob, userType);
        if (finishedJob?.client_finished && finishedJob?.worker_finished) {
          await jobRef.update({
            status: "finished",
            paid: true,
            finished: this.getDateTime(),
          });
          await this.transferPaymentToWorker(jobDoc.data());
        }
        if (userType === "client") {
          return this.getAllJobsFromClient(userUid);
        }
        if (userType === "worker") {
          return this.getAllJobsFromWorker(userUid);
        }
      } else {
        return "expired";
      }
    } catch (error) {
      console.error("Error finishing contract: ", error);
      throw error;
    }
  }

  async finishContractWithComplaint(jobUid: string): Promise<any> {
    try {
      const jobRef = db.collection("JobContracts").doc(jobUid);
      const jobDoc = await jobRef.get();

      if (jobDoc.exists && jobDoc.data()?.expired === false) {
        await jobRef.update({ status: 'finished', paid: true, client_finished: true, worker_finished: true, finished: this.getDateTime() });
      }
    } catch (error) {
      console.error('Error finishing contract with complaint: ', error);
      throw error;
    }
  }

  async transferPaymentToWorker(job: any): Promise<any> {
    try {
      const workerRef = db.collection("Users").doc(job.worker.id);
      const workerDoc = await workerRef.get();
      const workerData = workerDoc.data();

      if (workerDoc.exists) {
        const totalBalance = workerData?.balance + job.price;
        await workerRef.update({
          balance: totalBalance,
          modified: this.getDateTime(),
        });
      }
    } catch (error) {
      console.error("Error to transfer payment to worker: ", error);
      throw error;
    }
  }

  async sendEmailFinishedContract(
    jobUid: string,
    jobData: any,
    userType: string
  ): Promise<any> {
    try {
      const emailModel = new EmailNotificationModel();
      const userRepository = new UserRepository();
      const workerData = await userRepository.getById(jobData.worker.id);
      const clientData = await userRepository.getById(jobData.client.id);

      if (userType === "client") {
        const clientEmailContent = emailModel.clientFinishedContractToWorker(
          jobData,
          jobUid
        );
        await emailModel.sendCustomEmail(
          workerData?.email,
          "Cliente finalizou o contrato.",
          clientEmailContent
        );
      }
      if (userType === "worker") {
        const workerEmailContent = emailModel.workerFinishedContractToClient(
          jobData,
          jobUid
        );
        await emailModel.sendCustomEmail(
          clientData?.email,
          "Trabalhador finalizou o contrato.",
          workerEmailContent
        );
        if (jobData?.client_finished && jobData?.worker_finished) {
          const finishedEmailContent = emailModel.finishedContract(
            jobData,
            jobUid
          );
          await emailModel.sendCustomEmail(
            workerData?.email,
            "Contrato finalizado!",
            finishedEmailContent
          );
        }
      }
    } catch (error) {
      console.error("Error to send finished contract email: ", error);
      throw error;
    }
  }

  async evaluateJob(evaluation: any): Promise<any> {
    try {
      const evaluationNumber = evaluation.evaluation;
      const contractUid = evaluation.contractUid;

      const evaluationData = {
        evaluation: evaluationNumber
      };

      const contractRef = db.collection("JobContracts").doc(contractUid);

      await contractRef.update(evaluationData);

    } catch (error) {
      console.error("Error adding new evaluation: ", error);
      throw error;
    }
  }

  async updateStatus(contractUid: any, status: string, complaintUid: string) {
    try {
      const jobContractRef = db.collection("JobContracts").doc(contractUid);
      const jobContractDoc = await jobContractRef.get();
      if (jobContractDoc.exists) {
        await jobContractRef.update({ status: status, complaint_uid: complaintUid });
      }
    } catch (error) {
      console.error("Error on update reported contract': ", error);
      throw error;
    }
  }
}

export default JobContractRepository;

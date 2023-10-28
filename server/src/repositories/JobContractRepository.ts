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
      const docRef = await db.collection("JobContracts").add(newJobContract);
      const uid = docRef.id;

      const advertisementId = jobContract.advertisement.id;
      const advertisementRef = db
        .collection("JobAdvertisements")
        .doc(advertisementId);
      const advertisementDoc = await advertisementRef.get();

      if (advertisementDoc.exists) {
        const contractInfo = {
          id: uid,
          worker: {
            name: jobContract.worker.name,
            id: jobContract.worker.id,
          },
          client: {
            name: jobContract.client.name,
            id: jobContract.client.id,
          },
          value: jobContract.price,
        };

        const advertisementData = advertisementDoc.data();
        const contractsArray = advertisementData?.Contracts || [];
        contractsArray.push(contractInfo);

        await advertisementRef.update({ Contracts: contractsArray });
      }
      if (!external_payment) {
        await this.updateUserBalance(jobContract.client.id, -jobContract.price);
        const clientContact = await this.updateUserContractedServices(
          jobContract.client.id,
          uid,
          jobContract.advertisement.title,
          jobContract.price
        );
        const workerContact = await this.updateWorkerSelledServices(
          jobContract.worker.id,
          uid,
          jobContract.advertisement.title,
          jobContract.price
        );
        const emailModel = new EmailNotificationModel();
        const clientEmailContent = emailModel.createEmailClientNotification(
          jobContract,
          uid,
          workerContact
        );
        const workerEmailContent = emailModel.createEmailWorkerNotification(
          jobContract,
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
      console.log("entrou");

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
        console.log("updatedData.paid", updatedData.paid);
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
      let jobs;

      await db
        .collection("JobContracts")
        .where("client.id", "==", clientUid)
        .where("deleted", "==", null)
        .orderBy("created", "asc")
        .get()
        .then((querySnapshot) => {
          jobs = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return { ...data, uid: doc.id };
          });
        })
        .catch((error) => {
          console.error(
            "Error getting all Client Jobs from Firestore. ",
            error
          );
          throw error;
        });

      return jobs;
    } catch (error) {
      console.error("Error retrieving jobs from User UID: ", error);
      throw error;
    }
  }

  async getAllJobsFromWorker(workerUid: string): Promise<any> {
    try {
      let jobs;

      await db
        .collection("JobContracts")
        .where("worker.id", "==", workerUid)
        .where("deleted", "==", null)
        .orderBy("created", "asc")
        .get()
        .then((querySnapshot) => {
          jobs = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return { ...data, uid: doc.id };
          });
        })
        .catch((error) => {
          console.error(
            "Error getting all Worker Jobs from Firestore. ",
            error
          );
          throw error;
        });

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
      }

      return this.getAllJobsFromClient(userUid);
    } catch (error) {
      console.error("Error finishing contract: ", error);
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
      const clientData = await userRepository.getById(jobData.worker.id);

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
}

export default JobContractRepository;

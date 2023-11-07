import AppRepository from "./AppRepository";
import { db } from "../../util/admin";
import EmailNotificationModel from "../models/EmailNotificationModel";
import UserRepository from "./UserRepository";
import JobContractRepository from "./JobContractRepository";

class ComplaintsRepository extends AppRepository {

  async getAll(): Promise<any> {
    try {
      let complaints;
      await db
        .collection("Complaints")
        .where("deleted", "==", null)
        .orderBy("created", "asc")
        .get()
        .then((querySnapshot) => {
          complaints = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return { ...data, uid: doc.id };
          });
        });

      return complaints;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateStatus(complaintUid: string, body: any): Promise<any> {
    try {
      const complaintRef = db.collection("Complaints").doc(complaintUid);
      const complaintDoc = await complaintRef.get();
      const complaintData = complaintDoc.data();

      if (complaintDoc.exists && !complaintData?.deleted) {
        await complaintRef.update({
          status: body.status,
          result_description: body.result_description,
          modified: this.getDateTime()
        });

        const userRepository = new UserRepository();
        const workerData = await userRepository.getById(complaintData?.worker.id);
        const clientData = await userRepository.getById(complaintData?.client.id);

        if (body.status === 'onAnalysis') {
          await this.sendEmailStartAnalysis(complaintUid, complaintData, workerData, clientData);
        }
        if (body.status === 'accepted') {
          await this.sendEmailAcceptedComplaint(complaintUid, complaintData, body.result_description, workerData, clientData);
          await this.refundAcceptedComplaint(complaintUid);
        }
        if (body.status === 'refused') {
          await this.sendEmailRefusedComplaint(complaintUid, complaintData, body.result_description, workerData, clientData);
          await this.refundRefusedComplaint(complaintUid);
        }

        return this.getAll();
      } else {
        return 'expired';
      }
    } catch (error) {
      console.error('Error finishing contract: ', error);
      throw error;
    }
  }

  async sendEmailStartAnalysis(complaintUid: string, complaintData: any, workerData: any, clientData: any): Promise<any> {
    try {
      const emailModel = new EmailNotificationModel();
      const clientEmailContent = emailModel.onAnalysisComplaint(complaintData, complaintUid, clientData?.name);
      await emailModel.sendCustomEmail(clientData?.email, `Denúncia ${complaintUid} Entrou em Análise.`, clientEmailContent);
      const workerEmailContent = emailModel.onAnalysisComplaint(complaintData, complaintUid, workerData?.name);
      await emailModel.sendCustomEmail(workerData?.email, `Denúncia ${complaintUid} Entrou em Análise.`, workerEmailContent);
    } catch (error) {
      console.error("Error to send finished contract email: ", error);
      throw error;
    }
  }

  async sendEmailAcceptedComplaint(complaintUid: string, complaintData: any, resultDescription: string, workerData: any, clientData: any): Promise<any> {
    try {
      const emailModel = new EmailNotificationModel();

      // Se o cliente foi quem denunciou
      if (complaintData.client.applicant) {
        const clientToClientEmailContent = emailModel.acceptComplaintByClientToClient(complaintData, complaintUid, clientData?.name, resultDescription);
        await emailModel.sendCustomEmail(clientData?.email, `Denúncia ${complaintUid} foi Aceita.`, clientToClientEmailContent);
        const clientToWorkerEmailContent = emailModel.acceptComplaintByClientToWorker(complaintData, complaintUid, workerData?.name, resultDescription);
        await emailModel.sendCustomEmail(workerData?.email, `Denúncia ${complaintUid} foi Aceita.`, clientToWorkerEmailContent);
      }
      // Se o trabalhador foi quem denunciou
      if (complaintData.worker.applicant) {
        const workerToWorkerEmailContent = emailModel.acceptComplaintByWorkerToWorker(complaintData, complaintUid, workerData?.name, resultDescription);
        await emailModel.sendCustomEmail(workerData?.email, `Denúncia ${complaintUid} foi Aceita.`, workerToWorkerEmailContent);
        const workerToClientEmailContent = emailModel.acceptComplaintByWorkerToClient(complaintData, complaintUid, clientData?.name, resultDescription);
        await emailModel.sendCustomEmail(clientData?.email, `Denúncia ${complaintUid} foi Aceita.`, workerToClientEmailContent);
      }
    } catch (error) {
      console.error("Error to send accepted complaint email: ", error);
      throw error;
    }
  }

  async sendEmailRefusedComplaint(complaintUid: string, complaintData: any, resultDescription: string, workerData: any, clientData: any): Promise<any> {
    try {
      const emailModel = new EmailNotificationModel();

      // Se o cliente foi quem denunciou
      if (complaintData.client.applicant) {
        const clientToClientEmailContent = emailModel.rejectComplaintByClientToClient(complaintData, complaintUid, clientData?.name, resultDescription);
        await emailModel.sendCustomEmail(clientData?.email, `Denúncia ${complaintUid} foi Rejeitada.`, clientToClientEmailContent);
        const clientToWorkerEmailContent = emailModel.rejectComplaintByClientToWorker(complaintData, complaintUid, workerData?.name, resultDescription);
        await emailModel.sendCustomEmail(workerData?.email, `Denúncia ${complaintUid} foi Rejeitada.`, clientToWorkerEmailContent);
      }
      // Se o trabalhador foi quem denunciou
      if (complaintData.worker.applicant) {
        const workerToWorkerEmailContent = emailModel.rejectComplaintByWorkerToWorker(complaintData, complaintUid, workerData?.name, resultDescription);
        await emailModel.sendCustomEmail(workerData?.email, `Denúncia ${complaintUid} foi Rejeitada.`, workerToWorkerEmailContent);
        const workerToClientEmailContent = emailModel.rejectComplaintByWorkerToClient(complaintData, complaintUid, clientData?.name, resultDescription);
        await emailModel.sendCustomEmail(clientData?.email, `Denúncia ${complaintUid} foi Rejeitada.`, workerToClientEmailContent);
      }
    } catch (error) {
      console.error("Error to send refused complaint email: ", error);
      throw error;
    }
  }

  async refundAcceptedComplaint(complaintData: any): Promise<any> {
    try {
      const contractRepository = new JobContractRepository();
      const contractData = await contractRepository.getById(complaintData.contract.id);
      if (complaintData.client.applicant) {
        await contractRepository.updateUserBalance(complaintData.client.id, contractData.price);
      }
      if (complaintData.worker.applicant) {
        await contractRepository.updateUserBalance(complaintData.worker.id, contractData.price);
      }
      await contractRepository.finishContractWithComplaint(complaintData.contract.id);
    } catch (error) {
      console.error('Error to refund the contract of accepted complaint: ', error);
      throw error;
    }
  }

  async refundRefusedComplaint(complaintData: any): Promise<any> {
    try {
      const contractRepository = new JobContractRepository();
      const contractData = await contractRepository.getById(complaintData.contract.id);
      if (complaintData.client.applicant) {
        await contractRepository.updateUserBalance(complaintData.worker.id, contractData.price);
      }
      if (complaintData.worker.applicant) {
        await contractRepository.updateUserBalance(complaintData.client.id, contractData.price);
      }
      await contractRepository.finishContractWithComplaint(complaintData.contract.id);
    } catch (error) {
      console.error('Error to refund the contract of refused complaint: ', error);
      throw error;
    }
  }

}

export default ComplaintsRepository;
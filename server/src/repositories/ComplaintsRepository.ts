import AppRepository from "./AppRepository";
import { db } from "../../util/admin";
import EmailNotificationModel from "../models/EmailNotificationModel";
import UserRepository from "./UserRepository";

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

  async updateStatus(complaintUid: string, status: string): Promise<any> {
    try {
      const complaintRef = db.collection("Complaints").doc(complaintUid);
      const complaintDoc = await complaintRef.get();
      const complaintData = complaintDoc.data();

      if (complaintDoc.exists && !complaintData?.deleted) {
        await complaintRef.update({ status: status });

        if (status === 'onAnalysis') {
          this.sendEmailStartAnalysis(complaintUid, complaintData);
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

  async sendEmailStartAnalysis(complaintUid: string, complaintData: any): Promise<any> {
    try {
        const emailModel = new EmailNotificationModel();
        const userRepository = new UserRepository();
        const workerData = await userRepository.getById(complaintData.worker.id);
        const clientData = await userRepository.getById(complaintData.client.id);

        const clientEmailContent = emailModel.onAnalysisComplaint(complaintData, complaintUid, clientData?.name);
        await emailModel.sendCustomEmail(clientData?.email, `Denúncia ${complaintUid} entrou em análise.`, clientEmailContent);
        const workerEmailContent = emailModel.onAnalysisComplaint(complaintData, complaintUid, workerData?.name);
        await emailModel.sendCustomEmail(workerData?.email, `Denúncia ${complaintUid} entrou em análise.`, workerEmailContent);
    } catch (error) {
        console.error("Error to send finished contract email: ", error);
        throw error;
    }
}

}

export default ComplaintsRepository;
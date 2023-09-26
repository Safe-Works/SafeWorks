import AppRepository from "./AppRepository";
import JobAdRepository from "./JobAdRepository";
import JobContractRepository from "./JobContractRepository";
import UserRepository from "./UserRepository";

const jobAdRepository = new JobAdRepository();
const jobContractRepository = new JobContractRepository();
const userRepository = new UserRepository;

class AnalyticsRepository extends AppRepository {

    async getAllJobAds(): Promise<any> {
        return await jobAdRepository.getAll()
    }

    async getAllJobs(): Promise<any> {
        return await jobContractRepository.getAll();
    }

    async getAllUsers(): Promise<any> {
        return await userRepository.getAll();
    }

}

export default AnalyticsRepository;
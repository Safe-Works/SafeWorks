import AppRepository from "./AppRepository";
import JobAdRepository from "./JobAdRepository";

const jobAdRepository = new JobAdRepository();

class AnalyticsRepository extends AppRepository {

    async getAllJobAds(): Promise<any> {
        return await jobAdRepository.getAll()
    }

}

export default AnalyticsRepository;
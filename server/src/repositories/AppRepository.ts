import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../util/firebase";
import { format } from "date-fns";

class AppRepository {

    constructor() {
        initializeApp(firebaseConfig);
    }

    public getDateTime() {
        return format(new Date(), "dd/MM/yyyy HH:mm:ss");
    }

}

export default AppRepository;
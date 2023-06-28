import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../util/firebase";

class AppRepository {

    constructor() {
        initializeApp(firebaseConfig);
    }

    public getDateTime() {
        const datetime = new Date();
        return datetime.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

}

export default AppRepository;
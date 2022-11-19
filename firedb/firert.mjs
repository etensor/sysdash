import { initializeApp } from 'firebase/app';
import { getDatabase, collection, getDocs, ref, set} from 'firebase/database';

const firebaseConfig = {
    databaseURL: process.env.DB_URL
};


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);



export function writeSysData(data){
    //const db = getDatabase(app);
    set(ref(db, 'sysinfo/'+ data.uuid ), {
        'uuid': data.uuid,
        
    });
}





export async function getSystems(){
    const systemsCol = collection(db, 'systems');
    const systemsSnapshot = await getDocs(systemsCol);
    const systemsList = systemsSnapshot.docs.map(doc => doc.data());
    return systemsList;
}



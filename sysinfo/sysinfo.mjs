import si from 'systeminformation';
// https://systeminformation.io/general.html

// dpenilla

//function getSystemInfo() {
//  return si.getStaticData();
//}

export async function dataCPU() {
    try {
        const data = await si.cpu();
        const cpu_speed = await si.cpuCurrentSpeed();
        let cpu_temp = await si.cpuTemperature();
        delete cpu_temp['socket'];
        delete cpu_temp['chipset'];

        
        let cpudata = {
            'manufucturer' : data.manufacturer,
            'brand' : data.brand,
            'model' : data.model,
            'speed' : data.speed,
            'cores' : data.cores,
            'physicalcores' : data.physicalCores,
            'processors' : data.processors,
            'virtualization' : data.virtualization,
            'cpu_speed' : cpu_speed,
            'cpu_temp' : cpu_temp
        }

        return cpudata;
    } catch (e) { console.log(e) }
}

export async function dataSys(){
    try {
        const data = await si.system();
        const bios = await si.bios();
        delete bios['revision']
        delete bios['serial']

        let systemdata = {
            'manufacturer' : data.manufacturer,
            'model' : data.model,
            'version' : data.version,
            'virtual' : data.virtual,
            'bios': bios
        } 
        
        return systemdata;
    } catch (e) { console.log(e) }
}

export async function dataMem(){
    var mib_factor = 0.000000000953674;
    try {
        const data = await si.mem();
        const memdata = {
            'total' : data.total,
            'free' : data.free,
            'used' : data.used,
            'active' : data.active,
            'available' : data.available,
            'buffers' : data.buffers,
            'cached' : data.cached,
            'slab' : data.slab
        }

        for (let [key,value] of Object.entries(memdata)){
            memdata[key] = (value * mib_factor).toFixed(5);
        }
        
        return memdata;
    } catch (e) { console.log(e) }

}

// basicament estas funciones son super innecesarias.
export async function dataBateria(){
    const data = await si.battery();
    return data;
}

export async function dataGraphics(){
    const data = await si.graphics();
    return data;
}


export async function dataAudio(){
    const devices = await si.audio();
    let audiodata = devices.map(data => {
        return {
        "id" : data.id,
        "name" : data.name,
        "manufacturer" : data.manufacturer,
        "channel": data.channel,
        "type": data.type,
        "status": data.status,
        }
    })

    return audiodata;
}

export async function dataLoad(){
    const procs = await si.processes();
    const load = await si.currentLoad();
    let loaddata = {
        'avgLoad' : load.avgLoad,
        'currentLoad': load.currentLoad.toFixed(3),
        'cpus': load.cpus.map(data => {
            return {
                'load' : data.load.toFixed(2),
                'idle': data.loadIdle.toFixed(2),
                'user': data.loadUser.toFixed(2),
                'sys': data.loadSystem.toFixed(2)
            }
        }),
        'procs' : {
            'all' : procs.all,
            'running': procs.running,
            'sleeping': procs.sleeping,
            'blocked' : procs.blocked,
            'list': procs.list.map(data => {
                return {
                    'pid' : data.pid,
                    'parentPid' : data.parentPid,
                    'name' : data.name,
                    'cpu' : data.cpu,
                    'mem' : data.mem,
                    'memVsz' : data.memVsz,
                    'memRss' : data.memRss,
                    'started' : data.started,
                    'state' : data.state,
                    'user' : data.user,
                    'command' : data.command
                }})
        }
    }

    return loaddata;
}






//console.log("\nMemoria:\n" + await dataMem());
//console.log("\nCPU:\n" + await dataCPU());
//console.log("\nSistema\n" + await dataSys());
//console.log("\nBateria:\n" + await dataBateria());
//console.log("\nGraphics:\n" + await dataGraphics());
//dataSys().then(data => {console.log(data)})
//dataCPU().then(data => {console.log(data)})
//console.log(await dataAudio());
//console.log(JSON.stringify(await dataLoad()));

// -------------------------------------------------------

let allData = {
    'cpu': await dataCPU(),
    'sys': await dataSys(),
    'os': await si.osInfo(),
    'mem': await dataMem(),
    'bat': await dataBateria(),
    'gfx': await dataGraphics(),
    'audio': await dataAudio(),
    'net': await si.networkInterfaces('default'),
    'load': await dataLoad(),
    'versiones': await si.versions(),
    'docker': await si.dockerInfo(),
}

console.log(JSON.stringify(allData))

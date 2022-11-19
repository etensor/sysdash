import si from 'systeminformation';

function delay(time){
    return new Promise(resolve => setTimeout(resolve,time))
}


setInterval(function() {
    si.networkStats().then(data => {
        console.log(data);
	delay(500)
	console.clear()
    })
}, 1000)





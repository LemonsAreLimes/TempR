const { exec } = require("child_process");
const fs = require('fs');


function sleep(ms) {
	    return new Promise(resolve => setTimeout(resolve, ms));
}



async function main(){

	//CONFIG
	const write_interval = 10000
	var isTimeoutSet = false

	var TempHr = []
	const temp_interval = 1000
	let temp_check_command = "echo hello world"

	//main loop 
	while (true) {

		console.log('loop')
		
		//set the write timeout (if it has already fired)
		if(isTimeoutSet == false){
			isTimeoutSet = true
			setTimeout( () => {
				console.log('writing...')

				//get the current time
				const date_time = new Date()
				const write_time =  date_time.getUTCFullYear()+'_'+date_time.getUTCMonth()+'_'+date_time.getUTCDate()+'_'+date_time.getUTCHours()+'_'+date_time.getUTCMinutes()

				//initalize the logfile dir and name
				const log_file = `./logs/${write_time}.txt`

				//parse out the temphr list 
				var parsed_TempHr = ''
				for(i in TempHr){parsed_TempHr += TempHr[i] + '\n'}

				//write to the logfile
				fs.writeFileSync(log_file, parsed_TempHr, (a, b)=>{console.log(a + b)});

				//reset the timeout and temphr
				isTimeoutSet = false
				TempHr = []

			}, write_interval);

		} else {

			//get the time of mesure 
			const curr_date_time = new Date();
			const log_time = `${curr_date_time.getHours()}:${curr_date_time.getMinutes()}:${curr_date_time.getSeconds()}`

			//execute get temp command
			exec(temp_check_command, (a,b,c) => {
			
				//add it to the HourTemp list
				TempHr.push(`${log_time}  =  ${b}`);
			})

			//wait untill interval
			await sleep(temp_interval)
		}
	}
}

main()
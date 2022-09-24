const { exec } = require("child_process");
const fs = require('fs');


function sleep(ms) {
	    return new Promise(resolve => setTimeout(resolve, ms));
}



async function main(){

	// //CONFIG
	// const temp_check_command = "vcgencmd measure_temp"

	const temp_check_command = "echo hello world"

	// const write_interval = 180000
	// const check_interval = 10000
	
	const write_interval = 10000
	const check_interval = 1000

	var isTimeoutSet = false
	var TempHr = []

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
				const write_time =  date_time.getUTCFullYear()+'_'+date_time.getUTCMonth()+'_'+date_time.getUTCDate()

				//initalize the logfile dir and name
				const log_file_dir = `./logs/${write_time}.json`

				//check if a dayly logfile has aready been created
				try {

					console.log('file exits')

					//open the file 
					const logfile = require(log_file_dir);

					//append new data
					for (i in TempHr){ logfile.push(TempHr[i]) }

					//write to the file
					fs.writeFileSync(log_file_dir, JSON.stringify(logfile), 'utf-8', (a, b)=>{console.log(a + b)});

				} catch (err) {

					console.log('dayly logfile does not exist!');

					//create and write to file				
					fs.writeFileSync(log_file_dir, JSON.stringify(TempHr), 'utf-8', (a, b)=>{console.log(a + b)});
				}

				//reset the timeout and temphr
				isTimeoutSet = false
				TempHr = []

			}, write_interval);

		} else {

			//execute get temp command
			exec(temp_check_command, (a,b,c) => {
			
				//remove "temp=" and "'C"
				b = b.replace("temp=", ""); 
				b = b.replace("'C\n", "");

				//create the log format object
				const log_data = {
					"time":Date.now(),
					"temp":b
				}

				//add it to the HourTemp list
				TempHr.push(log_data);
			})

			//wait untill next check interval
			await sleep(check_interval)
		}
	}
}

main()

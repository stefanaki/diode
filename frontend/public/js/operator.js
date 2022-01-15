let token = localStorage.getItem('auth_token');
let list = document.querySelector('#operators');

let c1,
	c2,
	c3 = null;

list.addEventListener('change', (e) => {
	let opName = e.target.value;
	console.log(opName);
});

const now = new Date();
const picker = new Litepicker({
	element: document.querySelector('#litepicker'),
	numberOfColumns: 4,
	numberOfMonths: 4,
	singleMode: false,
	inlineMode: true,
	setup: function (picker) {
		picker.on('selected', function (date1, date2) {
			console.log(date1.format('YYYYMMDD') + ' - ' + date2.format('YYYYMMDD'));
			if (document.querySelector('#operators').value !== 'Select operator')
				loadData(
					document.querySelector('#operators').value,
					date1.format('YYYYMMDD'),
					date2.format('YYYYMMDD')
				);
		});
	}
});

let operators = [];

(async () => {
	try {
		operators = await axios({
			url: `https://localhost:9103/interoperability/api/auxiliary/getoperators`,
			method: 'get',
			headers: {
				'X-OBSERVATORY-AUTH': token
			}
		});

		operators = operators.data.operators;
		console.log(operators);

		operators.forEach((op) => {
			let selection = document.createElement('option');
			selection.value = op.op_name;
			selection.innerHTML = `${op.op_name
				.replace(/_/g, ' ')
				.replace(/(?: |\b)(\w)/g, function (key) {
					return key.toUpperCase();
				})} (${op.op_abbr})`;
			list.appendChild(selection);
		});
	} catch (error) {
		console.log(error);
	}
})();

const loadData = async (current, datefrom, dateto) => {
	let spinner = document.createElement('div');
	spinner.classList.add('d-flex', 'justify-content-center');
	spinner.innerHTML = `<div class="spinner-border"></div>`;
	document.querySelector('.container').appendChild(spinner);
	try {
		let stations = await axios({
			url: `https://localhost:9103/interoperability/api/auxiliary/getstations/${current}`,
			method: 'get',
			headers: {
				'X-OBSERVATORY-AUTH': token
			}
		});
		let chargesBy = await axios({
			url: `https://localhost:9103/interoperability/api/ChargesBy/aodos/${datefrom}/${dateto}`,
			method: 'get',
			headers: {
				'X-OBSERVATORY-AUTH': token
			}
		});

		stations = stations.data.stations;
		stationNames = [];
		stations.forEach((st) => {
			stationNames.push(st.st_name);
		});
		operators = operators.filter((op) => op.op_name !== current);

		let home = [],
			away = [];
		stations.forEach(async (st) => {
			let passesPerStation = await axios({
				url: `https://localhost:9103/interoperability/api/PassesPerStation/${st.st_id}/${datefrom}/${dateto}`,
				method: 'get',
				headers: {
					'X-OBSERVATORY-AUTH': token
				}
			});

			let sum = passesPerStation.data.NumberOfPasses;
			passesPerStation = passesPerStation.data.PassesList;
			let numOfHome = passesPerStation.reduce(
				(acc, pass) => (acc += pass.PassType == 'home' ? 1 : 0),
				0
			);
			home.push(numOfHome);
			away.push(sum - numOfHome);
		});

		chargesBy = chargesBy.data;
		let labels = operators.map((op) => op.op_abbr);

		if (c1) c1.destroy();
		if (c2) c2.destroy();
		if (c3) c3.destroy();
		c1 = new Chart(document.getElementById('chart1'), {
			type: 'bar',
			data: {
				labels: labels,
				datasets: [
					{
						label: `Debts`,
						backgroundColor: 'rgba(255, 99, 132, 0.2)',
						borderColor: 'rgb(255, 99, 132)',
						borderWidth: 1,
						data: chargesBy.PPOList.map((el) => el.PassesCost)
					},
					{
						label: `Passes`,
						backgroundColor: 'rgba(54, 162, 235, 0.2)',
						borderColor: 'rgb(54, 162, 235)',
						borderWidth: 1,
						data: chargesBy.PPOList.map((el) => el.NumberOfPasses)
					}
				]
			},
			options: {
				plugins: {
					title: {
						display: true,
						text: `${current}`
					}
				}
			}
		});
		c2 = new Chart(document.getElementById('chart2'), {
			type: 'pie',
			data: {
				labels: labels,
				datasets: [
					{
						label: `Passes`,
						backgroundColor: [
							'rgba(255, 99, 132, 0.2)',
							'rgba(255, 159, 64, 0.2)',
							'rgba(255, 205, 86, 0.2)',
							'rgba(75, 192, 192, 0.2)',
							'rgba(54, 162, 235, 0.2)',
							'rgba(153, 102, 255, 0.2)',
							'rgba(201, 203, 207, 0.2)'
						],
						borderColor: [
							'rgb(255, 99, 132)',
							'rgb(255, 159, 64)',
							'rgb(255, 205, 86)',
							'rgb(75, 192, 192)',
							'rgb(54, 162, 235)',
							'rgb(153, 102, 255)',
							'rgb(201, 203, 207)'
						],
						borderWidth: 1,
						data: chargesBy.PPOList.map((el) => el.NumberOfPasses)
					}
				]
			},
			options: {
				plugins: {
					title: {
						display: true,
						text: `Passes Analysis`
					}
				}
			}
		});

		c3 = new Chart(document.getElementById('area-3'), {
			type: 'bar',
			data: {
				labels: stationNames,
				datasets: [
					{
						label: 'Home Passes',
						data: home,
						borderColor: 'rgba(54, 162, 235)',
						backgroundColor: 'rgba(54, 162, 235, 0.2)'
					},
					{
						label: 'Away Passes',
						data: away,
						borderColor: 'rgba(255, 99, 132)',
						backgroundColor: 'rgba(255, 99, 132, 0.2)'
					}
				]
			},
			options: {
				indexAxis: 'x',
				// Elements options apply to all of the options unless overridden in a dataset
				// In this case, we are setting the border of each horizontal bar to be 2px wide
				elements: {
					bar: {
						borderWidth: 1
					}
				},
				responsive: true,
				plugins: {
					legend: {
						position: 'right'
					},
					title: {
						display: true,
						text: `${current} passes`
					}
				}
			}
		});
	} catch (error) {
		if (error.response) {
			if (error.response.status === 402)
				createAlert('No data for specified time period', 'info');
			else createAlert(error.response.data.message, 'danger');

			if (error.response.data.message === 'Invalid token') {
				localStorage.setItem(
					'msg',
					JSON.stringify({ msg: 'Session expired, please log in again', type: 'warning' })
				);
				localStorage.removeItem('auth_token');
				window.location.replace('http://localhost:8000/login');
			}
		} else {
			createAlert('Network error, try logging in again', 'danger');
		}
	} finally {
		spinner.remove();
	}
};

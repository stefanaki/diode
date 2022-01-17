let token = localStorage.getItem('auth_token');
let list = document.querySelector('#operators');

let chargesGraph,
	c2,
	c3,
	totalGraph,
	totalPie = null;

const picker = new Litepicker({
	element: document.querySelector('#litepicker'),
	numberOfColumns: 4,
	numberOfMonths: 4,
	singleMode: false,
	inlineMode: true,
	setup: function (picker) {
		picker.on('selected', function (date1, date2) {
			console.log(date1.format('YYYYMMDD') + ' - ' + date2.format('YYYYMMDD'));
			loadData(
				document.querySelector('#operators').value,
				date1.format('YYYYMMDD'),
				date2.format('YYYYMMDD')
			);
		});
	}
});

document.querySelector('#operators').addEventListener('change', () => {
	if (picker.getDate()) {
		loadData(
			document.querySelector('#operators').value,
			picker.getStartDate().format('YYYYMMDD'),
			picker.getEndDate().format('YYYYMMDD')
		);
	}
});

let allOperators = [];
(async () => {
	try {
		allOperators = await axios({
			url: `https://localhost:9103/interoperability/api/auxiliary/getoperators`,
			method: 'get',
			headers: {
				'X-OBSERVATORY-AUTH': token
			}
		});

		allOperators = allOperators.data.operators;
		console.log(allOperators);

		allOperators.forEach((op) => {
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
	try {
		let stations = await axios({
			url: `https://localhost:9103/interoperability/api/auxiliary/getstations/${current}`,
			method: 'get',
			headers: {
				'X-OBSERVATORY-AUTH': token
			}
		});
		let chargesBy = await axios({
			url: `https://localhost:9103/interoperability/api/ChargesBy/${current}/${datefrom}/${dateto}`,
			method: 'get',
			headers: {
				'X-OBSERVATORY-AUTH': token
			}
		});

		chargesBy = chargesBy.data;
		operators = allOperators.filter((op) => op.op_name !== current);

		console.log(chargesBy);

		stations = stations.data.stations;
		stationNames = [];
		stations.forEach((st) => {
			stationNames.push(st.st_name);
		});

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

		let passesCosts = await Promise.all(
			operators.map(async (op) => {
				let passescost = await axios({
					url: `https://localhost:9103/interoperability/api/PassesCost/${op.op_name}/${current}/${datefrom}/${dateto}`,
					method: 'get',
					headers: {
						'X-OBSERVATORY-AUTH': token
					}
				});
				return passescost.data;
			})
		);

		let incomes = chargesBy.PPOList.map((el) => el.PassesCost);
		let debts = passesCosts.map((el) => el.PassesCost);
		let total = [];
		for (let i = 0; i < incomes.length; ++i) total.push(incomes[i] - debts[i]);

		document.querySelector('#table > thead').innerHTML = '';
		document.querySelector('#table > tbody').innerHTML = '';
		let cols = document.createElement('tr');
		cols.classList.add('text-center');
		let values = document.createElement('tr');
		values.classList.add('text-center');
		let sum = 0;
		for (const i in total) {
			sum += total[i];
			let th = document.createElement('th');
			th.innerHTML = `${operators[i].op_name
				.replace(/_/g, ' ')
				.replace(/(?: |\b)(\w)/g, function (key) {
					return key.toUpperCase();
				})}`;
			cols.appendChild(th);
			let td = document.createElement('td');
			td.classList.add(total[i] > 0 ? 'text-success' : 'text-danger');
			td.innerHTML = `${(Math.round(total[i] * 100) / 100).toFixed(2)}`;
			values.append(td);
		}
		let th = document.createElement('th');
		let td = document.createElement('td');
		td.classList.add(sum > 0 ? 'text-success' : 'text-danger');
		th.innerHTML = `<b>Total</b>`;
		td.innerHTML = `${(Math.round(sum * 100) / 100).toFixed(2)}`;
		cols.appendChild(th);
		values.appendChild(td);
		document.querySelector('#table > thead').appendChild(cols);
		document.querySelector('#table > tbody').appendChild(values);

		if (chargesGraph) chargesGraph.destroy();
		if (totalPie) totalPie.destroy();
		if (totalGraph) totalGraph.destroy();
		if (c2) c2.destroy();
		if (c3) c3.destroy();
		chargesGraph = new Chart(document.getElementById('chargesGraph'), {
			type: 'bar',
			data: {
				labels: operators.map((op) => op.op_abbr),
				datasets: [
					{
						label: `Income`,
						backgroundColor: 'rgba(75, 192, 192, 0.2)',
						borderColor: 'rgb(75, 192, 192)',
						borderWidth: 1,
						data: incomes
					},
					{
						label: `Debts`,
						borderColor: 'rgba(255, 99, 132)',
						backgroundColor: 'rgba(255, 99, 132, 0.2)',
						borderWidth: 1,
						data: debts
					}
				]
			},
			options: {
				maintainAspectRatio: false,
				plugins: {
					title: {
						display: true,
						text: `Earnings and Debts per Operator`
					}
				}
			}
		});

		totalGraph = new Chart(document.getElementById('totalGraph'), {
			type: 'bar',
			data: {
				labels: operators.map((op) => op.op_abbr),
				datasets: [
					{
						label: `Total Income`,
						borderColor: 'rgba(54, 162, 235)',
						backgroundColor: 'rgba(54, 162, 235, 0.2)',
						borderWidth: 1,
						data: total
					}
				]
			},
			options: {
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display: false
					},
					title: {
						display: true,
						text: `Total Income`
					}
				}
			}
		});

		c2 = new Chart(document.getElementById('chart2'), {
			type: 'pie',
			data: {
				labels: operators.map((op) => op.op_abbr),
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
				maintainAspectRatio: false,
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
				labels: stationNames.map((st) =>
					st.replace(/_/g, ' ').replace(/(?: |\b)(\w)/g, function (key) {
						return key.toUpperCase();
					})
				),
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
				maintainAspectRatio: false,
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
						text: `Home and Away Passes per Station`
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
			console.log(error);
			createAlert('Network error, try logging in again', 'danger');
		}
	}
};

let token = localStorage.getItem('auth_token');
let list = document.querySelector('#operators');

let chargesGraph,
	awayPassesGraph,
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

document.querySelector('#stations').addEventListener('change', () => {
	PassesPerStation(
		document.querySelector('#stations').value,
		picker.getStartDate().format('YYYYMMDD'),
		picker.getEndDate().format('YYYYMMDD')
	);
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

const PassesPerStation = async (station, datefrom, dateto) => {
	try {
		let response = await axios({
			url: `https://localhost:9103/interoperability/api/passesperstation/${station}/${datefrom}/${dateto}`,
			method: 'get',
			headers: {
				'X-OBSERVATORY-AUTH': token
			}
		});

		let passesList = response.data.PassesList;
		let div = document.querySelector('#passesperstation');
		div.innerHTML = '';
		let table = document.createElement('table');
		table.id = 'tbl';
		table.classList.add('table', 'dataTable', 'mb-3');
		//old.parentNode.replaceChild(table, old);

		console.log(passesList);

		table.innerHTML = `
		<thead class="table-light">
			<tr>
				<th class="text-end">Index</th>
				<th>Pass ID</th>
				<th>Timestamp</th>
				<th>Vehicle ID</th>
				<th>Tag Provider</th>
				<th>Type</th>	
				<th class="text-end">Charge</th>	
			</tr>
		</thead>`;

		let tableData = document.createElement('tbody');
		let passes = [];
		allOperators.map((op) => passes.push({ op: op.op_name, sum: 0 }));
		console.log(passes);
		passesList.forEach((pass) => {
			let row = document.createElement('tr');
			row.innerHTML = `
				<td class="text-end">${pass.PassIndex}</td>
				<td>${pass.PassID}</td>
				<td>${pass.PassTimeStamp}</td>
				<td>${pass.VehicleID}</td>
				<td>${pass.TagProvider.replace(/_/g, ' ').replace(/(?: |\b)(\w)/g, function (key) {
					return key.toUpperCase();
				})}</td>
				<td>${pass.PassType}</td>	
				<td class="text-end">${(Math.round(pass.PassCharge * 100) / 100).toFixed(2)}</td>
			`;
			tableData.appendChild(row);

			passes.forEach((p) => {
				if (p.op === pass.TagProvider) {
					p.sum++;
					return;
				}
			});
		});
		table.appendChild(tableData);
		console.log(passes);

		div.appendChild(table);

		$('#tbl').DataTable();

		//passes.sort((a, b) => (a.sum < b.sum ? 1 : -1));
		console.log(passes);

		if (awayPassesGraph) awayPassesGraph.destroy();
		awayPassesGraph = new Chart(document.getElementById('awaypasses'), {
			type: 'pie',
			data: {
				labels: passes.map((p) =>
					p.op.replace(/_/g, ' ').replace(/(?: |\b)(\w)/g, function (key) {
						return key.toUpperCase();
					})
				),
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
						data: passes.map((p) => p.sum)
					}
				]
			},
			options: {
				maintainAspectRatio: false,
				plugins: {
					legend: {
						position: 'right'
					},
					title: {
						display: true,
						text: `Passes per Tag Provider`
					}
				}
			}
		});
	} catch (error) {
		console.log(error);
	}
};

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

		let stationList = document.querySelector('#stations');
		stationList.innerHTML = '';
		stations.forEach((st) => {
			let opt = document.createElement('option');
			opt.value = st.st_id;
			opt.innerHTML = st.st_name.replace(/_/g, ' ').replace(/(?: |\b)(\w)/g, function (key) {
				return key.toUpperCase();
			});
			stationList.appendChild(opt);
		});

		PassesPerStation(document.querySelector('#stations').value, datefrom, dateto);

		let home = [],
			away = [];

		console.log(stations); /// ta stations einai me auksousa seira

		for (const st of stations) {
			let passesPerStation = await axios({
				url: `https://localhost:9103/interoperability/api/PassesPerStation/${st.st_id}/${datefrom}/${dateto}`,
				method: 'get',
				headers: {
					'X-OBSERVATORY-AUTH': token
				}
			});

			let sum = passesPerStation.data.NumberOfPasses;
			console.log(st.st_id + ' ' + sum);
			passesPerStation = passesPerStation.data.PassesList;
			let numOfHome = passesPerStation.reduce(
				(acc, pass) => (acc += pass.PassType == 'home' ? 1 : 0),
				0
			);
			home.push(numOfHome);
			away.push(sum - numOfHome);
		}

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

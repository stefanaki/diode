let token = localStorage.getItem('auth_token');

const createAlert = (msg, type) => {
	let alert = document.createElement('div');
	alerts.classList.remove('d-none');
	alert.classList.add(
		'my-alert',
		'alert',
		'alert-dismissible',
		`alert-${type}`,
		'hide',
		'fade',
		'in',
		'mt-3'
	);
	alert.innerHTML = `
            ${msg}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
	alerts.appendChild(alert);

	setTimeout(() => {
		alert.classList.remove('hide');
		alert.classList.add('show');
		setTimeout(() => {
			alert.classList.remove('show');
			alert.classList.add('hide');
		}, 3000);
		setTimeout(() => {
			alert.remove();
			alerts.classList.add('d-none');
		}, 3600);
	}, 0);
};

const loadData = async (current, datefrom, dateto) => {
	try {
		let operators = await axios({
			url: `https://localhost:9103/interoperability/api/auxiliary/getoperators`,
			method: 'get',
			headers: {
				'X-OBSERVATORY-AUTH': token
			}
		});
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

		operators = operators.data.operators;
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

		new Chart(document.getElementById('chart1'), {
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
		new Chart(document.getElementById('chart2'), {
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
		new Chart(document.getElementById('area-3'), {
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
			if (error.response.data.message === 'Invalid token') {
				localStorage.setItem(
					'msg',
					JSON.stringify({ msg: 'Session expired, please log in again', type: 'warning' })
				);
				localStorage.removeItem('auth_token');
				window.location.replace('http://localhost:8000/login');
			}
		} else {
			createAlert(
				JSON.stringify({ msg: 'Network error, try logging in again', type: 'danger' })
			);
		}
	}
};

loadData('gefyra', '20201010', '20211010');

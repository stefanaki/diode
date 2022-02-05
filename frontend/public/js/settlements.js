let token = localStorage.getItem('auth_token');
let setGraph = null;

const picker = new Litepicker({
	element: document.querySelector('#litepicker'),
	numberOfColumns: 4,
	numberOfMonths: 4,
	singleMode: false,
	inlineMode: true,
	setup: function (picker) {
		picker.on('selected', function (date1, date2) {
			date2.dateInstance.setDate(date2.dateInstance.getDate() + 1);
			console.log(date1.format('YYYYMMDD') + ' - ' + date2.format('YYYYMMDD'));
			loadSettlements(date1.format('YYYYMMDD'), date2.format('YYYYMMDD'));
		});
	}
});

const drawPie = (settlements) => {
	console.log(settlements);

	const data = {
		labels: ['Completed', 'Pending'],
		datasets: [
			{
				label: 'Settlement Status',
				data: [settlements.CompletedSettlements, settlements.PendingSettlements],
				backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 205, 86, 0.2)'],
				borderColor: ['rgb(75, 192, 192)', 'rgb(255, 205, 86)']
			}
		]
	};

	const config = {
		type: 'doughnut',
		data: data,
		options: {
			maintainAspectRatio: false,
			responsive: true,
			plugins: {
				legend: {
					position: 'top'
				},
				title: {
					display: true,
					text: 'Settlement Status'
				}
			}
		}
	};

	if (setGraph) setGraph.destroy();
	setGraph = new Chart(document.querySelector('#settlementsGraph'), config);
};

const loadSettlements = async (from, to) => {
	try {
		let settlements = await axios({
			url: `https://localhost:9103/interoperability/api/settlements/getsettlements/${from}/${to}`,
			method: 'get',
			headers: {
				'X-OBSERVATORY-AUTH': token
			}
		});

		settlements = settlements.data;
		let settList = settlements.SettlementsList;

		let div = document.querySelector('#settlements');
		div.innerHTML = '';
		let table = document.createElement('table');
		table.id = 'tbl';
		table.classList.add('table', 'dataTable', 'mb-3');

		table.innerHTML = `
		<thead class="table-light">
			<tr>
				<th class="text-end">ID</th>
				<th>Operator Credited</th>
				<th>Operator Debited</th>
				<th>From</th>
				<th>To</th>
				<th>Status</th>
				<th class="text-end">Amount</th>	
			</tr>
		</thead>`;

		let tableData = document.createElement('tbody');
		settList.forEach((settlement) => {
			let row = document.createElement('tr');
			if (settlement.Status === 1) row.classList.add('table-primary');
			row.innerHTML = `
				<td class="text-end">${settlement.SettlementID}</td>
				<td>${settlement.OperatorCredited.replace(/_/g, ' ').replace(/(?: |\b)(\w)/g, function (key) {
					return key.toUpperCase();
				})}</td>
				<td>${settlement.OperatorDebited.replace(/_/g, ' ').replace(/(?: |\b)(\w)/g, function (key) {
					return key.toUpperCase();
				})}</td>
				<td>${settlement.DateFrom}</td>
				<td>${settlement.DateTo}</td>
				<td>${
					settlement.Status === 1
						? 'Completed'
						: settlement.Status === 0 && localStorage.getItem('user_type') === 'bank'
						? '<button class="btn btn-secondary btn-sm">Pending</button>'
						: 'Pending'
				}</td>
				<td class="text-end">${(Math.round(settlement.Amount * 100) / 100).toFixed(2)}</td>
			`;
			tableData.appendChild(row);
		});

		table.appendChild(tableData);

		div.appendChild(table);

		let btns = document.querySelectorAll('.btn');
		Array.prototype.forEach.call(btns, (btn) => {
			btn.addEventListener('click', async (e) => {
				let set_id = e.target.parentElement.parentElement.children[0].innerHTML;
				try {
					bootbox.confirm({
						message: `Are you sure you want to verify the settlement with ID ${set_id}?`,
						buttons: {
							confirm: {
								label: 'Yes',
								className: 'btn-success'
							},
							cancel: {
								label: 'No',
								className: 'btn-danger'
							}
						},
						closeButton: false,
						callback: async function (result) {
							if (result) {
								let verify = await axios({
									url: `https://localhost:9103/interoperability/api/settlements/VerifySettlement`,
									method: 'post',
									headers: {
										'X-OBSERVATORY-AUTH': token,
										'content-type': 'application/x-www-form-urlencoded'
									},
									data: new URLSearchParams({
										set_id
									})
								});

								e.target.parentElement.parentElement.children[5].innerHTML =
									'Completed';
								console.log(e.target.parentElement);

								$('html,body').scrollTop(0);

								createAlert(
									`Settlement with ID ${set_id} marked completed successfuly`,
									'success'
								);

								settlements.CompletedSettlements++;
								settlements.PendingSettlements--;
								drawPie(settlements);
							}
						}
					});
				} catch (error) {
					if (error.response) {
						createAlert(error.response.message, 'danger');
					}
				}
			});
		});

		$('#tbl').DataTable();
		drawPie(settlements);
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

loadSettlements('20190101', '20220101');

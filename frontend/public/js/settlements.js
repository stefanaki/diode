let token = localStorage.getItem('auth_token');

const now = new Date();
const picker = new Litepicker({
	element: document.querySelector('#litepicker'),
	numberOfColumns: 4,
	numberOfMonths: 12,
	singleMode: false,
	inlineMode: true,
	setup: function (picker) {
		picker.on('selected', function (date1, date2) {
			console.log(date1.format('YYYYMMDD') + ' - ' + date2.format('YYYYMMDD'));
			loadData(date1.format('YYYYMMDD'), date2.format('YYYYMMDD'));
		});
	}
});

const loadData = async (from, to) => {
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

		settList.forEach((settlement) => {
			let row = document.createElement('tr');
			row.innerHTML = `
            <td>${settlement.DateFrom}</td>
            <td>${settlement.DateTo}</td>
            <td>${`${settlement.OperatorCredited.replace(/_/g, ' ').replace(
				/(?: |\b)(\w)/g,
				function (key) {
					return key.toUpperCase();
				}
			)}`}</td>
            <td>${`${settlement.OperatorDebited.replace(/_/g, ' ').replace(
				/(?: |\b)(\w)/g,
				function (key) {
					return key.toUpperCase();
				}
			)}`}</td>
            <td>${settlement.Amount.toFixed(2)}</td>
            <td>${settlement.Status === 0 ? 'Completed' : 'Pending'}</td>`;

			document.querySelector('#settl-table > tbody').appendChild(row);
		});
	} catch (error) {
		console.log(error);
	}
};

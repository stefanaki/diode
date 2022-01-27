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

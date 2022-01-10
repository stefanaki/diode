if (!localStorage.getItem('auth_token')) {
	localStorage.setItem(
		'msg',
		JSON.stringify({
			msg: 'Log in first to use the dashboard',
			type: 'info'
		})
	);
	window.location.replace('http://localhost:8000/login');
}

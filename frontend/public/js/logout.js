document.querySelector('#logoutBtn').addEventListener('click', async () => {
	let logout = await axios({
		method: 'post',
		url: 'https://localhost:9103/interoperability/api/logout',
		headers: {
			'X-OBSERVATORY-AUTH': localStorage.getItem('auth_token')
		}
	});

	localStorage.removeItem('auth_token');
	localStorage.setItem(
		'msg',
		JSON.stringify({
			msg: 'Log out successful',
			type: 'info'
		})
	);
	window.location.replace('http://localhost:8000/login');
});

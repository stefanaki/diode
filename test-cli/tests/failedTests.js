module.exports = async () => {
	let commands = [
		{
			cmd: 'se2108 login --username admin --password wrongpassword',
			out: 'Invalid credentials\n',
			file: '.token'
		}
	];
};

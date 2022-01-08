if (!localStorage.getItem('auth_token')) {
    window.location.replace('http://localhost:8000/login');
}

const container = document.querySelector('.container');
const signupButton = document.querySelector('.signup-section header');
const loginButton = document.querySelector('.login-section header');

// Script básico para controlar las secciones de inicio de sesión y de crear una cuenta nueva
signupButton.addEventListener('click', () => {
    container.classList.remove('active');
});

loginButton.addEventListener('click', () => {
    container.classList.add('active');
});
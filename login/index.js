document.addEventListener('DOMContentLoaded', () => {
    // Verifica se a configuração do Firebase foi carregada
    if (typeof firebase === 'undefined' || !firebase.apps.length) {
        console.error('Firebase SDK not loaded or initialized. Make sure firebase-config.js is correct.');
        alert('Erro de configuração. Não foi possível conectar ao serviço de autenticação.');
        return;
    }

    const auth = firebase.auth();
    const googleProvider = new firebase.auth.GoogleAuthProvider();

    // Elementos do DOM
    const loginForm = document.getElementById('login-form');
    const googleLoginBtn = document.getElementById('google-login');
    const errorMessageDiv = document.getElementById('error-message');
    
    const formTitle = document.getElementById('form-title');
    const formSubtitle = document.getElementById('form-subtitle');
    const submitBtn = document.getElementById('submit-btn');
    const toggleText = document.getElementById('toggle-text');
    const toggleLink = document.getElementById('toggle-link');

    let isLoginMode = true;

    // --- Verificador de estado de autenticação ---
    auth.onAuthStateChanged(user => {
        if (user) {
            // Se o usuário já estiver logado, redireciona para a página principal
            console.log('Usuário já logado, redirecionando...');
            window.location.href = '/WebPage%20Ferramentas%20-%20Copia/index.html';
        }
    });

    // --- Alternar entre modo Login e Criar Conta ---
    toggleLink.addEventListener('click', (e) => {
        e.preventDefault();
        isLoginMode = !isLoginMode;
        updateFormUI();
    });

    function updateFormUI() {
        if (isLoginMode) {
            formTitle.textContent = 'Welcome Back';
            formSubtitle.textContent = 'Please enter your details to log in.';
            submitBtn.textContent = 'Log In';
            toggleText.innerHTML = `Don't have an account? <a href="#" id="toggle-link">Create one</a>`;
        } else {
            formTitle.textContent = 'Create an Account';
            formSubtitle.textContent = 'Please enter your details to sign up.';
            submitBtn.textContent = 'Sign Up';
            toggleText.innerHTML = `Already have an account? <a href="#" id="toggle-link">Log In</a>`;
        }
        // Re-adiciona o event listener ao novo link, pois o innerHTML o remove
        document.getElementById('toggle-link').addEventListener('click', (e) => {
            e.preventDefault();
            isLoginMode = !isLoginMode;
            updateFormUI();
        });
        errorMessageDiv.style.display = 'none'; // Esconde erros ao alternar
    }


    // --- Tratamento de Erros ---
    function showAuthError(error) {
        let message = 'Ocorreu um erro. Tente novamente.';
        switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                message = 'E-mail ou senha inválidos.';
                break;
            case 'auth/email-already-in-use':
                message = 'Este e-mail já está em uso.';
                break;
            case 'auth/weak-password':
                message = 'A senha deve ter pelo menos 6 caracteres.';
                break;
            case 'auth/invalid-email':
                message = 'O formato do e-mail é inválido.';
                break;
            case 'auth/popup-closed-by-user':
                message = 'A janela de login do Google foi fechada.';
                break;
        }
        errorMessageDiv.textContent = message;
        errorMessageDiv.style.display = 'block';
    }

    // --- Lógica de Login/Cadastro ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        errorMessageDiv.style.display = 'none'; // Esconde erros antigos

        if (isLoginMode) {
            // Modo Login
            auth.signInWithEmailAndPassword(email, password)
                .then(userCredential => {
                    console.log('Login bem-sucedido:', userCredential.user);
                    // O onAuthStateChanged cuidará do redirecionamento
                })
                .catch(showAuthError);
        } else {
            // Modo Criar Conta
            auth.createUserWithEmailAndPassword(email, password)
                .then(userCredential => {
                    console.log('Conta criada com sucesso:', userCredential.user);
                     // O onAuthStateChanged cuidará do redirecionamento
                })
                .catch(showAuthError);
        }
    });

    // --- Lógica de Login com Google ---
    googleLoginBtn.addEventListener('click', () => {
        errorMessageDiv.style.display = 'none'; // Esconde erros antigos
        auth.signInWithPopup(googleProvider)
            .then(result => {
                console.log('Login com Google bem-sucedido:', result.user);
                // O onAuthStateChanged cuidará do redirecionamento
            })
            .catch(showAuthError);
    });
});

// CUIDADO: Substitua este objeto de configuração pelo seu próprio objeto de configuração do Firebase.
// Você pode obter isso no console do Firebase do seu projeto:
// Configurações do projeto > Geral > Seus aplicativos > Configuração do SDK > CDN.

const firebaseConfig = {
  apiKey: "AIzaSyBwWed-67OFzefRHUrisQ7v1hSLw0ISjC8",
  authDomain: "palavras-em-minutos-app.firebaseapp.com",
  projectId: "palavras-em-minutos-app",
  storageBucket: "palavras-em-minutos-app.firebasestorage.app",
  messagingSenderId: "893667373811",
  appId: "1:893667373811:web:f75413fc0955484e907d86",
  measurementId: "G-TXX8C4YKVP"
};

// Inicializa o Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  console.log(firebaseConfig)
}

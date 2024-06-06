// Importação dos scripts necessários
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Configuração do Firebase
firebase.initializeApp({
  apiKey: "AIzaSyDkm_812IuNTlR4UAFLhVHRImhc5_gT4iQ",
  authDomain: "shoal-236fc.firebaseapp.com",
  projectId: "shoal-236fc",
  storageBucket: "shoal-236fc.appspot.com",
  messagingSenderId: "1035096226642",
  appId: "1:1035096226642:web:e242f8b1aa0be98e36588b",
  measurementId: "G-TH0X2DT60Z"
});

// Inicializa o Firebase Messaging
const messaging = firebase.messaging();

// Lida com as mensagens de background
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Recebeu mensagem de background ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});

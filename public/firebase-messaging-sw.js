
importScripts('https://www.gstatic.com/firebasejs/8.2.8/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.8/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyBFHBv-fksCBJvM3WTE7-ZZwx1Wlu-E1OI",
  authDomain: "rustylynxgarage.firebaseapp.com",
  projectId: "rustylynxgarage",
  storageBucket: "rustylynxgarage.appspot.com",
  messagingSenderId: "346303087864",
  appId: "1:346303087864:web:fc069141fb8e0d4c9ce70d",
  measurementId: "G-FNRB3ZZ3J8"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'https://drynx.rustylynxgarage.com/images/drynx-icon-64.png'
  };
  self.registration.showNotification(payload.notification.title, notificationOptions);
});

messaging.setBackgroundMessageHandler(function(payload) {
    const notificationTitle = payload.title;
    const notificationOptions = {
        body: payload.body,
        icon: 'https://drynx.rustylynxgarage.com/images/drynx-icon-64.png'
    };

    return self.registration.showNotification('Rusty Lynx Garage', {body:'Recuerda transferir tus consumos del mes pasado'});
});
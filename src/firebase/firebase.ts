import firebase from 'firebase/app';
import 'firebase/firestore';

const config = {
  apiKey: 'AIzaSyBmccwTlo0eOJn3sNruUm6fy6Lgk4vE17E',
  authDomain: 'renova-errores-2.firebaseapp.com',
  projectId: 'renova-errores-2',
  storageBucket: 'renova-errores-2.appspot.com',
  messagingSenderId: '185921053927',
  appId: '1:185921053927:web:b3d937cb77113bdab3ee42',
  measurementId: 'G-35TXV6T0RC',
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const firestore = firebase.firestore();

export { firestore };

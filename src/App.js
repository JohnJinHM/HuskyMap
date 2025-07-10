import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { getFirestore, collection, onSnapshot, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import PinPopup from './PinPopup';

console.log("API Key:", process.env.REACT_APP_FIREBASE_API_KEY);
console.log("API Key:", process.env.REACT_APP_GOOGLE_API_KEY);

const firebaseConfig = {   
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "husky-map.firebaseapp.com",
  projectId: "husky-map",
  storageBucket: "husky-map.firebasestorage.app",
  messagingSenderId: "664895776687",
  appId: "1:664895776687:web:b249929739e263c755715a",
  measurementId: "G-7CZN77T0SR"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export default function App() {
const [pins, setPins] = useState([]);
const [selectedPin, setSelectedPin] = useState(null);

useEffect(() => {
  const unsub = onSnapshot(collection(db, 'pins'), snap => {
    setPins(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
  return unsub;
}, []);

// const handleMapClick = e => {
//   const user = auth.currentUser;
//   if (!user) return alert('Please sign in!');
//   const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
//   addDoc(collection(db, 'pins'), {
//     ...pos, ownerUid: user.uid, title: 'New Pin', createdAt: new Date()
//   });
// };

return (
  <APIProvider apiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
        <Map center={{ lat: 47.6, lng: -122.3 }} zoom={12}
          style={{width:'100vw',height:'100vh'}}>
    {/* <Map center={{ lat: 47.6, lng: -122.3 }} zoom={12}
          onClick={handleMapClick} style={{width:'100vw',height:'100vh'}}> */}
      {pins.map(pin => (
        <AdvancedMarker key={pin.id}
          position={pin}
          onClick={() => setSelectedPin(pin)}>
          <div className="pin-icon">{pin.title}</div>
        </AdvancedMarker>
      ))}
      {selectedPin && (
        <PinPopup pin={selectedPin}
          close={() => setSelectedPin(null)}
          db={db} auth={auth} />
      )}
    </Map>
  </APIProvider>
);
}

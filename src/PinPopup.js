import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';

export default function PinPopup({ pin, close, db, auth }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'pins', pin.id, 'comments'),
      snap => setComments(snap.docs.map(d => d.data()))
    );
    return unsub;
  }, [db, pin.id]);

  const submit = () => {
    const user = auth.currentUser;
    if (!user || !text) return;
    addDoc(collection(db, 'pins', pin.id, 'comments'), {
      text, userUid: user.uid, timestamp: new Date()
    });
    setText('');
  };

  return (
    <div className="popup">
      <button onClick={close}>X</button>
      <h3>{pin.title}</h3>
      <div className="comments">
        {comments.map((c,i) => <p key={i}>{c.text}</p>)}
      </div>
      <input value={text}
             onChange={e => setText(e.target.value)}
             placeholder="Add comment" />
      <button onClick={submit}>Send</button>
    </div>
  );
}
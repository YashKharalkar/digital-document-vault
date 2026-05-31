import { useState } from 'react';

const toasts = [];
let setToastsGlobal = null;

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  setToastsGlobal = setItems;

  const remove = (id) => setItems(prev => prev.filter(t => t.id !== id));

  return (
    <>
      {children}
      <div className="toast-container">
        {items.map(t => (
          <div key={t.id} className={`toast ${t.type}`} onClick={() => remove(t.id)}>
            {t.message}
          </div>
        ))}
      </div>
    </>
  );
}

let _id = 0;
export function toast(message, type = 'success') {
  if (!setToastsGlobal) return;
  const id = ++_id;
  setToastsGlobal(prev => [...prev, { id, message, type }]);
  setTimeout(() => {
    setToastsGlobal(prev => prev.filter(t => t.id !== id));
  }, 3500);
}

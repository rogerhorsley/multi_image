import React from 'react';

// 简单的toast实现
const toastContext = React.createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);
  
  const toast = React.useCallback(({ title, description, variant = 'default' }) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { id, title, description, variant };
    
    setToasts(prev => [...prev, newToast]);
    
    // 3秒后自动移除
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);
  
  return (
    <toastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`p-4 rounded-md shadow-lg max-w-sm ${
              toast.variant === 'destructive' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-800 text-white border border-gray-700'
            }`}
          >
            {toast.title && <div className="font-semibold">{toast.title}</div>}
            {toast.description && <div className="text-sm opacity-90">{toast.description}</div>}
          </div>
        ))}
      </div>
    </toastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(toastContext);
  if (!context) {
    return {
      toast: ({ title, description }) => {
        console.log('Toast:', title, description);
        alert(`${title}: ${description}`);
      }
    };
  }
  return context;
}
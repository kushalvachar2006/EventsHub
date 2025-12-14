import React, { createContext, useCallback, useContext, useMemo } from "react";
import toast from "react-hot-toast";

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const show = useCallback((message, variant = "info", duration = 3000) => {
    if (variant === "success") {
      return toast.success(message, { duration });
    } else if (variant === "error") {
      return toast.error(message, { duration });
    } else {
      return toast(message, { duration });
    }
  }, []);

  const dismiss = useCallback((id) => {
    toast.dismiss(id);
  }, []);

  const value = useMemo(() => ({ show, dismiss }), [show, dismiss]);

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
};

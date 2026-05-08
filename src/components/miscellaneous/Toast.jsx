import React from "react";
import { useSelector } from "react-redux";

const Toast = () => {
  let toast = useSelector((state) => state.toast);
  return (
    <div className={`fixed bottom-4 right-3 z-150 px-4 py-2 bg-[#6963e1e2] border border-[#817add] rounded text-white/80 text-sm ${toast.show ? 'block' : 'hidden'}`}>
      {toast.message}
    </div>
  );
};

export default Toast;

import React from "react";
import { useSelector } from "react-redux";

const Toast = () => {
  let toast = useSelector((state) => state.toast);
  return (
    <div className={`fixed bottom-4 right-3 z-150 px-4 py-2 bg-[rgba(138,133,232,0.5)] border border-[#8884d8] rounded text-white/80 text-sm ${toast.show ? 'block' : 'hidden'}`}>
      {toast.message}
    </div>
  );
};

export default Toast;

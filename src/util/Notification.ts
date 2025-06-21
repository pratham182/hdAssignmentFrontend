import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { ToastPosition } from "react-toastify";


import "./styles.css";

type ToastType = "info" | "success" | "warning" | "error" | "default";
export const Notification = (msg:String, type:ToastType = "default") => {
  const options = {
    autoClose: 1500,
    type: type,
    hideProgressBar: false,
    position: "top-right" as ToastPosition,
    pauseOnHover: false,
    transition: Bounce,
    className: "custom-toast",
  };
  return toast(msg, options);
};

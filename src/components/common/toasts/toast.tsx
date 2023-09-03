import { toast, ToastContainer } from "react-toastify";

const AUTOCLOSE_ONE_SECOND = 1000;
const AUTOCLOSE_THREE_SECONDS = 3000;

const DEFAULT_SUCCESS_MESSAGE = "Operation successfully finished 👍";
const DEFAULT_WARNING_MESSAGE = "Warning on this operation";
const DEFAULT_ERROR_MESSAGE =
  "An error occured while performing this operation ⚠️";

const DEFAULT_PROMISE_PENDING_MESSAGE = "Promise is pending...";
const DEFAULT_PROMISE_SUCCESS_MESSAGE = "Promise resolved 👍";
const DEFAULT_PROMISE_ERROR_MESSAGE = "Promise rejected 👎";

export const Toast = () => (
  <ToastContainer toastStyle={{ boxShadow: "none" }} />
);

export type ToastProps = {
  message?: string;
};

export type ToastPromiseMessageProps = {
  success?: string;
  pending?: string;
  error?: string;
};

export type ToastPromiseProps = {
  promise: Promise<unknown>;
  messages?: ToastPromiseMessageProps;
};

export const notifySuccess = ({ message }: ToastProps) =>
  toast.success(message || DEFAULT_SUCCESS_MESSAGE, {
    position: "bottom-left",
    autoClose: AUTOCLOSE_THREE_SECONDS,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "colored",
    style: { backgroundColor: "rgb(59 130 246)" },
  });

export const notifyWarning = ({ message }: ToastProps) =>
  toast.warn(message || DEFAULT_WARNING_MESSAGE, {
    position: "bottom-left",
    autoClose: AUTOCLOSE_ONE_SECOND,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "colored",
    style: { backgroundColor: "rgb(245 158 11)" },
  });

export const notifyError = ({ message }: ToastProps) =>
  toast.error(message || DEFAULT_ERROR_MESSAGE, {
    position: "bottom-left",
    autoClose: AUTOCLOSE_THREE_SECONDS,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "colored",
    style: { backgroundColor: "rgb(239 68 68)" },
  });

export const notifyPromise = ({ promise, messages }: ToastPromiseProps) =>
  toast.promise(promise, {
    pending: {
      render: messages?.pending || DEFAULT_PROMISE_PENDING_MESSAGE,
      position: "top-center",
      autoClose: AUTOCLOSE_THREE_SECONDS,
      hideProgressBar: true,
      closeOnClick: true,
      draggable: false,
      progress: undefined,
      theme: "colored",
    },
    success: {
      render: messages?.success || DEFAULT_PROMISE_SUCCESS_MESSAGE,
      position: "top-center",
      autoClose: AUTOCLOSE_THREE_SECONDS,
      hideProgressBar: true,
      closeOnClick: true,
      draggable: false,
      progress: undefined,
      theme: "colored",
    },
    error: {
      render: messages?.error || DEFAULT_PROMISE_ERROR_MESSAGE,
      position: "top-center",
      autoClose: AUTOCLOSE_THREE_SECONDS,
      hideProgressBar: true,
      closeOnClick: true,
      draggable: false,
      progress: undefined,
      theme: "colored",
    },
  });

// export const OdysseyToastContainer = styled(ToastContainer)`
//   .Toastify__toast-theme--colored.Toastify__toast--default {
//     background-color: ${colors.white};
//   }
//   .Toastify__toast-theme--colored.Toastify__toast--info {
//     background-color: ${colors.white};
//   }
//   .Toastify__toast-theme--colored.Toastify__toast--success {
//     background-color: ${colors.green500};
//   }
//   .Toastify__toast-theme--colored.Toastify__toast--warning {
//     background-color: ${colors.orange500};
//   }
//   .Toastify__toast-theme--colored.Toastify__toast--error {
//     background-color: ${colors.red500};
//   }
// `

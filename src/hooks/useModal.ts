import { useRef, useState } from "react";

const useModal = () => {
  const [open, setOpen] = useState(false);
  const initialFocus = useRef(null);

  return { open, setOpen, initialFocus };
};

export default useModal;

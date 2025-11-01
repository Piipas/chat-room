import { handlelBeforeHandle, handleClose, handleMessage, handleOpen } from "../controllers/websocket-controller";

export default (app: any) => {
  app.ws("/ws/:conversationId", {
    beforeHandle: handlelBeforeHandle,
    open: handleOpen,
    message: handleMessage,
    close: handleClose,
  });
};

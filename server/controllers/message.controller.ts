import express, { Response, Request } from 'express';
import { FakeSOSocket } from '../types/socket';
import { AddMessageRequest, Message } from '../types/types';
import { saveMessage, getMessages } from '../services/message.service';

const messageController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Checks if the provided message request contains the required fields.
   *
   * @param req The request object containing the message data.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  const isRequestValid = (req: AddMessageRequest): boolean =>
    // TODO: Task 2 - Implement the isRequestValid function
    req.body && req.body.messageToAdd !== undefined && typeof req.body.messageToAdd === 'object';

  /**
   * Validates the Message object to ensure it contains the required fields.
   *
   * @param message The message to validate.
   *
   * @returns `true` if the message is valid, otherwise `false`.
   */
  const isMessageValid = (message: Message): boolean =>
    // TODO: Task 2 - Implement the isMessageValid function
    {
      if (!message) return false;
      const { msg, msgFrom, msgDateTime } = message;
      return (
        typeof msg === 'string' &&
        msg.trim().length > 0 &&
        typeof msgFrom === 'string' &&
        msgFrom.trim().length > 0 &&
        (msgDateTime instanceof Date || !Number.isNaN(new Date(msgDateTime).getTime()))
      );
    };

  /**
   * Handles adding a new message. The message is first validated and then saved.
   * If the message is invalid or saving fails, the HTTP response status is updated.
   *
   * @param req The AddMessageRequest object containing the message and chat data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addMessageRoute = async (req: AddMessageRequest, res: Response): Promise<void> => {
    /**
     * TODO: Task 2 - Implement the addMessageRoute function.
     * Note: you will need to uncomment the line below. Refer to other controller files for guidance.
     * This emits a message update event to the client. When should you emit this event? You can find the socket event definition in the server/types/socket.d.ts file.
     */
    // socket.emit('messageUpdate', { msg: msgFromDb });
    if (!isRequestValid(req)) {
      res.status(400).send({ error: 'Invalid request body' });
      return;
    }

    const message = req.body.messageToAdd;

    if (!isMessageValid(message)) {
      res.status(400).send({ error: 'Invalid message fields' });
      return;
    }

    const msgFromDb = await saveMessage(message);

    if ('error' in msgFromDb) {
      res.status(500).send({ error: msgFromDb.error });
      return;
    }

    socket.emit('messageUpdate', { msg: msgFromDb });

    res.status(200).send(msgFromDb);
  };

  /**
   * Fetch all messages in descending order of their date and time.
   * @param req The request object.
   * @param res The HTTP response object used to send back the messages.
   * @returns A Promise that resolves to void.
   */
  const getMessagesRoute = async (req: Request, res: Response): Promise<void> => {
    // TODO: Task 2 - Implement the getMessagesRoute function
    try {
      const messages = await getMessages();
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  };

  // Add appropriate HTTP verbs and their endpoints to the router
  router.post('/addMessage', addMessageRoute);
  router.get('/getMessages', getMessagesRoute);

  return router;
};

export default messageController;

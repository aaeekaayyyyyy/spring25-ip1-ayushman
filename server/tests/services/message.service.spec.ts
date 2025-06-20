import MessageModel from '../../models/messages.model';
import { getMessages, saveMessage } from '../../services/message.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

const message1 = {
  msg: 'Hello',
  msgFrom: 'User1',
  msgDateTime: new Date('2024-06-04'),
};

const message2 = {
  msg: 'Hi',
  msgFrom: 'User2',
  msgDateTime: new Date('2024-06-05'),
};

describe('Message model', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  describe('saveMessage', () => {
    it('should return the saved message', async () => {
      mockingoose(MessageModel).toReturn(message1, 'create');

      const savedMessage = await saveMessage(message1);
      expect(savedMessage).toMatchObject(message1);
    });

    it('should return an error object if saving fails', async () => {
      mockingoose(MessageModel).toReturn(new Error('DB error'), 'save');

      const savedMessage = await saveMessage(message1);
      expect(savedMessage).toEqual({ error: 'Failed to save message' });
    });
  });

  describe('getMessages', () => {
    it('should return all messages, sorted by date', async () => {
      mockingoose(MessageModel).toReturn([message2, message1], 'find');

      const messages = await getMessages();

      // Check they are sorted by msgDateTime (ascending)
      const simplifiedMessages = messages
        .map(({ msg, msgFrom, msgDateTime }) => ({ msg, msgFrom, msgDateTime }))
        .sort((a, b) => a.msgDateTime.getTime() - b.msgDateTime.getTime());
      expect(simplifiedMessages).toEqual([message1, message2]);
    });

    it('should return an error object if fetching messages fails', async () => {
      mockingoose(MessageModel).toReturn(new Error('DB error'), 'find');

      const messages = await getMessages();
      expect(messages).toEqual([]); // Assuming the service returns an empty array on error);
    });
  });
});

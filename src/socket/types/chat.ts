import { MessageDto } from './message';
export interface ServertoClient {
  newMessage: (payload: MessageDto, client: string) => void;
}

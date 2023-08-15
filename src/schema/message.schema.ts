import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class Message extends Document{
	@Prop({ require: true})
	creator: string;

	@Prop({require: true})
	message: string;

	@Prop({require: true})
	roomId: string;

	@Prop({require: true})
	createAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);


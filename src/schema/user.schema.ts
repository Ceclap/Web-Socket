import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ unique: true, require: true })
  email: string;

  @Prop({ require: true })
  passwordHash: string;

  @Prop({ require: true })
  username: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

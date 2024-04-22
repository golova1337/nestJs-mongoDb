import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { userRoles } from 'src/authentication/enum/user-roles-enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ type: String, unique: true, required: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: Date, default: Date.now })
  createAt: Date;

  @Prop({ type: Date, default: Date.now })
  updateAt: Date;

  @Prop({ enum: userRoles, default: userRoles.User })
  role: userRoles;

  @Prop({ unique: true, default: null })
  token: string | null;

  @Prop({ default: null })
  expiresIn: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);

import mongoose, { Model } from 'mongoose';
import userSchema from './schema/user.schema';
import { User } from '../types/types';

/**
 * Mongoose model for the `User` collection.
 *
 * This model is created using the `User` interface and the `userSchema`, representing the
 * `User` collection in the MongoDB database, and provides an interface for interacting with
 * the stored users.
 *
 * @type {Model<User>}
 */
// TODO: Task 1 - Create and export the `UserModel` model. Refer to other model files for guidance.
const UserModel: Model<User> = mongoose.models.User || mongoose.model<User>('User', userSchema);
export default UserModel;

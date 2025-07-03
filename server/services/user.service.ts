import UserModel from '../models/users.model';
import { SafeUser, User, UserCredentials, UserResponse } from '../types/types';

/**
 * Helper to strip password and return a SafeUser
 */
const toSafeUser = (user: User): SafeUser => ({
  username: user.username,
  dateJoined: user.dateJoined,
  _id: user._id,
});

/**
 * Saves a new user to the database.
 *
 * @param {User} user - The user object to be saved, containing user details like username, password, etc.
 * @returns {Promise<UserResponse>} - Resolves with the saved user object (without the password) or an error message.
 */
export const saveUser = async (user: User): Promise<UserResponse> =>
  // TODO: Task 1 - Implement the saveUser function. Refer to other service files for guidance.
  {
    try {
      const existing = await UserModel.findOne({ username: user.username }).select('-password');
      if (existing) return { error: 'Username already exists' };

      const newUser = new UserModel(user);
      const saved = await newUser.save();
      return toSafeUser(saved.toObject());
    } catch (err) {
      return { error: 'Failed to save user' };
    }
  };

/**
 * Retrieves a user from the database by their username.
 *
 * @param {string} username - The username of the user to find.
 * @returns {Promise<UserResponse>} - Resolves with the found user object (without the password) or an error message.
 */
export const getUserByUsername = async (username: string): Promise<UserResponse> =>
  // TODO: Task 1 - Implement the getUserByUsername function. Refer to other service files for guidance.
  {
    try {
      const user = await UserModel.findOne({ username }).select('-password').exec();
      if (!user) return { error: 'User not found' };
      return toSafeUser(user.toObject());
    } catch (err) {
      return { error: 'Error retrieving user' };
    }
  };

/**
 * Authenticates a user by verifying their username and password.
 *
 * @param {UserCredentials} loginCredentials - An object containing the username and password.
 * @returns {Promise<UserResponse>} - Resolves with the authenticated user object (without the password) or an error message.
 */
export const loginUser = async (loginCredentials: UserCredentials): Promise<UserResponse> =>
  // TODO: Task 1 - Implement the loginUser function. Refer to other service files for guidance.
  {
    try {
      const user = await UserModel.findOne({ username: loginCredentials.username })
        .select('-password')
        .exec();
      if (!user) return { error: 'Invalid username or password' };

      if (user.password !== loginCredentials.password) {
        return { error: 'Invalid username or password' };
      }

      return toSafeUser(user.toObject());
    } catch (err) {
      return { error: 'Login failed' };
    }
  };

/**
 * Deletes a user from the database by their username.
 *
 * @param {string} username - The username of the user to delete.
 * @returns {Promise<UserResponse>} - Resolves with the deleted user object (without the password) or an error message.
 */
export const deleteUserByUsername = async (username: string): Promise<UserResponse> =>
  // TODO: Task 1 - Implement the deleteUserByUsername function. Refer to other service files for guidance.
  {
    try {
      const user = await UserModel.findOneAndDelete({ username }).exec();
      if (!user) return { error: 'User not found' };
      return toSafeUser(user.toObject());
    } catch (err) {
      return { error: 'Failed to delete user' };
    }
  };

/**
 * Updates user information in the database.
 *
 * @param {string} username - The username of the user to update.
 * @param {Partial<User>} updates - An object containing the fields to update and their new values.
 * @returns {Promise<UserResponse>} - Resolves with the updated user object (without the password) or an error message.
 */
export const updateUser = async (username: string, updates: Partial<User>): Promise<UserResponse> =>
  // TODO: Task 1 - Implement the updateUser function. Refer to other service files for guidance.
  {
    try {
      const updated = await UserModel.findOneAndUpdate(
        { username },
        { $set: updates },
        { new: true },
      ).exec();

      if (!updated) return { error: 'User not found' };
      return toSafeUser(updated.toObject());
    } catch (err) {
      return { error: 'Failed to update user' };
    }
  };

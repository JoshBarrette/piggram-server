import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schemas/user.schema";
import { Model } from "mongoose";
import { UserDto } from "./schemas/user.dto";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  /**
   * Handles getting a user's public profile.
   * @param id The id of the user's profile to get.
   * @returns the profile the given user.
   */
  async handleGetProfile(id: string) {
    let user: User;
    try {
      user = await this.getUserById(id);
      if (!user) throw new Error();
    } catch {
      return { profileFound: false };
    }

    return {
      profileFound: true,
      profile: {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        followingCount: user.followingCount,
        followersCount: user.followersCount,
        joinDate: user.createdAt,
      },
    };
  }

  /**
   * Adds a new User to the DB.
   * @param newUser The user to add.
   * @returns The added user.
   */
  async addUser(newUser: UserDto): Promise<User> {
    return await this.userModel.create(newUser);
  }

  /**
   * Queries the DB for a User based on their id.
   * @param id The id of the User we are looking for.
   * @returns The User with the given id.
   */
  getUserById(id: string): Promise<User> {
    return this.userModel.findOne({ _id: id });
  }

  /**
   * Queries the DB for a User based on their email.
   * @param email The email of the User we are looking for.
   * @returns The User with the given email.
   */
  getUserByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email });
  }

  /**
   * Updates a User's picture after finding them with their email
   * @param picture The URL of the new picture
   * @param email The email of the User we are updating
   */
  async updateUserPicture(picture: string, email: string) {
    // If we don't await then the update won't go through
    return await this.userModel.findOneAndUpdate(
      { email: email },
      { $set: { picture } },
      { new: true },
    );
  }

  /**
   * Increment/decrement a user's following count by
   * a given value.
   * @param userId The ID of the user we want to change.
   * @param change The change in the following count.
   * @returns The Updated user.
   */
  async updateFollowingCount(userId: string, change: number) {
    const user = await this.userModel.findById(userId);

    if (user.followingCount === 0 && change < 0) {
      return;
    }

    return await this.userModel.findOneAndUpdate(
      { _id: userId },
      { $inc: { followingCount: change } },
      { new: true },
    );
  }

  /**
   * Increment/decrement a user's followers count by
   * a given value.
   * @param userId The ID of the user we want to change.
   * @param change The change in the followers count.
   * @returns The Updated user.
   */
  async updateFollowersCount(userId: string, change: number) {
    const user = await this.userModel.findById(userId);

    if (user.followersCount === 0 && change < 0) {
      return;
    }

    return await this.userModel.findOneAndUpdate(
      { _id: userId },
      { $inc: { followersCount: change } },
      { new: true },
    );
  }
}

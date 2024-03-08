import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import { UsersService } from "src/users/users.service";

/**
 * Sets the user object from Google
 */
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(private readonly usersService: UsersService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/google/redirect`,
      scope: ["profile", "email"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const { name, emails, photos } = profile;
    const newUser = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
    };

    let userQuery = await this.usersService.getUserByEmail(emails[0].value);
    if (!userQuery) {
      userQuery = await this.usersService.addUser(newUser);
    } else if (newUser.picture !== userQuery.picture) {
      this.usersService.updateUserPicture(newUser.picture, newUser.email);
    }

    done(null, { userId: userQuery._id.toString(), ...newUser });
  }
}

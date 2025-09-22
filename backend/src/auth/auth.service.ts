import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

/**
 * Service responsible for handling authentication-related operations
 * @class AuthService
 * @decorator @Injectable()
 */
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Validates a user's credentials
   * @param {string} email - The user's email address
   * @param {string} pass - The plain text password to validate
   * @returns {Promise<any>} The user object without the password if valid, null otherwise
   */
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * Generates a JWT token for an authenticated user
   * @param {any} user - The authenticated user object
   * @returns {Object} An object containing the JWT access token
   */
  async login(user: any) {
    const payload = { email: user._doc.email, sub: user._doc._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Hashes a plain text password using bcrypt
   * @param {string} password - The plain text password to hash
   * @returns {Promise<string>} A promise that resolves to the hashed password
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // We don't want to reveal that the user does not exist
      return { message: 'If a user with that email exists, a password reset link has been sent.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.passwordResetToken = passwordResetToken;
    user.passwordResetExpires = passwordResetExpires;
    await user.save();

    const resetUrl = `http://localhost:3000/auth/reset-password?token=${resetToken}`;
    console.log('Password reset link:', resetUrl);

    return { message: 'If a user with that email exists, a password reset link has been sent.' };
  }

  async resetPassword(token: string, pass: string): Promise<{ message: string }> {
    const passwordResetToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await this.usersService.findByPasswordResetToken(passwordResetToken);

    if (!user) {
      throw new UnauthorizedException('Invalid or expired token.');
    }

    user.password = await this.hashPassword(pass);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return { message: 'Password has been reset.' };
  }
}

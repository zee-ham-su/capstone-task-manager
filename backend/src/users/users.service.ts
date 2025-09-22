import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { EntityNotFoundException } from '../common/exceptions/entity-not-found.exception';
import { AuthService } from '../auth/auth.service';
import { NotificationService } from '../notification/notification.service';

/**
 * Service responsible for handling user-related operations
 * @class UsersService
 * @decorator @Injectable()
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
    private notificationService: NotificationService,
  ) {}

  /**
   * Creates a new user with the provided data
   * @param {CreateUserDto} createUserDto - The data for creating a new user
   * @returns {Promise<User>} A promise that resolves to the created user
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.authService.hashPassword(
      createUserDto.password,
    );
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    const savedUser = await createdUser.save();

    await this.notificationService.sendEmail(
      savedUser.email,
      'Welcome to Task Manager',
      'welcome',
      { name: savedUser.name },
    );

    return savedUser;
  }

  /**
   * Finds a user by their email address
   * @param {string} email - The email address to search for
   * @returns {Promise<User | null>} The user if found, null otherwise
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  /**
   * Finds a user by their password reset token
   * @param {string} token - The password reset token to search for
   * @returns {Promise<UserDocument | null>} The user if found, null otherwise
   */
  async findByPasswordResetToken(token: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ passwordResetToken: token, passwordResetExpires: { $gt: new Date() } }).exec();
  }

  /**
   * Retrieves a list of all users
   * @returns {Promise<UserDocument[]>} A promise that resolves to a list of all users
   */
  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  /**
   * Finds a user by their ID
   * @param {string} id - The ID of the user to find
   * @returns {Promise<User>} The found user
   * @throws {EntityNotFoundException} If no user is found with the given ID
   */
  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new EntityNotFoundException('User');
    }
    return user;
  }

  /**
   * Updates a user's information
   * @param {string} id - The ID of the user to update
   * @param {UpdateUserDto} updateUserDto - The data to update the user with
   * @returns {Promise<User>} The updated user
   * @throws {EntityNotFoundException} If no user is found with the given ID
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!updatedUser) {
      throw new EntityNotFoundException('User');
    }
    return updatedUser;
  }

  /**
   * Removes a user by their ID
   * @param {string} id - The ID of the user to remove
   * @returns {Promise<void>}
   * @throws {EntityNotFoundException} If no user is found with the given ID
   */
  async remove(id: string): Promise<void> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new EntityNotFoundException('User');
    }
    return deletedUser;
  }
}

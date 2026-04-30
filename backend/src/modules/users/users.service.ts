import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async create(data: Partial<User>) {
        return await this.userModel.create(data);
    }

    async findByEmail(email: string) {
        return await this.userModel.findOne({ email });
    }
}

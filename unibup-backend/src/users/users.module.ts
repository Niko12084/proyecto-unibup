import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './services/users.service';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';
import { ValidateUsersService } from './services/validate-user.service';

@Module({
    imports: [DatabaseModule],
    controllers: [UsersController],
    providers: [UsersService, ValidateUsersService]
})
export class UsersModule { }

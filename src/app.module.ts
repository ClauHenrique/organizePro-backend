import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import 'dotenv/config'

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_HOST),
  UserModule,
  AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

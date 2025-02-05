import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { MoviesController } from './movies/movies.controller';
import { MoviesService } from './movies/movies.service';
import { MoviesModule } from './movies/movies.module';
import { HttpModule } from '@nestjs/axios';
import { ReservationModule } from './reservation/reservation.module';

@Module({
  imports: [AuthModule, UserModule, PrismaModule, MoviesModule, HttpModule, ReservationModule],
  controllers: [AppController, MoviesController],
  providers: [AppService, PrismaService, MoviesService],
})
export class AppModule {}

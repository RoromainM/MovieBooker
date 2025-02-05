import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ReservationController],
  providers: [ReservationService],
  imports: [PrismaModule],
})
export class ReservationModule {}

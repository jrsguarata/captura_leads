import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowupService } from './followup.service';
import { FollowupController } from './followup.controller';
import { Followup } from './entities/followup.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Followup])],
  controllers: [FollowupController],
  providers: [FollowupService],
  exports: [FollowupService],
})
export class FollowupModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './config/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { InteressadosModule } from './modules/interessados/interessados.module';
import { QualificacaoModule } from './modules/qualificacao/qualificacao.module';
import { RespostasModule } from './modules/respostas/respostas.module';
import { DuvidasModule } from './modules/duvidas/duvidas.module';
import { FollowupModule } from './modules/followup/followup.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true, // Auto-create tables in development
    }),
    AuthModule,
    UsersModule,
    InteressadosModule,
    QualificacaoModule,
    RespostasModule,
    DuvidasModule,
    FollowupModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

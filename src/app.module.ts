import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './logger.middleware';
import { StudentsModule } from './students/students.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProfileModule } from './profiles/profile.module';
import { DatabaseModule } from './database/database.module';
import { DepartmentsModule } from './departments/departments.module';
import { CoursesModule } from './courses/courses.module';
import { LogsModule } from './logs/logs.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { createKeyv, Keyv } from '@keyv/redis';
import { CacheableMemory } from 'cacheable';
import { LecturerModule } from './lecturer/lecturer.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './auth/guards';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    StudentsModule,
    ProfileModule,
    DatabaseModule,
    DepartmentsModule,
    CoursesModule,
    // SeedModule,
    LogsModule,
    LecturerModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: (configService: ConfigService) => {
        return {
          ttl: 60000, // 60 sec: Cache time-to-live
          stores: [
            new Keyv({
              store: new CacheableMemory({ ttl: 30000, lruSize: 5000 }),
            }),
            createKeyv(configService.getOrThrow<string>('REDIS_URL')),
          ],
        };
      },
    }),
    AuthModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.getOrThrow('THROTTLE_TTL'),
          limit: config.getOrThrow('THROTTLE_LIMIT'),
          ignoreUserAgents: [/^curl\//, /^PostmanRuntime\//], // Ignore requests from curl and Postman
        },
      ],
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: 'APP_INTERCEPTOR',
      useClass: CacheInterceptor, // Global cache interceptor to cache responses
    },
    {
      provide: APP_GUARD,
      useClass: AtGuard, // Global guard to protect routes
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // Global throttler guard to limit requests
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('students', 'profiles', 'courses', 'lectures', 'departments');
  }
}

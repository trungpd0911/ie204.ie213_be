import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { BillModule } from './bills/bill.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { UsersService } from './users/users.service';
import { DishesModule } from './dishes/dishes.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppLoggerMiddleware } from './middlewares/logging-middleware';
import { MenusModule } from './menus/menus.module';
import { CommentsModule } from './comments/comments.module';

@Module({
	imports: [
		// ThrottlerModule.forRoot([{
		// 	ttl: 3000,
		// 	limit: 2,
		// }]),
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env',
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				uri: configService.get<string>('DB_URL'),
			}),
		}),
		JwtModule.registerAsync({
			global: true,
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (
				configService: ConfigService,
			): Promise<JwtModuleOptions> => ({
				secret: configService.get<string>('JWT_SECRET'),
				signOptions: {
					expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
				},
			}),
		}),
		AuthModule,
		UsersModule,
		PostsModule,
		BillModule,
		CloudinaryModule,
		DishesModule,
		MenusModule,
		CommentsModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer.apply(AppLoggerMiddleware).forRoutes('*');
	}
}

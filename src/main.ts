import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from 'node_modules/@nestjs/swagger/dist';
import { BadRequestException, ValidationPipe } from 'node_modules/@nestjs/common';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule) as any;

  const config = new DocumentBuilder()
    .setTitle('D2D API')
    .setDescription('API documentation for the D2D application')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('https://test-levh.onrender.com/api/v1/', 'Prod server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/api-docs', app, document, {
    customfavIcon: '/app_icon.png',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      forbidNonWhitelisted: false,

      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((err) => {
          return Object.values(err.constraints || {});
        }).flat();

        return new BadRequestException({
          statusCode: 400,
          message: formattedErrors[0],
          error: 'Bad Request',
        });
      },
    }),
    //new UpperCasePipe()
  );

  //app.useGlobalInterceptors(new UppercaseInterceptor());

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  app.setGlobalPrefix('api/v1');
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
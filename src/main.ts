import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
   const app = await NestFactory.create(AppModule);
   const options = new DocumentBuilder()
   .setTitle('Nest JS API Docs')
   .setDescription('Nest JS API description')
   .setVersion('1.0')
   .addBearerAuth()
   .build();
   const document = SwaggerModule.createDocument(app, options);
   SwaggerModule.setup('docs', app, document);
   await app.listen(3000);
}
bootstrap();

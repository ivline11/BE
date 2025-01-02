import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function swaggerSetUp(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('kovac')
    .setDescription('kovac API 문서')
    .setVersion('0.0.1')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api-docs', app, document);
}

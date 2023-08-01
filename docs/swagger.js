import swaggerJSDoc from 'swagger-jsdoc';
import env from 'dotenv';

env.config();

const swaggerServer = process.env.SWAGGER_SERVER;

const options = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'PREDETORS E-COMMERCE PROJECT',
      version: '1.0.0',
      description: 'ATLP Rwanda, Predetors team, E-commerce project',
    },
    servers: [{ url: swaggerServer }],
    components: {
      securitySchemes: {
        google_auth: {
          type: 'oauth2',
          flows: {
            authorizationCode: {
              authorizationUrl: process.env.GOOGLE_CALLBACK_URL,
            },
          },
        },
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./docs/*.js', './docs/*.yml'],
};

const Swagger = swaggerJSDoc(options);

export default Swagger;

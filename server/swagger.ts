import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Phaser Editor API',
      version: '1.0.0',
      description: 'API for the Phaser Editor',
    },
    servers: [
      {
        url: 'http://localhost:3001',
      },
    ],
  },
  apis: ['./index.ts'], // files containing annotations as above
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;

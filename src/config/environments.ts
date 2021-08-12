import dotenv from 'dotenv';

const environment = dotenv.config({
  path: './src/.env',
});

// eslint-disable-next-line no-undef
if (process.env.NODE_ENV !== 'production') {
  if (environment.error) {
    throw environment.error;
  }
}

export default environment;

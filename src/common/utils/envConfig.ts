import dotenv from 'dotenv';
import { cleanEnv, host, num, port, str, testOnly } from 'envalid';

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ devDefault: testOnly('test'), choices: ['development', 'production', 'test'] }),
  HOST: host({ devDefault: testOnly('localhost') }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str({ devDefault: testOnly('http://localhost:3000') }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(1000) }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1000) }),
  JWT_SECRET: str({ devDefault: testOnly('qwerty') }),
  MAIL_HOST: str({ devDefault: testOnly('gmail') }),
  MAIL_USERNAME: str({ devDefault: testOnly('testemailforinterviews@gmail.com') }),
  MAIL_PASSWORD: str({ devDefault: testOnly('testemailforinterviewspassword') }),

  MPESA_CONSUMER_SECRET: str({ devDefault: testOnly('xxxxxx') }),
  MPESA_CONSUMER_KEY: str({ devDefault: testOnly('xxxxxx') }),
  MPESA_PASS_KEY: str({ devDefault: testOnly('xxxxxx') }),
  MPESA_BUSINESS_SHORT_CODE: str({ devDefault: testOnly('xxxxxx') }),
  CALLBACK_URL: str({ devDefault: testOnly('http://example.com') }),

});

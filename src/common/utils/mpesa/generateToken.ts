import axios from 'axios';
import { env } from '@/common/utils/envConfig';

export const generateToken = async () => {
  const CONSUMER_KEY = env.MPESA_CONSUMER_KEY as string;
  const CONSUMER_SECRET = env.MPESA_CONSUMER_SECRET as string;
  const URL = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

  try {
    const response = await axios(URL, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    return response.data.access_token;
  } catch (error: any) {
    throw new Error(`Failed to generate access token: ${error.message}`);
  }
};

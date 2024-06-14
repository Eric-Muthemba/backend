import axios from 'axios';

import { env } from '@/common/utils/envConfig';
import { generateToken } from '@/common/utils/mpesa/generateToken';
import { timestamp } from '@/common/utils/mpesa/timeStamp';

const handleStkPush = async (phone_number: string, amount: number) => {
  const BUSINESS_SHORT_CODE = env.MPESA_BUSINESS_SHORT_CODE as string;

  const password = Buffer.from(BUSINESS_SHORT_CODE + env.MPESA_PASS_KEY + timestamp).toString('base64');

  console.log(BUSINESS_SHORT_CODE);
  console.log(env.MPESA_PASS_KEY);
  console.log(timestamp);
  const payload = {
    BusinessShortCode: BUSINESS_SHORT_CODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: phone_number,
    PartyB: env.MPESA_BUSINESS_SHORT_CODE,
    PhoneNumber: phone_number,
    CallBackURL: env.CALLBACK_URL,
    AccountReference: 'E-health',
    TransactionDesc: 'Prescription payment',
  };

  const token = await generateToken();
  try {
    const response = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { error: false, data: response.data };
  } catch (err) {
    return { error: true, data: err.response.data };
  }
};
export { handleStkPush };

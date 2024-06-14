import { StatusCodes } from 'http-status-codes';

import { prescriptionRepository } from '@/api/prescriptions/prescriptionRepository';
import { transactionsRepository } from '@/api/transactions/transactionsRepository';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { handleStkPush } from '@/common/utils/mpesa/STKPush';

function normalizeKenyanPhoneNumber(phoneNumber: string): string {
  const cleanedNumber = phoneNumber.replace(/\D/g, '');

  if (cleanedNumber.startsWith('0')) {
    return `254${cleanedNumber.substring(1)}`;
  } else if (cleanedNumber.startsWith('254')) {
    return cleanedNumber;
  } else {
    return `254${cleanedNumber}`;
  }
}
export const transactionsService = {
  findAll: async (): Promise<ServiceResponse<any>> => {
    const transactions = await transactionsRepository.findAllAsync();
    return new ServiceResponse(ResponseStatus.Success, 'payment successfully triggered', transactions, StatusCodes.OK);
  },

  triggerPayment: async (
    prescriptionId: string,
    method: string,
    phone_number: string
  ): Promise<ServiceResponse<null>> => {
    try {
      const prescription: any = await prescriptionRepository.findUniqueAsync(prescriptionId);
      if (!prescription) {
        return new ServiceResponse(ResponseStatus.Failed, 'Prescription not found', null, StatusCodes.NOT_FOUND);
      }

      const totalAmount = prescription.prescriptionDrugs.reduce((acc: any, pd: any) => {
        return acc + pd.quantity * pd.sellingPrice;
      }, 0);

      const mpesa_response: any = await handleStkPush(normalizeKenyanPhoneNumber(phone_number), totalAmount);

      if (mpesa_response.error) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          mpesa_response.errorMessage,
          null,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      await transactionsRepository.createAsync(totalAmount, method, mpesa_response.CheckoutRequestID, prescriptionId);

      return new ServiceResponse<null>(ResponseStatus.Success, 'payment successfully triggered', null, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error triggering payment for prescription with id ${prescriptionId}:, ${(ex as Error).message}`;
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  mpesaPaymentCallback: async (mpesa_response: any): Promise<ServiceResponse<null>> => {
    try {
      const payment_checkout_id = mpesa_response.Body.stkCallback.CheckoutRequestID;
      const payment_status = mpesa_response.Body.stkCallback.ResultCode;
      const payment_description = mpesa_response.Body.stkCallback.ResultDesc;

      const payment = await transactionsRepository.findByCheckoutAsync(payment_checkout_id);
      if (!payment) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          `payment with checkout id ${payment_checkout_id} not found`,
          null,
          StatusCodes.NOT_FOUND
        );
      }

      if (payment_status == 0) {
        const reference = mpesa_response.Body.stkCallback.CallbackMetadata.Item[1].Value;
        await transactionsRepository.updateByIdAsync(payment.id, 'PAID', payment_description, reference);
      } else {
        await transactionsRepository.updateByIdAsync(payment.id, 'CANCELLED', payment_description, '-');
      }

      return new ServiceResponse<null>(ResponseStatus.Success, 'payment successfully updates', null, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error updating payment:, ${(ex as Error).message}`;
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};

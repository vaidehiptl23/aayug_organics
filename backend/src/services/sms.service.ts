import { env } from '../config/env';
import { logger } from '../utils/logger';
import { BadRequestError } from '../utils/appError';

export class SmsService {
  async sendOtp(phone: string, code: string): Promise<boolean> {
    // Clean up phone number: strip non-digits (like '+' or spaces)
    const cleanPhone = phone.replace(/\D/g, '');

    // 1. Fast2SMS Integration (Priority for India)
    if (env.FAST2SMS_API_KEY && env.FAST2SMS_API_KEY.trim() !== '') {
      try {
        const routingPhone = (cleanPhone.startsWith('91') && cleanPhone.length === 12) 
          ? cleanPhone.substring(2) 
          : cleanPhone;

        logger.info(`Sending Fast2SMS OTP to ${routingPhone}`);
        const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            'authorization': env.FAST2SMS_API_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            route: 'otp',
            variables_values: code,
            numbers: routingPhone,
          })
        });

        const data: any = await response.json();
        if (data && data.return === true) {
          logger.info(`Fast2SMS OTP sent successfully to ${routingPhone}`);
          return true;
        } else {
          logger.error('Fast2SMS response error:', data);
          const errorMsg = data?.message || 'Fast2SMS failed to send message';
          throw new BadRequestError(`SMS Gateway Error: ${errorMsg}`);
        }
      } catch (err: any) {
        logger.error('Fast2SMS API call failed:', err.message || err);
        throw new BadRequestError(err.message || 'Fast2SMS API call failed');
      }
    }

    // 2. Twilio Integration (Backup option)
    if (env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN && env.TWILIO_FROM_NUMBER) {
      try {
        logger.info(`Sending Twilio OTP to ${phone}`);
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`;
        const auth = Buffer.from(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`).toString('base64');
        
        const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;

        const params = new URLSearchParams();
        params.append('To', formattedPhone);
        params.append('From', env.TWILIO_FROM_NUMBER);
        params.append('Body', `Your Aayug Organics verification code is: ${code}. Valid for 5 minutes.`);

        const response = await fetch(twilioUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: params.toString()
        });

        if (response.status === 201) {
          logger.info(`Twilio OTP sent successfully to ${formattedPhone}`);
          return true;
        } else {
          const errData: any = await response.json().catch(() => ({}));
          logger.error('Twilio response error:', errData);
          const errorMsg = errData?.message || 'Twilio failed to send message';
          throw new BadRequestError(`SMS Gateway Error: ${errorMsg}`);
        }
      } catch (err: any) {
        logger.error('Twilio API call failed:', err.message || err);
        throw new BadRequestError(err.message || 'Twilio API call failed');
      }
    }

    // 3. Simulated/Mock SMS Fallback (Only when no API keys are present)
    logger.info(`\n┌────────────────────────────────────────────────────────┐`);
    logger.info(`│ [SMS MOCK / SIMULATION MODE]                           │`);
    logger.info(`│ To:   +${cleanPhone}                                     │`);
    logger.info(`│ Code: ${code}                                           │`);
    logger.info(`│ Expiry: 5 minutes                                      │`);
    logger.info(`└────────────────────────────────────────────────────────┘\n`);
    
    return true;
  }
}

export const smsService = new SmsService();

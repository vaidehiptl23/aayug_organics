import { env } from '../config/env';
import { logger } from '../utils/logger';

export class SmsService {
  async sendOtp(phone: string, code: string): Promise<boolean> {
    // Clean up phone number: strip non-digits (like '+' or spaces)
    const cleanPhone = phone.replace(/\D/g, '');

    // 1. Fast2SMS Integration (Priority for India)
    if (env.FAST2SMS_API_KEY) {
      try {
        // Fast2SMS requires 10-digit phone numbers for Indian routing.
        // If it starts with '91' and is 12 digits, extract the last 10 digits.
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
        }
      } catch (err: any) {
        logger.error('Fast2SMS API call failed:', err.message || err);
      }
    }

    // 2. Twilio Integration (Backup option)
    if (env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN && env.TWILIO_FROM_NUMBER) {
      try {
        logger.info(`Sending Twilio OTP to ${phone}`);
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`;
        const auth = Buffer.from(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`).toString('base64');
        
        // Twilio requires E.164 formatting (starts with '+')
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
          const errData = await response.json().catch(() => ({}));
          logger.error('Twilio response error:', errData);
        }
      } catch (err: any) {
        logger.error('Twilio API call failed:', err.message || err);
      }
    }

    // 3. Simulated/Mock SMS Fallback (Default for development)
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

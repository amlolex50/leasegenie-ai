import twilio from 'npm:twilio';
import { Contractor } from '../types';

const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER');

const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

export async function sendSMS(phoneNumber: string, message: string): Promise<boolean> {
  try {
    const result = await twilioClient.messages.create({
      body: message,
      to: phoneNumber,
      from: TWILIO_PHONE_NUMBER,
    });
    console.log('SMS sent successfully:', result.sid);
    return true;
  } catch (error) {
    console.error('Error sending SMS:', error);
    return false;
  }
}

export function createAssignmentMessage(
  contractor: Contractor,
  propertyName: string,
  category: string,
  urgency: number,
  reasoning: string
): string {
  return `New work order assigned: ${category} issue at ${propertyName}. Priority: ${urgency}/5. Reason for selection: ${reasoning}. Please check your dashboard for details.`;
}

export function createLandlordNotificationMessage(
  contractor: Contractor,
  propertyName: string,
  category: string,
  urgency: number,
  reasoning: string
): string {
  return `Maintenance request update: A ${category} issue at ${propertyName} (Priority: ${urgency}/5) has been assigned to ${contractor.full_name}. Reason for selection: ${reasoning}. You can track progress in your dashboard.`;
}
import { Resend } from 'resend';
import config from '../config/config';

const resend = new Resend(config.EMAIL_SERVICE_API_KEY);

export default {
    sendEmail: async (to: string[], subject: string, message: string ) => {
        try {
            await resend.emails.send({
                from: `LSHOP <onboarding@resend.dev>`,
                to,
                subject,
                text: message
            })
        } catch (error) {
            throw error
        }
    }
}

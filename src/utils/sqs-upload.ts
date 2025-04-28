import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import dotenv from 'dotenv';

dotenv.config();

const sqs = new SQSClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_KEY!,
        sessionToken: process.env.AWS_SESSION_TOKEN!
    },
});

const queue_url = process.env.AWS_SQS_URL!;

export const sendMessageToQueue = async (content: string, email: string, s3Link: string) => {
    // Validación básica antes de enviar
    if (!content || !email || !s3Link) {
        console.error('Invalid data: Cannot send empty content, email, or s3Link to SQS.');
        return; // Salimos de la función y NO enviamos nada
    }

    const params = {
        QueueUrl: queue_url,
        MessageBody: JSON.stringify({
            content,
            email,
            s3Link,
        }),
    };

    const command = new SendMessageCommand(params);
    try { 
        const data = await sqs.send(command);
        console.log('Message sent to SQS', data);
    } catch (error) {
        console.error('Error sending message to SQS', error);
    }
};

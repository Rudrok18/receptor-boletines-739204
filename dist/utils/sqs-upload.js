"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessageToQueue = void 0;
const client_sqs_1 = require("@aws-sdk/client-sqs");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sqs = new client_sqs_1.SQSClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN
    },
});
const queue_url = process.env.AWS_SQS_URL;
const sendMessageToQueue = (content, email, s3Link) => __awaiter(void 0, void 0, void 0, function* () {
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
    const command = new client_sqs_1.SendMessageCommand(params);
    try {
        const data = yield sqs.send(command);
        console.log('Message sent to SQS', data);
    }
    catch (error) {
        console.error('Error sending message to SQS', error);
    }
});
exports.sendMessageToQueue = sendMessageToQueue;

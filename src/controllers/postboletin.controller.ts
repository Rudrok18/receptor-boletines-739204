import { Request, Response } from 'express';

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { uploadToS3 } from '../utils/s3-upload';
import { sendMessageToQueue } from '../utils/sqs-upload';
import { HTTP_STATUS_CODES } from '../types/http-status-codes';

import dotenv from 'dotenv';

dotenv.config();

const s3 = new S3Client({ region: process.env.AWS_REGION });

export const createBoletin = async (req: Request, res: Response): Promise<void> => {
    const { content, email } = req.body;
    const boletinFile = req.file;

    if (!boletinFile || !content || !email) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: 'Missing required data' });
        return;
    }

    try {
        const s3Response = await uploadToS3(boletinFile, email);
        const s3Link = s3Response.Location;

        await sendMessageToQueue(content, email, s3Link);

        res.json({ message: 'Boletin received', s3Response });

    } catch (error) {
        console.error(error);
        res.status(HTTP_STATUS_CODES.SERVER_ERROR).json({ error: 'Error uploading file to S3' });
    }
}
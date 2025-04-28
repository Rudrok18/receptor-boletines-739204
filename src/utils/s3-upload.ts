import { S3Client, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';

import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_KEY!,
        sessionToken: process.env.AWS_SESSION_TOKEN!
    },
});

export const uploadToS3 = async (file: Express.Multer.File, email: string) => {
    const bucketName = process.env.AWS_BUCKET_NAME;
    const fileName = `${email}-${uuidv4()}-${file.originalname}`;

    const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    try {
        const command = new PutObjectCommand(params);
        const data = await s3.send(command);
        console.log('Archive sent to S3 succesfully:', data);

        const s3Link = `https:${bucketName}.s3.amazonaws.com/${params.Key}`;

        return { Location: s3Link };
    } catch (error) {
        console.error('Error uploading file to S3: ', error);
        throw error;
    }
};

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
exports.createBoletin = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_upload_1 = require("../utils/s3-upload");
const sqs_upload_1 = require("../utils/sqs-upload");
const http_status_codes_1 = require("../types/http-status-codes");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const s3 = new client_s3_1.S3Client({ region: process.env.AWS_REGION });
const createBoletin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content, email } = req.body;
    const boletinFile = req.file;
    if (!boletinFile || !content || !email) {
        res.status(http_status_codes_1.HTTP_STATUS_CODES.BAD_REQUEST).json({ error: 'Missing required data' });
        return;
    }
    try {
        const s3Response = yield (0, s3_upload_1.uploadToS3)(boletinFile, email);
        const s3Link = s3Response.Location;
        yield (0, sqs_upload_1.sendMessageToQueue)(content, email, s3Link);
        res.json({ message: 'Boletin received', s3Response });
    }
    catch (error) {
        console.error(error);
        res.status(http_status_codes_1.HTTP_STATUS_CODES.SERVER_ERROR).json({ error: 'Error uploading file to S3' });
    }
});
exports.createBoletin = createBoletin;

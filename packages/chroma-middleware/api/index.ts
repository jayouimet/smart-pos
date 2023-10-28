import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as dotenv from 'dotenv';
dotenv.config();

export default function (request: VercelRequest, response: VercelResponse) {
    return response.send(`Hello world!`);
}
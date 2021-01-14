/**
 * Constants
 */

const port: number = 8000;
const protocol: string = 'http';
const uri: string = '192.168.1.12';


const ENV: string = "PROD";

const PROD_PROTOCOL: string = 'https';
const PROD_URI: string = 'www.ongqir-backend.com';
export const SERVER_URL: string = ENV === "PROD" ? `${PROD_PROTOCOL}://${PROD_URI}` : `${protocol}://${uri}:${port}`;
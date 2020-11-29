/**
 * Constants
 */

const port: number = 8000;
const protocol: string = 'http';
const uri: string = '192.168.43.178';


const ENV: string = "PROD";

const PROD_PROTOCOL: string = 'http';
const PROD_URI: string = '178.128.96.229';
export const SERVER_URL: string = ENV === "PROD" ? `${PROD_PROTOCOL}://${PROD_URI}` : `${protocol}://${uri}:${port}`;

export const GOOGLE_MAPS_APIKEY: string = 'AIzaSyCbgXJ_ueIa0jryLcfkmX1LaJ7Eo29hqEM';
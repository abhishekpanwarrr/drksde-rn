const DEV_API_URL = "http://192.168.29.61:5000/api"; // local machine IP
const PROD_API_URL = "https://api.yourdomain.com/api";

export const API_BASE_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;

const DEV_API_URL="http://192.168.29.59:5001/api"
const PROD_API_URL="https://api.yourdomain.com/api"
export const API_BASE_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;


export const apiUrl = import.meta.env.VITE_API_URL;

const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');

export const userToken = userInfo?.token || null;
export const userId = userInfo?.id || null;
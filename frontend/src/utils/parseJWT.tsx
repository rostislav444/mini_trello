import jwt_decode from "jwt-decode";

export function parseJwt (token: string | null) {
    if (!token) return null;

    const decodedToken: any = jwt_decode(token);
    const exp = new Date(decodedToken.exp * 1000);
    const now = new Date();

    if (now > exp) {
        console.log('Token expired')
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return null;
    }

    return true
}
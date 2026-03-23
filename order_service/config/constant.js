// BUG FIX: Renamed VARIFICATION_ERROR -> VERIFICATION_ERROR (typo)
// BUG FIX: Added dedicated JWT_SECRET so auth signing and verification use the same secret
const JWT_SECRET = "secret_key";
const CLIENT_ID = "globalbooks_client";
const CLIENT_SECRET = "secret123";

const TOKEN_ERROR = "Unauthorized User";
const VERIFICATION_ERROR = "Forbidden";
const AUTH_ERROR = "invalid_client";

const PORT = 3000;

module.exports = {
    JWT_SECRET,
    CLIENT_ID,
    CLIENT_SECRET,
    TOKEN_ERROR,
    VERIFICATION_ERROR,
    AUTH_ERROR,
    PORT,
};

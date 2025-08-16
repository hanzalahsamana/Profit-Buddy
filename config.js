const BASE_URL =
  process.env.NODE_ENV !== "production"
    ? "https://profit-buddy-backend.vercel.app/api/v1"
    // :"https://profit-buddy-backend.vercel.app/api/v1"
    : "http://localhost:2000/api/v1";

export default BASE_URL;

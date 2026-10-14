import { verifyAccessToken } from "../utils/jwt.utils.mjs";

const authorize = (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({
      error: "Missing token",
    });
  }

  let decode;
  try {
    decode = verifyAccessToken(token);
  } catch (err) {
    throw new Error(err, "Invalid or expired access token");
  }

  req.user = {
    id: decode.id,
  };

  next();
};

export default authorize;

import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .send({ success: false, message: "unauthorized user - no token found" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res
        .status(401)
        .send({ success: false, message: "unauthorized user - invalid token" });
    }
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log("error in verifyToken", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

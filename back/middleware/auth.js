import express from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";

const app = express();
const JWT_SECRET = "ok_man";

// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Authentication middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("Invalid or missing authorization header");
    return res
      .status(401)
      .json({ error: "Invalid or missing authorization header" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.userId) {
      req.userId = decoded.userId;
      next();
    } else {
      console.error("Forbidden: No userId in decoded token");
      return res.status(403).json({ error: "Forbidden" });
    }
  } catch (err) {
    console.error("Invalid token", err);
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Example route that uses the authMiddleware
app.post("/protected-route", authMiddleware, (req, res) => {
  res.json({ message: "Access granted", userId: req.userId });
});

// Start the server
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
export default authMiddleware;

// import express from "express";
// import bodyParser from "body-parser";
// import jwt from "jsonwebtoken";

// const app = express();
// const JWT_SECRET = "ok_man";

// // Use body-parser middleware
// app.use(bodyParser.urlencoded({ extended: false })); // For parsing application/x-www-form-urlencoded
// app.use(bodyParser.json()); // For parsing application/json

// // Authentication middleware
// const authMiddleware = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res
//       .status(401)
//       .json({ error: "Invalid or missing authorization header" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     if (decoded.userId) {
//       req.userId = decoded.userId;
//       next();
//     } else {
//       return res.status(403).json({ error: "Forbidden" });
//     }
//   } catch (err) {
//     return res.status(401).json({ error: "Invalid token" });
//   }
// };

// // Example route that uses the authMiddleware
// app.post("/protected-route", authMiddleware, (req, res) => {
//   // If the authMiddleware passes, you can access req.userId here
//   res.json({ message: "Access granted", userId: req.userId });
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
// export default authMiddleware;

// // // const JWT_SECRET = "ok_man";
// // // import jwt from "jsonwebtoken";

// // // const authMiddleware = (req, res, next) => {
// // //   const authHeader = req.headers.authorization;

// // //   if (!authHeader || !authHeader.startsWith("Bearer ")) {
// // //     return res
// // //       .status(401)
// // //       .json({ error: "Invalid or missing authorization header" });
// // //   }
// // //   const token = authHeader.split(" ")[1];

// // //   try {
// // //     const decoded = jwt.verify(token, JWT_SECRET);
// // //     if (decoded.userId) {
// // //       req.userId = decoded.userId;
// // //       next();
// // //     } else {
// // //       return res.status(403).json({ error: "Forbidden" });
// // //     }
// // //   } catch (err) {
// // //     return res.status(401).json({ error: "Invalid token" });
// // //   }
// // // };

// // // export default authMiddleware;

// // import express from "express";
// // import bodyParser from "body-parser";
// // import jwt from "jsonwebtoken";

// // const app = express();
// // const JWT_SECRET = "ok_man";

// // // Use body-parser middleware
// // app.use(bodyParser.urlencoded({ extended: false })); // For parsing application/x-www-form-urlencoded
// // app.use(bodyParser.json()); // For parsing application/json

// // // Authentication middleware
// // const authMiddleware = (req, res, next) => {
// //   const authHeader = req.headers.authorization;

// //   if (!authHeader || !authHeader.startsWith("Bearer ")) {
// //     return res
// //       .status(401)
// //       .json({ error: "Invalid or missing authorization header" });
// //   }

// //   const token = authHeader.split(" ")[1];

// //   try {
// //     const decoded = jwt.verify(token, JWT_SECRET);
// //     if (decoded.userId) {
// //       req.userId = decoded.userId;
// //       next();
// //     } else {
// //       return res.status(403).json({ error: "Forbidden" });
// //     }
// //   } catch (err) {
// //     return res.status(401).json({ error: "Invalid token" });
// //   }
// // };

// // // Example route that uses the authMiddleware
// // app.post("/protected-route", authMiddleware, (req, res) => {
// //   // If the authMiddleware passes, you can access req.userId here
// //   res.json({ message: "Access granted", userId: req.userId });
// // });

// // // Start the server
// // const PORT = process.env.PORT || 3000;
// // app.listen(PORT, () => {
// //   console.log(`Server is running on port ${PORT}`);
// // });
// // export default authMiddleware;
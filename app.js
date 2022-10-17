const express = require("express");
const cookieParser = require("cookie-parser");
const connectDatabase = require("./config/config");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const songRoutes = require("./routes/songRoutes");
const { requireAuth, isAdmin } = require("./middleware/authMiddleware");
require("dotenv").config();
const app = express();

//middleware
app.use(express.json());
app.use(cookieParser());

//DataBase connection
connectDatabase();
app.use(authRoutes);
app.use(songRoutes);
app.use("/admin", isAdmin, adminRoutes);
app.listen(3000, () => {
  console.log(`Server Running on http://localhost:3000`);
});

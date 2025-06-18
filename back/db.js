import mongoose from "mongoose";
import bcrypt from "bcrypt";
mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 20000, // Increase timeout to 20 seconds
  })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
  },
  { collection: "User" }
);
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create the User model
const User = mongoose.model("User", userSchema);

export default User;
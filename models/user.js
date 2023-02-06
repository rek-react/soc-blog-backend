import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    fullName: {
      type: String,
      unique: true,
      required: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    isActive: {
      type: Boolean,
      default: false,
    },
    activationLink: {
      type: String,
    },
    avatarUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);
export default model("User", UserSchema);

import { model, Schema } from "mongoose";
const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: String,
    tags: {
      type: Array,
      default: [],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    imageUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default model("Post", PostSchema);

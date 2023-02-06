import { model, Schema } from "mongoose";
const CommentSchema = new Schema(
  {
   comment: {
    type:String,
    required:true
   },
   user:{
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
   }
  },
  {
    timestamps: true,
  }
);

export default model("Comment", CommentSchema);

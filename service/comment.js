import CommentDto from "../dtos/comment.js";
import CommentModel from "../models/comment.js";
import PostModel from "../models/post.js";

class CommentService {
  async create(postId, userId, { cmt }) {
    const comment = await CommentModel.create({ comment: cmt, user: userId });
    await PostModel.findByIdAndUpdate(postId, {
      $push: { comments: comment._id },
      $inc: { commentsCount: 1 },
    });
    const commentDto = new CommentDto(comment);
    return commentDto;
  }
  async get(postId, limit) {
    let { comments } = await PostModel.findById(postId).populate({
      path: "comments",
      select: "-updatedAt -__v",
      limit,
      options: {
        sort: { createdAt: -1 },
        populate: {
          path: "user",
          select: "fullName avatarUrl",
        },
      },
    });
    return comments;
  }
}
export default new CommentService();

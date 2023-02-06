import commentService from "../service/comment.js";

class CommentController {
  async create(req, res, next) {
    try {
      const { postId } = req.params;
      const { comment: cmt } = req.body;
      const comment = await commentService.create(postId, req.userId, { cmt });
      return res.status(201).json(comment);
    } catch (e) {
      next(e);
    }
  }
  async get(req, res, next) {
    try {
      const { postId } = req.params;
      const { limit } = req.query;
      const comments = await commentService.get(postId, limit);
      return res.json(comments);
    } catch (e) {
      next(e);
    }
  }
}
export default new CommentController();

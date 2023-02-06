import postService from "../service/post.js";

class PostController {
  async create(req, res, next) {
    try {
      const { title, text, tags } = req.body;
      const post = await postService.create(
        req.file,
        req.userId,
        {title,
        text,
        tags,}
        
      );

      return res.status(201).json(post);
    } catch (e) {
      next(e);
    }
  }
  async getTags(req, res, next){
     try {
      const tags = await postService.getTags();
      return res.json(tags);
    } catch (e) {
      next(e);
    }
  }
  async getAll (req, res, next) {
    try {
      const posts = await postService.getAll();
      return res.json(posts);
    } catch (e) {
      next(e);
    }
  }
  async getMy (req, res, next) {
    try {
      const posts = await postService.getMy(req.userId);
      return res.json(posts);
    } catch (e) {
      next(e);
    }
  }
  async getOne(req, res, next) {
    try {
      const { postId } = req.params;
      const {isEdit} = req.query
      const post = await postService.getOne(postId,isEdit);
      return res.json(post);
    } catch (e) {
      next(e);
    }
  }
  async remove(req, res, next) {
    try {
      const { postId } = req.params;
      const post = await postService.remove(postId, req.userId);
      return res.json(post);
    } catch (e) {
      next(e);
    }
  }
  async update(req, res, next) {
    try {
      const { postId } = req.params;
      const { title, text, tags, image: imageUrl } = req.body;
      const image = req.file || imageUrl
      const post = await postService.update(postId, req.userId, { title, text, tags, image });
      return res.json(post);
    } catch (e) {
      next(e);
    }
  }
}
export default new PostController();

import { isValidObjectId } from "mongoose";
import { ApiError } from "../exeptions/error.js";
import PostModel from "../models/post.js";
import UserModel from "../models/user.js";
import CommentModel from "../models/comment.js";
import { deleteFile } from "../utils/deleteFIle.js";
import PostDto from "../dtos/post.js";

class PostService {
  async create(image, userId, { title, text, tags }) {
    const post = await PostModel.create({
      title,
      text,
      tags: tags ? tags.replace(/\s/g, "").split(",") : [],
      imageUrl: image ? image.filename : "",
      user: userId,
    });
    await UserModel.findByIdAndUpdate(userId, {
      $push: { posts: post._id },
    });
    const postDto = new PostDto(post);
    return postDto;
  }
  async getAll() {
    let posts = await PostModel.find({})
      .sort({ viewsCount: -1 })
      .populate("user");
    posts = posts.map((post) => {
      return new PostDto(post);
    });
    return posts;
  }
  async getMy(userId) {
    let { posts, fullName, _id, avatarUrl } = await UserModel.findById(
      userId
    ).populate("posts");
    posts = posts.map((post) => {
      return {
        ...post._doc,
        user: {
          fullName,
          _id,
          avatarUrl,
        },
      };
    });
    return posts;
  }
  async getTags() {
    const posts = await PostModel.find({
      tags: { $exists: true, $not: { $size: 0 } },
    })
      .sort({ viewsCount: -1 })
      .limit(5);
    const tags = posts.map((post) => ({ id: post._id, tags: post.tags }));

    const tagsUnique = tags
      .filter((tag, index) => tags.indexOf(tag) === index)
      .slice(0, 5);
    return tagsUnique;
  }
  async getOne(postId, isEdit) {
    if (!isValidObjectId(postId)) {
      throw ApiError.notFound("Статья не найдена");
    }
    let post;
    if (isEdit) {
      post = await PostModel.findById(postId).populate("user");
    } else {
      post = await PostModel.findByIdAndUpdate(
        postId,
        { $inc: { viewsCount: 1 } },
        { returnDocument: "after" }
      ).populate("user");
    }
    if (!post) {
      throw ApiError.notFound("Статья не найдена");
    }
    const postDto = new PostDto(post);
    return postDto;
  }
  async remove(postId, userId) {
    if (!isValidObjectId(postId)) {
      throw ApiError.notFound("Статья не найдена");
    }
    const post = await PostModel.findById(postId);

    if (!post) {
      throw ApiError.notFound("Статья не найдена");
    }
    if (!post.user.equals(userId)) {
      throw ApiError.forbidden("Не ваша статья");
    }
    if (post.imageUrl) {
      await deleteFile(post.imageUrl);
    }

    const deletedPost = await post.deleteOne();
    await Promise.all(
      post.comments.map(({ _id }) => {
        return CommentModel.deleteMany({ _id });
      })
    );
    await UserModel.findByIdAndUpdate(userId, {
      $pull: { posts: postId },
    });
    return deletedPost;
  }
  async update(postId, userId, { title, text, tags, image }) {
    if (!isValidObjectId(postId)) {
      throw ApiError.notFound("Статья не найдена");
    }
    const post = await PostModel.findById(postId);
    if (!post) {
      throw ApiError.notFound("Статья не найдена");
    }
    if (!post.user.equals(userId)) {
      throw ApiError.forbidden("Не ваша статья");
    }
    if (
      (post.imageUrl && image && image.filename) ||
      (post.imageUrl && !image)
    ) {
      await deleteFile(post.imageUrl);
    }
    if (title) post.title = title;
    if (tags) post.tags = tags ? tags.replace(/\s/g, "").split(",") : [];
    if (text) post.text = text;
    post.imageUrl = (image && image.filename) || image;
    const updatedPost = await post.save();
    await UserModel.findByIdAndUpdate(userId, {
      $set: { posts: post._id },
    });
    const postDto = new PostDto(updatedPost);
    return postDto;
  }
}
export default new PostService();

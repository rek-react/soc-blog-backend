export default class PostDto {
  _id;
  title;
  commentsCount;
  text;
  user;
  tags;
  viewsCount;
  imageUrl;
  createdAt;
  constructor(model) {
    this.title = model.title;
    this._id = model._id;
    this.text = model.text;
    this.user = {
      _id: model.user._id,
      avatarUrl: model.user.avatarUrl,
      fullName: model.user.fullName,
    };
    this.commentsCount = model.commentsCount;
    this.viewsCount = model.viewsCount;
    this.tags = model.tags;
    this.imageUrl = model.imageUrl;
    this.createdAt = model.createdAt;
  }
}

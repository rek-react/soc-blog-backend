export default class CommentDto {
  _id;
  comment;
  user;
  createdAt;
  constructor(model) {
    this._id = model._id;
    this.comment = model.comment;
    this.user = {
      _id: model.user._id,
      fullName: model.user.fullName,
      avatarUrl: model.user.avatarUrl,
    };
    this.createdAt = model.createdAt;
  }
}

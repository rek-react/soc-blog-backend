export default class UserDto {
  email;
  _id;
  isActive;
  fullName;
  avatarUrl;
  constructor(model) {
    this.email = model.email;
    this._id = model._id;
    this.isActive = model.isActive;
    this.fullName = model.fullName;
    this.avatarUrl = model.avatarUrl;
  }
}

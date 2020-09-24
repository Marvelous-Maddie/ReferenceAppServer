const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    content: { type: String, min: 8, max: 1000, required: true },
    userName: { type: String, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    subtitle: { type: String },
    content: { type: String },
    ownerName: { type: String },
    ownerId: {
      type: Schema.Types.ObjectId,
    },
    comments: { type: [CommentSchema] },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Page", schema);

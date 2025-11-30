import { Schema, model, Types } from "mongoose";

const nodeSchema = new Schema({
  article: { type: Types.ObjectId, ref: "Article", required: true },
  type: {
    type: String,
    enum: ["publication", "dataset", "evidence", "code"],
    default: "publication",
  },
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 }
  }
});

const edgeSchema = new Schema({
  from: { type: Types.ObjectId, ref: "Article" },
  to: { type: Types.ObjectId, ref: "Article" },
  relation: { type: String, default: "keyword-similarity" }
});

const webSchema = new Schema(
  {
    owner: { type: Types.ObjectId, ref: "User", required: true },
    title: String,
    description: String,
    rootArticle: { type: Types.ObjectId, ref: "Article", required: true },

    nodes: [nodeSchema],
    edges: [edgeSchema],
  },
  { timestamps: true }
);

export default model("Web", webSchema);

import { Schema, model } from "mongoose";

const ArticleSchema = new Schema(
    {
      pmid: { type: String, required: true, unique: true },
      title: { type: String, default: "" },
      abstract: { type: String, default: "" },
      authors: [String],
      keywords: [String],
      meshTerms: [String],
      source: { type: String, default: "pubmed" },
      journal: String,
      year: Number,
  
      // NEW
      embedding: { type: [Number], default: [] },
    },
    { timestamps: true }
  );
  

export default model("Article", ArticleSchema);

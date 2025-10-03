// models/Post.js
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug:  { type: String, unique: true, index: true },
    // Rich text (HTML) — sanitize before saving!
    contentHtml: { type: String, required: true },
    // Optional plain-text summary / SEO
    excerpt: { type: String, default: '' },

    // Media & metadata
    coverUrl: { type: String },
    tags: { type: [String], index: true, default: [] },
    status: { type: String, enum: ['DRAFT','PUBLISHED'], default: 'DRAFT' },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    // Editor info
    editor: { type: String, enum: ['plain','html','markdown','tiptap','quill'], default: 'html' },

    // Auditing
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    publishedAt: { type: Date }
  },
  { minimize: false }
);

// Keep updatedAt fresh
PostSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  if (this.isModified('status') && this.status === 'PUBLISHED' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Example slug generator (customize as needed)
PostSchema.pre('validate', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

module.exports = mongoose.model('Post', PostSchema);
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  // The text of the comment
  comment: { 
    type: String, 
    required: true 
  }, 
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: "Signup", 
    required: true 
  }, 
  email: { 
    type: String     
  }
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;

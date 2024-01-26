const mongoose = require('mongoose');
const { Schema } = mongoose;

const subTaskSchema = new Schema({
  task_id: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
  status: { type: Number, enum: [0, 1], default: 0 }, // 0- Incomplete, 1- Complete
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date },
});

const SubTask = mongoose.model('SubTask', subTaskSchema);

module.exports = SubTask;

import mongoose, { Document, Schema } from 'mongoose';

export interface IGoal extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description: string;
  deadline: Date;
  status: 'active' | 'completed' | 'paused';
  progress: number;
  aiAnalysis?: {
    intent: string;
    complexity: 'low' | 'medium' | 'high';
    estimatedDays: number;
    category: string;
    keyMilestones: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const goalSchema = new Schema<IGoal>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Goal title is required'],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      default: '',
      maxlength: 2000,
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'paused'],
      default: 'active',
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    aiAnalysis: {
      intent: String,
      complexity: {
        type: String,
        enum: ['low', 'medium', 'high'],
      },
      estimatedDays: Number,
      category: String,
      keyMilestones: [String],
    },
  },
  {
    timestamps: true,
  }
);

export const Goal = mongoose.model<IGoal>('Goal', goalSchema);

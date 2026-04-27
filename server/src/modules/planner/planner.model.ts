import mongoose, { Document, Schema } from 'mongoose';

export interface IPlanTask {
  task: mongoose.Types.ObjectId;
  startTime: string;
  endTime: string;
  completed: boolean;
}

export interface IDailyPlan extends Document {
  user: mongoose.Types.ObjectId;
  date: Date;
  tasks: IPlanTask[];
  totalPlannedMinutes: number;
  totalCompletedMinutes: number;
  aiNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const dailyPlanSchema = new Schema<IDailyPlan>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
    },
    tasks: [
      {
        task: {
          type: Schema.Types.ObjectId,
          ref: 'Task',
          required: true,
        },
        startTime: {
          type: String,
          required: true,
        },
        endTime: {
          type: String,
          required: true,
        },
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
    totalPlannedMinutes: {
      type: Number,
      default: 0,
    },
    totalCompletedMinutes: {
      type: Number,
      default: 0,
    },
    aiNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one plan per user per date
dailyPlanSchema.index({ user: 1, date: 1 }, { unique: true });

export const DailyPlan = mongoose.model<IDailyPlan>('DailyPlan', dailyPlanSchema);

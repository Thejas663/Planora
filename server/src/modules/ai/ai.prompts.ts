export const AI_PROMPTS = {
  analyzeGoal: (goalText: string, deadline: string) => `
You are a productivity expert and project planning specialist. Analyze the following goal and extract structured information.

Goal: "${goalText}"
Deadline: ${deadline}

Return a JSON object with these exact fields:
{
  "intent": "A clear, one-sentence summary of what the user wants to achieve",
  "complexity": "low" | "medium" | "high",
  "estimatedDays": <number - realistic working days needed>,
  "category": "<domain/category like 'software development', 'fitness', 'learning', 'business', etc.>",
  "keyMilestones": ["milestone1", "milestone2", "milestone3"]
}

Rules:
- Be realistic about time estimates
- Consider the deadline when assessing complexity
- Provide 2-4 key milestones that represent major checkpoints
- The intent should be actionable and specific
`,

  generateTasks: (
    goalTitle: string,
    goalDescription: string,
    deadline: string,
    complexity: string,
    hoursPerDay: number
  ) => `
You are a project planning expert. Break down the following goal into actionable, structured tasks.

Goal Title: "${goalTitle}"
Description: "${goalDescription}"
Deadline: ${deadline}
Complexity: ${complexity}
Available working hours per day: ${hoursPerDay}

Generate a JSON object with a "tasks" array. Each task must have:
{
  "tasks": [
    {
      "title": "Clear, actionable task name",
      "description": "Brief description of what to do",
      "priority": "low" | "medium" | "high",
      "estimatedMinutes": <number between 15-480>,
      "order": <sequence number starting from 1>
    }
  ]
}

Rules:
- Generate 5-15 tasks depending on complexity
- Order tasks logically (prerequisites and setup tasks first)
- Include research/planning tasks where appropriate
- Be specific and actionable, not vague (e.g., "Set up React project with TypeScript" not "Set up project")
- High priority for blocking tasks, low for nice-to-haves
- Time estimates should be realistic (most tasks 30-120 minutes)
- Total estimated time should fit within the deadline considering ${hoursPerDay} hours/day
`,

  generateDailyPlan: (
    tasksJson: string,
    targetDate: string,
    startTime: string,
    endTime: string,
    totalHours: number
  ) => `
You are a productivity scheduler. Create an optimal daily schedule for the given tasks.

Available tasks (JSON):
${tasksJson}

Date: ${targetDate}
Working hours: ${startTime} to ${endTime} (${totalHours} hours total)

Create a JSON schedule:
{
  "schedule": [
    {
      "taskId": "<the task's _id from the input>",
      "startTime": "HH:MM",
      "endTime": "HH:MM"
    }
  ],
  "notes": "Brief scheduling notes and recommendations",
  "totalMinutes": <total planned minutes>
}

Rules:
- Prioritize high-priority tasks earlier in the day
- Group related tasks together
- Include 10-15 minute breaks between intensive tasks (don't include breaks as tasks)
- Do NOT exceed ${totalHours} hours of work
- Respect task estimated times
- Order by start time
- Use 24-hour format for times
`,

  replan: (
    missedTasksJson: string,
    remainingTasksJson: string,
    deadline: string,
    daysLeft: number,
    hoursPerDay: number
  ) => `
You are a productivity coach. The user has missed some tasks and needs a revised plan.

Missed/incomplete tasks:
${missedTasksJson}

Remaining upcoming tasks:
${remainingTasksJson}

Original deadline: ${deadline}
Days remaining: ${daysLeft}
Working hours per day: ${hoursPerDay}

Return a JSON object:
{
  "revisedSchedule": [
    {
      "taskId": "<task _id>",
      "suggestedDate": "YYYY-MM-DD",
      "newPriority": "low" | "medium" | "high",
      "notes": "optional adjustment notes"
    }
  ],
  "deadlineAtRisk": true | false,
  "recommendations": "Overall recommendations for getting back on track",
  "adjustedWorkload": "Description of how workload was redistributed"
}

Rules:
- Redistribute missed tasks across remaining days evenly
- Don't exceed ${hoursPerDay} hours on any single day
- If deadline is at risk, flag it and explain why
- Prioritize critical-path tasks
- Provide actionable recommendations
`,

  insights: (
    completedCount: number,
    missedCount: number,
    avgCompletionRatio: number,
    totalGoals: number,
    goalsCompleted: number,
    weeklyData: string
  ) => `
You are a productivity analyst. Analyze the user's task completion data and provide actionable insights.

Performance Data:
- Tasks completed this period: ${completedCount}
- Tasks missed/overdue: ${missedCount}
- Average completion time vs estimated: ${avgCompletionRatio}x (1.0 = on time, >1.0 = taking longer)
- Total goals: ${totalGoals}
- Goals completed: ${goalsCompleted}
- Weekly activity data: ${weeklyData}

Return a JSON object:
{
  "insights": [
    {
      "type": "strength" | "improvement" | "warning" | "tip",
      "title": "Short insight title",
      "description": "Detailed, specific, actionable insight",
      "icon": "trophy" | "trending-up" | "alert-triangle" | "lightbulb" | "zap" | "target"
    }
  ],
  "overallScore": <0-100 productivity score>,
  "summary": "A brief 2-sentence overall assessment"
}

Rules:
- Provide 3-5 specific, actionable insights
- Be encouraging but honest
- Reference specific numbers from the data
- Include at least one strength and one improvement area
- Make recommendations practical and implementable
`,
};

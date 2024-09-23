export interface InputUpdateRankMilestoneInterface {
  draggedId: number;
  higherPivotRank?: number;
  lowerPivotRank?: number;
  pipelineId: number;
}

export interface InputUpdateRankDealsInterface {
  draggedId: number;
  higherPivotRank?: number;
  lowerPivotRank?: number;
  pipelineId: number;
  milestoneId: number;
}

export interface RankInterface {
  rank: number;
}

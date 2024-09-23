import { GraphQLError } from 'graphql';
import { highestRank, lowestRank } from "@src/config";
import { RankInterface } from "@src/interfaces";

const filterMaxRanks = (rankList: number[]): number => {
  return Math.max(...rankList.filter((rank) => rank !== 0 && rank !== lowestRank.won && rank !== lowestRank.lost && rank !== null));
};

const filterMinRanks = (rankList: number[]): number => {
  return Math.min(...rankList.filter((rank) => rank !== highestRank && rank !== lowestRank.lost && rank !== lowestRank.won && rank !== null));
};

export const assignNewRank = (ranks: RankInterface[]): number => {
  const rankList = ranks.map((item) => item.rank);
  const existingLowestRank = filterMaxRanks(rankList);
  const newRank = Math.max(1, Math.ceil(existingLowestRank) + 1);
  return newRank;
}

export const updateExistingRank = (ranks: RankInterface[], higherPivotItemRank?: number | null, lowerPivotItemRank?: number | null): number => {
  const rankList = ranks.map((item) => item.rank);

  if (higherPivotItemRank === null) {
    const existingLowestRank = filterMaxRanks(rankList);
    const newRank = Math.ceil(existingLowestRank) + 1;
    return newRank;
  }

  const highestMilestoneRank = filterMinRanks(rankList);

  if (higherPivotItemRank == highestMilestoneRank) {
    const newRank = (highestMilestoneRank + 0) / 2;
    return newRank;
  }

  if (higherPivotItemRank && lowerPivotItemRank) {
    const newRank = (higherPivotItemRank + lowerPivotItemRank) / 2;
    return newRank;
  }

  throw new GraphQLError(`Invalid drag and drop conditions`, {
    extensions: {
      code: "BAD_USER_INPUT",
      status: 400,
      message: `The drag and drop conditions requirements do not match`,
    },
  });
}

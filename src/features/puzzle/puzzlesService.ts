// src/features/puzzle/puzzlesService.ts
import { PuzzleSettings, PuzzleSettingsDto } from 'endchess-api-settings';
import { IPuzzle, IUser } from 'endchess-models';
import repo from './puzzleRepo';
import { stat } from 'fs';

class PuzzleService {
  private static LEVEL_ADJUSTMENT = 300;

  public async findPuzzle(
    user: IUser,
    settings: PuzzleSettingsDto,
  ): Promise<IPuzzle | null> {
    const playerData = await repo.findPlayerPuzzlesData(user);
    const [difficulty] = settings.difficulties || [];
    const ratingRange = this.calculateRatingRange(
      playerData!.rating,
      difficulty,
    );
    const solvedPuzzleIds = playerData?.itemEvents
      .filter((itemEvent) => itemEvent.event === 'solved')
      .map((itemEvent) => itemEvent.itemId);
    const statuses = settings.solvedStatuses || [];
    const puzzle = this.findPuzzleByStatus(
      statuses,
      ratingRange,
      solvedPuzzleIds || [],
    );
    return puzzle;
  }

  private async findPuzzleByStatus(
    statuses: string[],
    ratingRange: { min: number; max: number },
    solvedPuzzleIds: string[],
  ): Promise<IPuzzle | null> {
    if (
      statuses.includes(PuzzleSettings.SolvedStatus.SOLVED) &&
      statuses.includes(PuzzleSettings.SolvedStatus.UNSOLVED)
    ) {
      return await repo.findAnyPuzzle(ratingRange);
    } else if (statuses.includes(PuzzleSettings.SolvedStatus.SOLVED)) {
      return await repo.findSolvedPuzzle(solvedPuzzleIds, ratingRange);
    } else if (statuses.includes(PuzzleSettings.SolvedStatus.UNSOLVED)) {
      return await repo.findUnsolvedPuzzle(solvedPuzzleIds, ratingRange);
    } else {
      throw new Error('Invalid solved status');
    }
  }

  private calculateRatingRange(
    rating: number,
    difficulty: string,
  ): { min: number; max: number } {
    let target: number;
    switch (difficulty) {
      case PuzzleSettings.Difficulty.EASY:
        target = rating - PuzzleService.LEVEL_ADJUSTMENT;
        break;
      case PuzzleSettings.Difficulty.MEDIUM:
        target = rating;
        break;
      case PuzzleSettings.Difficulty.HARD:
        target = rating + PuzzleService.LEVEL_ADJUSTMENT;
        break;
      default:
        throw new Error('Invalid difficulty');
    }

    return {
      min: target - PuzzleService.LEVEL_ADJUSTMENT / 2,
      max: target + PuzzleService.LEVEL_ADJUSTMENT / 2,
    };
  }
}

export default new PuzzleService();

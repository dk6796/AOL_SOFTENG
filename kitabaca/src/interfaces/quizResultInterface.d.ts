export interface IQuizResult{
     ResultID?: number;
     BookHistoryID?: number;
     BookHistory?: BookHistory;
     TotalCorrect?: number;
     CorrectStreak?: number;
     CoinEarned?: number;
}
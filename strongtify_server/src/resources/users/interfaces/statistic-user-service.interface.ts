export interface StatisticUserService {
    countNewUsersToday(): Promise<number>;
}

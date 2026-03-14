import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface NewsArticle {
    title: string;
    date: Time;
    summary: string;
    category: NewsCategory;
}
export type Time = bigint;
export interface HighScore {
    score: bigint;
    playerName: string;
    gameName: string;
}
export enum NewsCategory {
    other = "other",
    characterReveal = "characterReveal",
    update = "update",
    newGame = "newGame"
}
export interface backendInterface {
    addHighScore(gameName: string, playerName: string, score: bigint): Promise<void>;
    addNewsArticle(title: string, summary: string, category: NewsCategory): Promise<void>;
    getAllNews(): Promise<Array<NewsArticle>>;
    getHighScores(gameName: string): Promise<Array<HighScore>>;
    getNewsByCategory(category: NewsCategory): Promise<Array<NewsArticle>>;
    removeHighScore(gameName: string, playerName: string): Promise<void>;
    removeNewsArticle(title: string): Promise<void>;
}

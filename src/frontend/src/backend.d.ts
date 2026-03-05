import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface StartupNode {
    id: string;
    latitude: number;
    directive: string;
    ownerId: Principal;
    city: string;
    createdAt: Time;
    description: string;
    sector: string;
    longitude: number;
    companyName: string;
}
export interface UserProfile {
    bio: string;
    city: string;
    userId: Principal;
    name: string;
    sector: string;
    email: string;
    updatedAt: Time;
    startupName: string;
    phone: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createNode(companyName: string, description: string, sector: string, city: string, latitude: number, longitude: number, directive: string): Promise<string>;
    deleteNode(id: string): Promise<string>;
    getAllNodes(): Promise<Array<StartupNode>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyNode(): Promise<StartupNode | null>;
    getMyProfile(): Promise<UserProfile | null>;
    getProfileByUserId(userId: Principal): Promise<UserProfile | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    seedData(): Promise<string>;
    updateNode(id: string, companyName: string, description: string, sector: string, city: string, latitude: number, longitude: number, directive: string): Promise<string>;
    upsertProfile(name: string, email: string, phone: string, city: string, sector: string, startupName: string, bio: string): Promise<string>;
}

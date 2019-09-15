import { EasingFunction } from './easings';
export declare type KeyFrame<T extends {}> = Partial<T>;
export interface KeyFrameList<T extends {}> {
    [at: string]: KeyFrame<T>;
}
export declare class Animation<T extends {}> {
    readonly target: T;
    readonly properties: Partial<T>;
    readonly propertyKeys: Array<keyof T>;
    readonly originalProperties: Partial<T>;
    readonly duration: number;
    readonly easing: EasingFunction;
    constructor(target: T, properties: Partial<T>, duration: number, easing?: EasingFunction);
    invert(): Animation<T>;
    seek(elapsedTime: number): void;
}
export declare enum AnimationStatus {
    RUNNING = 0,
    STOPPED = 1,
    PAUSED = 2,
    FINISHED = 3
}
declare const animationStatusSymbol: unique symbol;
export declare class AnimationControl {
    [animationStatusSymbol]: AnimationStatus;
    stop(): void;
    pause(): void;
    resume(): void;
}
export interface AnimationState<T extends {}> {
    animation: Animation<T>;
    control: AnimationControl;
    startTime?: number;
    onProgress?: (progress: number, elapsedTime: number) => void;
    onFinish?: () => void;
}
export declare class Animator {
    readonly animations: Array<AnimationState<any>>;
    update(elapsedTime: number): void;
    run<T extends {}>(animation: Animation<T>, control?: AnimationControl, onProgress?: (progress: number, elapsedTime: number) => void): Promise<unknown>;
    chain<T>(animations: Array<Animation<T>>, control?: AnimationControl, onProgress?: (totalProgress: number, totalElapsedTime: number, progress: number, elapedTime: number, animation: Animation<T>) => void): Promise<void>;
    loop<T extends {}>(animations: Animation<T> | Array<Animation<T>>, control?: AnimationControl, onProgress?: (progress: number, elapsedTime: number) => void): Promise<void>;
}
export {};

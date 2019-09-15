import { EasingFunction, linear } from './easings';

export type KeyFrame<T extends {}> = Partial<T>;
export interface KeyFrameList<T extends {}> {
    [at: string]: KeyFrame<T>;
}

const { min, max, floor } = Math;

function readHexRgbColor(value: string) {
    if (value.length === 3) {
        return {
            r: parseInt(value[0] + value[0], 16),
            g: parseInt(value[1] + value[1], 16),
            b: parseInt(value[3] + value[3], 16),
        };
    }
    return {
        r: parseInt(value[0] + value[1], 16),
        g: parseInt(value[2] + value[3], 16),
        b: parseInt(value[4] + value[5], 16),
    };
}

function writeHexRgbColor(rgb: { r: number, g: number, b: number }) {
    const r = rgb.r.toString(16).padStart(2, '0');
    const g = rgb.g.toString(16).padStart(2, '0');
    const b = rgb.b.toString(16).padStart(2, '0');
    return `#${r + g + b}`;
}

function calculateValue(startValue: any, endValue: any, progress: number): any {
    switch (typeof startValue) {
        case 'number':
            const result = startValue + (endValue - startValue) * progress;
            return floor(result) === result ? result : parseFloat(result.toFixed(3));
        case 'string':
            if (startValue.match(/^[0-9.]+$/)) {
                const isFloat = startValue.indexOf('.') !== -1;
                const numericStartValue = isFloat
                    ? parseFloat(startValue)
                    : parseInt(startValue, 10);
                const numericEndValue = isFloat
                    ? parseFloat(endValue)
                    : parseInt(endValue, 10);
                return calculateValue(numericStartValue, numericEndValue, progress);
            }
            if (startValue.startsWith('#')) {
                if (!endValue.startsWith('#')) {
                    throw new Error('You can only animate hex colors to other hex colors');
                }
                const startRgb = readHexRgbColor(startValue.substr(1));
                const endRgb = readHexRgbColor(endValue.substr(1));
                return writeHexRgbColor({
                    r: parseInt(calculateValue(startRgb.r, endRgb.r, progress), 10),
                    g: parseInt(calculateValue(startRgb.g, endRgb.g, progress), 10),
                    b: parseInt(calculateValue(startRgb.b, endRgb.b, progress), 10),
                });
            }
            if (startValue.startsWith('0x')) {
                if (!endValue.startsWith('0x')) {
                    throw new Error('You can only animate hex numbers to other hex numbers (yet)');
                }
                const numericStartValue = parseInt(startValue.substr(2), 16);
                const numericEndValue = parseInt(endValue.substr(2), 16);
                return `0x${floor(calculateValue(numericStartValue, numericEndValue, progress)).toString(16)}`;
            }
            // We'll try to interpolate numeric values from the string and insert it again in the correct order
            const pattern = /(0x[0-9a-z]+|#[0-9a-z]{3}|#[0-9a-z]{6}|[0-9.]+)/ig;
            const startValues = startValue.match(pattern) || [];
            const endValues = endValue.match(pattern) || [];
            if (startValues.length !== endValues.length) {
                throw new Error(
                    'Failed to animate value: Object values and target values ' +
                    'don\'t have the same amount of numeric values',
                );
            }
            const currentValues = endValues
                .map((value: string, i: number) => calculateValue(startValues[i], value, progress));
            return (endValue as string).replace(pattern, (_, value: string) => {
                const idx = endValues.indexOf(value);
                return currentValues[idx];
            });
        case 'boolean':
            if (startValue && !endValue) {
                return progress <= .5;
            }
            if (endValue && !startValue) {
                return progress > .5;
            }
            return startValue;
    }
    throw new Error(`Failed to interpolate animation value: Type ${typeof startValue} not supported`);
}

export class Animation<T extends {}> {
    public readonly target: T;
    public readonly properties: Partial<T>;
    public readonly propertyKeys: Array<keyof T>;
    public readonly originalProperties: Partial<T>;
    public readonly duration: number;
    public readonly easing: EasingFunction;

    constructor(target: T, properties: Partial<T>, duration: number, easing: EasingFunction = linear) {
        this.target = target;
        this.properties = properties;
        this.propertyKeys = Object.keys(this.properties) as Array<keyof T>;
        this.originalProperties = this.propertyKeys.reduce((obj, key) => {
            if (typeof this.properties[key] !== typeof this.target[key]) {
                throw new Error(`Failed to animate target: Types of property ${key} don't match`);
            }
            obj[key] = this.target[key];
            return obj;
        }, {} as Partial<T>);
        this.duration = duration;
        this.easing = easing;
    }

    public invert() {
        return new Animation(this.target, this.originalProperties, this.duration, this.easing);
    }

    public seek(elapsedTime: number) {
        // Avoid division through zero
        const progress = max(0, min(this.duration === 0 ? 1 : elapsedTime / this.duration, 1));
        const t = this.easing(progress);
        for (let i = 0; i < this.propertyKeys.length; i += 1) {
            const key = this.propertyKeys[i];
            this.target[key] = calculateValue(this.originalProperties[key], this.properties[key], t);
        }
    }
}

export enum AnimationStatus {
    RUNNING,
    STOPPED,
    PAUSED,
    FINISHED,
}

const animationStatusSymbol = Symbol('status');

export class AnimationControl {
    public [animationStatusSymbol]: AnimationStatus = AnimationStatus.RUNNING;

    public stop() {
        this[animationStatusSymbol] = AnimationStatus.STOPPED;
    }

    public pause() {
        if (this[animationStatusSymbol] !== AnimationStatus.RUNNING) {
            throw new Error('Can\'t pause an animation that is not running');
        }
        this[animationStatusSymbol] = AnimationStatus.PAUSED;
    }

    public resume() {
        if (this[animationStatusSymbol] !== AnimationStatus.PAUSED) {
            throw new Error('Can\'t resume an animation that is not paused');
        }
        this[animationStatusSymbol] = AnimationStatus.RUNNING;
    }
}

export interface AnimationState<T extends {}> {
    animation: Animation<T>;
    control: AnimationControl;
    startTime?: number;
    onProgress?: (progress: number, elapsedTime: number) => void;
    onFinish?: () => void;
}

export class Animator {
    public readonly animations: Array<AnimationState<any>> = [];

    public update(elapsedTime: number) {
        const snapshot = [...this.animations];
        for (let i = 0; i < snapshot.length; i += 1) {
            const state = snapshot[i];
            const status = state.control[animationStatusSymbol];

            // Stop animation if its supposed to be stopped
            if (status === AnimationStatus.STOPPED) {
                this.animations.splice(this.animations.indexOf(state), 1);
                if (state.onFinish) {
                    state.onFinish();
                }
                continue;
            }

            // Stop animation if its supposed to be stopped
            if (status === AnimationStatus.PAUSED) {
                continue;
            }

            // Animation not started yet, start it
            if (typeof state.startTime === 'undefined') {
                state.startTime = elapsedTime;
                // No need to do state.animation.seek(0) as a
                // start for the animation, as its in its initial state anyways
                continue;
            }

            // Animation finished
            if (status === AnimationStatus.FINISHED
                || elapsedTime - state.startTime >= state.animation.duration) {
                this.animations.splice(this.animations.indexOf(state), 1);
                state.animation.seek(state.animation.duration);
                state.control[animationStatusSymbol] = AnimationStatus.FINISHED;
                if (state.onFinish) {
                    state.onFinish();
                }
                continue;
            }

            // Update animation
            const localElapsedTime = elapsedTime - state.startTime;
            state.animation.seek(localElapsedTime);
            if (state.onProgress) {
                state.onProgress(localElapsedTime / state.animation.duration, localElapsedTime);
            }
        }
    }

    public run<T extends {}>(
        animation: Animation<T>,
        control: AnimationControl = new AnimationControl(),
        onProgress?: (progress: number, elapsedTime: number) => void,
    ) {
        return new Promise(resolve => {
            this.animations.push({
                animation,
                control,
                onProgress,
                onFinish: resolve,
            });
        });
    }

    public async chain<T>(
        animations: Array<Animation<T>>,
        control: AnimationControl = new AnimationControl(),
        onProgress?: (
            totalProgress: number,
            totalElapsedTime: number,
            progress: number,
            elapedTime: number,
            animation: Animation<T>,
        ) => void,
    ) {
        const totalDuration = animations.reduce((c, v) => c + v.duration, 0);
        let totalElapsedTime = 0;
        for (let i = 0; i < animations.length; i += 1) {
            const animation = animations[i];
            await this.run(animation, control, (progress, elapsedTime) => {
                const localElapsedTime = totalElapsedTime + elapsedTime;
                if (onProgress) {
                    onProgress(localElapsedTime / totalDuration, localElapsedTime, progress, elapsedTime, animation);
                }
            });
            totalElapsedTime += animation.duration;
            if (control[animationStatusSymbol] === AnimationStatus.STOPPED) {
                break;
            }
        }
    }

    public async loop<T extends {}>(
        animations: Animation<T>|Array<Animation<T>>,
        control: AnimationControl = new AnimationControl(),
        onProgress?: (progress: number, elapsedTime: number) => void,
    ) {
        while (control[animationStatusSymbol] !== AnimationStatus.STOPPED) {
            if (Array.isArray(animations)) {
                await this.chain(animations, control, onProgress);
                continue;
            }
            await this.run(animations, control, onProgress);
        }
    }
}

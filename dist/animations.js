"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const easings_1 = require("./easings");
const { min, max, floor } = Math;
function readHexRgbColor(value) {
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
function writeHexRgbColor(rgb) {
    const r = rgb.r.toString(16).padStart(2, '0');
    const g = rgb.g.toString(16).padStart(2, '0');
    const b = rgb.b.toString(16).padStart(2, '0');
    return `#${r + g + b}`;
}
function calculateValue(startValue, endValue, progress) {
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
                throw new Error('Failed to animate value: Object values and target values ' +
                    'don\'t have the same amount of numeric values');
            }
            const currentValues = endValues
                .map((value, i) => calculateValue(startValues[i], value, progress));
            return endValue.replace(pattern, (_, value) => {
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
class Animation {
    constructor(target, properties, duration, easing = easings_1.linear) {
        this.target = target;
        this.properties = properties;
        this.propertyKeys = Object.keys(this.properties);
        this.originalProperties = this.propertyKeys.reduce((obj, key) => {
            if (typeof this.properties[key] !== typeof this.target[key]) {
                throw new Error(`Failed to animate target: Types of property ${key} don't match`);
            }
            obj[key] = this.target[key];
            return obj;
        }, {});
        this.duration = duration;
        this.easing = easing;
    }
    invert() {
        return new Animation(this.target, this.originalProperties, this.duration, this.easing);
    }
    seek(elapsedTime) {
        // Avoid division through zero
        const progress = max(0, min(this.duration === 0 ? 1 : elapsedTime / this.duration, 1));
        const t = this.easing(progress);
        for (let i = 0; i < this.propertyKeys.length; i += 1) {
            const key = this.propertyKeys[i];
            this.target[key] = calculateValue(this.originalProperties[key], this.properties[key], t);
        }
    }
}
exports.Animation = Animation;
var AnimationStatus;
(function (AnimationStatus) {
    AnimationStatus[AnimationStatus["RUNNING"] = 0] = "RUNNING";
    AnimationStatus[AnimationStatus["STOPPED"] = 1] = "STOPPED";
    AnimationStatus[AnimationStatus["PAUSED"] = 2] = "PAUSED";
    AnimationStatus[AnimationStatus["FINISHED"] = 3] = "FINISHED";
})(AnimationStatus = exports.AnimationStatus || (exports.AnimationStatus = {}));
const animationStatusSymbol = Symbol('status');
class AnimationControl {
    constructor() {
        this[_a] = AnimationStatus.RUNNING;
    }
    stop() {
        this[animationStatusSymbol] = AnimationStatus.STOPPED;
    }
    pause() {
        if (this[animationStatusSymbol] !== AnimationStatus.RUNNING) {
            throw new Error('Can\'t pause an animation that is not running');
        }
        this[animationStatusSymbol] = AnimationStatus.PAUSED;
    }
    resume() {
        if (this[animationStatusSymbol] !== AnimationStatus.PAUSED) {
            throw new Error('Can\'t resume an animation that is not paused');
        }
        this[animationStatusSymbol] = AnimationStatus.RUNNING;
    }
}
exports.AnimationControl = AnimationControl;
_a = animationStatusSymbol;
class Animator {
    constructor() {
        this.animations = [];
    }
    update(elapsedTime) {
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
    run(animation, control = new AnimationControl(), onProgress) {
        return new Promise(resolve => {
            this.animations.push({
                animation,
                control,
                onProgress,
                onFinish: resolve,
            });
        });
    }
    chain(animations, control = new AnimationControl(), onProgress) {
        return __awaiter(this, void 0, void 0, function* () {
            const totalDuration = animations.reduce((c, v) => c + v.duration, 0);
            let totalElapsedTime = 0;
            for (let i = 0; i < animations.length; i += 1) {
                const animation = animations[i];
                control[animationStatusSymbol] = AnimationStatus.RUNNING;
                yield this.run(animation, control, (progress, elapsedTime) => {
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
        });
    }
    loop(animations, control = new AnimationControl(), onProgress) {
        return __awaiter(this, void 0, void 0, function* () {
            while (control[animationStatusSymbol] !== AnimationStatus.STOPPED) {
                if (Array.isArray(animations)) {
                    yield this.chain(animations, control, onProgress);
                    continue;
                }
                yield this.run(animations, control, onProgress);
            }
        });
    }
}
exports.Animator = Animator;

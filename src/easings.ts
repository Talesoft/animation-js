/* tslint:disable:no-parameter-reassignment no-conditional-assignment no-increment-decrement */
// TODO: Refactor this so that the above ignored tslint rules can be enabled again

const { pow, abs, sin, asin, cos, sqrt, PI } = Math;

export type EasingFunction = (t: number) => number;

export function linear(t: number): number {
    return t;
}

export function quadIn(t: number): number {
    return t * t;
}

export function quadOut(t: number): number {
    return -1 * t * (t - 2);
}

export function quadInOut(t: number): number {
    if ((t /= 1 / 2) < 1) {
        return 1 / 2 * t * t;
    }
    return -1 / 2 * ((--t) * (t - 2) - 1);
}

export function cubicIn(t: number): number {
    return t * t * t;
}

export function cubicOut(t: number): number {
    return ((t = t - 1) * t * t + 1);
}

export function cubicInOut(t: number): number {
    if ((t /= 1 / 2) < 1) {
        return 1 / 2 * t * t * t;
    }
    return 1 / 2 * ((t -= 2) * t * t + 2);
}

export function quartIn(t: number): number {
    return t * t * t * t;
}

export function quartOut(t: number): number {
    return -1 * ((t = t - 1) * t * t * t - 1);
}

export function quartInOut(t: number): number {
    if ((t /= 1 / 2) < 1) {
        return 1 / 2 * t * t * t * t;
    }
    return -1 / 2 * ((t -= 2) * t * t * t - 2);
}

export function quintIn(t: number): number {
    return (t /= 1) * t * t * t * t;
}

export function  quintOut(t: number): number {
    return ((t = t - 1) * t * t * t * t + 1);
}

export function quintInOut(t: number): number {
    if ((t /= 1 / 2) < 1) {
        return 1 / 2 * t * t * t * t * t;
    }
    return 1 / 2 * ((t -= 2) * t * t * t * t + 2);
}

export function sineIn(t: number): number {
    return -1 * cos(t * (Math.PI / 2)) + 1;
}

export function sineOut(t: number): number {
    return sin(t * (Math.PI / 2));
}

export function sineInOut(t: number): number {
    return -1 / 2 * (cos(Math.PI * t) - 1);
}

export function expoIn(t: number): number {
    return (t === 0) ? 1 : pow(2, 10 * (t - 1));
}

export function expoOut(t: number): number {
    return (t === 1) ? 1 : (-pow(2, -10 * t) + 1);
}

export function expoInOut(t: number): number {
    if (t === 0) {
        return 0;
    }
    if (t === 1) {
        return 1;
    }
    if ((t /= 1 / 2) < 1) {
        return 1 / 2 * pow(2, 10 * (t - 1));
    }
    return 1 / 2 * (-pow(2, -10 * --t) + 2);
}

export function circIn(t: number): number {
    if (t >= 1) {
        return t;
    }
    return -1 * (sqrt(1 - (t /= 1) * t) - 1);
}

export function circOut(t: number): number {
    return sqrt(1 - (t = t - 1) * t);
}

export function circInOut(t: number): number {
    if ((t /= 1 / 2) < 1) {
        return -1 / 2 * (sqrt(1 - t * t) - 1);
    }
    return 1 / 2 * (sqrt(1 - (t -= 2) * t) + 1);
}

export function elasticIn(t: number): number {
    let s = 1.70158;
    let p = 0;
    let a = 1;
    if (t === 0) {
        return 0;
    }
    if ((t /= 1) === 1) {
        return 1;
    }
    if (!p) {
        p = .3;
    }
    if (a < abs(1)) {
        a = 1;
        s = p / 4;
    } else {
        s = p / (2 * PI) * asin(1 / a);
    }
    return -(a * pow(2, 10 * (t -= 1)) * sin((t - s) * (2 * PI) / p));
}

export function elasticOut(t: number): number {
    let s = 1.70158;
    let p = 0;
    let a = 1;
    if (t === 0) {
        return 0;
    }
    if ((t /= 1) === 1) {
        return 1;
    }
    if (!p) {
        p = .3;
    }
    if (a < abs(1)) {
        a = 1;
        s = p / 4;
    } else {
        s = p / (2 * PI) * asin(1 / a);
    }
    return a * pow(2, -10 * t) * sin((t - s) * (2 * Math.PI) / p) + 1;
}

export function elasticInOut(t: number): number {
    let s = 1.70158;
    let p = 0;
    let a = 1;
    if (t === 0) {
        return 0;
    }
    if ((t /= 1 / 2) === 2) {
        return 1;
    }
    if (!p) {
        p = (.3 * 1.5);
    }
    if (a < abs(1)) {
        a = 1;
        s = p / 4;
    } else {
        s = p / (2 * PI) * asin(1 / a);
    }
    if (t < 1) {
        return -.5 * (a * pow(2, 10 * (t -= 1)) * sin((t - s) * (2 * Math.PI) / p));
    }
    return a * pow(2, -10 * (t -= 1)) * sin((t - s) * (2 * Math.PI) / p) * .5 + 1;
}

export function backIn(t: number): number {
    const s = 1.70158;
    return (t /= 1) * t * ((s + 1) * t - s);
}

export function backOut(t: number): number {
    const s = 1.70158;
    return ((t = t - 1) * t * ((s + 1) * t + s) + 1);
}

export function backInOut(t: number): number {
    let s = 1.70158;
    if ((t /= 1 / 2) < 1) {
        return 1 / 2 * (t * t * (((s *= (1.525)) + 1) * t - s));
    }
    return 1 / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2);
}

export function bounceIn(t: number): number {
    return 1 - bounceOut(1 - t);
}

export function bounceOut(t: number) {
    if ((t /= 1) < (1 / 2.75)) {
        return (7.5625 * t * t);
    }
    if (t < (2 / 2.75)) {
        return (7.5625 * (t -= (1.5 / 2.75)) * t + .75);
    }
    if (t < (2.5 / 2.75)) {
        return (7.5625 * (t -= (2.25 / 2.75)) * t + .9375);
    }
    return (7.5625 * (t -= (2.625 / 2.75)) * t + .984375);
}

export function bounceInOut(t: number): number {
    if (t < 1 / 2) {
        return bounceInOut(t * 2) * .5;
    }
    return bounceOut(t * 2 - 1) * .5 + .5;
}

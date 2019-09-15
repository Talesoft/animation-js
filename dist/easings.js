"use strict";
/* tslint:disable:no-parameter-reassignment no-conditional-assignment no-increment-decrement */
// TODO: Refactor this so that the above ignored tslint rules can be enabled again
Object.defineProperty(exports, "__esModule", { value: true });
const { pow, abs, sin, asin, cos, sqrt, PI } = Math;
function linear(t) {
    return t;
}
exports.linear = linear;
function quadIn(t) {
    return t * t;
}
exports.quadIn = quadIn;
function quadOut(t) {
    return -1 * t * (t - 2);
}
exports.quadOut = quadOut;
function quadInOut(t) {
    if ((t /= 1 / 2) < 1) {
        return 1 / 2 * t * t;
    }
    return -1 / 2 * ((--t) * (t - 2) - 1);
}
exports.quadInOut = quadInOut;
function cubicIn(t) {
    return t * t * t;
}
exports.cubicIn = cubicIn;
function cubicOut(t) {
    return ((t = t - 1) * t * t + 1);
}
exports.cubicOut = cubicOut;
function cubicInOut(t) {
    if ((t /= 1 / 2) < 1) {
        return 1 / 2 * t * t * t;
    }
    return 1 / 2 * ((t -= 2) * t * t + 2);
}
exports.cubicInOut = cubicInOut;
function quartIn(t) {
    return t * t * t * t;
}
exports.quartIn = quartIn;
function quartOut(t) {
    return -1 * ((t = t - 1) * t * t * t - 1);
}
exports.quartOut = quartOut;
function quartInOut(t) {
    if ((t /= 1 / 2) < 1) {
        return 1 / 2 * t * t * t * t;
    }
    return -1 / 2 * ((t -= 2) * t * t * t - 2);
}
exports.quartInOut = quartInOut;
function quintIn(t) {
    return (t /= 1) * t * t * t * t;
}
exports.quintIn = quintIn;
function quintOut(t) {
    return ((t = t - 1) * t * t * t * t + 1);
}
exports.quintOut = quintOut;
function quintInOut(t) {
    if ((t /= 1 / 2) < 1) {
        return 1 / 2 * t * t * t * t * t;
    }
    return 1 / 2 * ((t -= 2) * t * t * t * t + 2);
}
exports.quintInOut = quintInOut;
function sineIn(t) {
    return -1 * cos(t * (Math.PI / 2)) + 1;
}
exports.sineIn = sineIn;
function sineOut(t) {
    return sin(t * (Math.PI / 2));
}
exports.sineOut = sineOut;
function sineInOut(t) {
    return -1 / 2 * (cos(Math.PI * t) - 1);
}
exports.sineInOut = sineInOut;
function expoIn(t) {
    return (t === 0) ? 1 : pow(2, 10 * (t - 1));
}
exports.expoIn = expoIn;
function expoOut(t) {
    return (t === 1) ? 1 : (-pow(2, -10 * t) + 1);
}
exports.expoOut = expoOut;
function expoInOut(t) {
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
exports.expoInOut = expoInOut;
function circIn(t) {
    if (t >= 1) {
        return t;
    }
    return -1 * (sqrt(1 - (t /= 1) * t) - 1);
}
exports.circIn = circIn;
function circOut(t) {
    return sqrt(1 - (t = t - 1) * t);
}
exports.circOut = circOut;
function circInOut(t) {
    if ((t /= 1 / 2) < 1) {
        return -1 / 2 * (sqrt(1 - t * t) - 1);
    }
    return 1 / 2 * (sqrt(1 - (t -= 2) * t) + 1);
}
exports.circInOut = circInOut;
function elasticIn(t) {
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
    }
    else {
        s = p / (2 * PI) * asin(1 / a);
    }
    return -(a * pow(2, 10 * (t -= 1)) * sin((t - s) * (2 * PI) / p));
}
exports.elasticIn = elasticIn;
function elasticOut(t) {
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
    }
    else {
        s = p / (2 * PI) * asin(1 / a);
    }
    return a * pow(2, -10 * t) * sin((t - s) * (2 * Math.PI) / p) + 1;
}
exports.elasticOut = elasticOut;
function elasticInOut(t) {
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
    }
    else {
        s = p / (2 * PI) * asin(1 / a);
    }
    if (t < 1) {
        return -.5 * (a * pow(2, 10 * (t -= 1)) * sin((t - s) * (2 * Math.PI) / p));
    }
    return a * pow(2, -10 * (t -= 1)) * sin((t - s) * (2 * Math.PI) / p) * .5 + 1;
}
exports.elasticInOut = elasticInOut;
function backIn(t) {
    const s = 1.70158;
    return (t /= 1) * t * ((s + 1) * t - s);
}
exports.backIn = backIn;
function backOut(t) {
    const s = 1.70158;
    return ((t = t - 1) * t * ((s + 1) * t + s) + 1);
}
exports.backOut = backOut;
function backInOut(t) {
    let s = 1.70158;
    if ((t /= 1 / 2) < 1) {
        return 1 / 2 * (t * t * (((s *= (1.525)) + 1) * t - s));
    }
    return 1 / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2);
}
exports.backInOut = backInOut;
function bounceIn(t) {
    return 1 - bounceOut(1 - t);
}
exports.bounceIn = bounceIn;
function bounceOut(t) {
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
exports.bounceOut = bounceOut;
function bounceInOut(t) {
    if (t < 1 / 2) {
        return bounceInOut(t * 2) * .5;
    }
    return bounceOut(t * 2 - 1) * .5 + .5;
}
exports.bounceInOut = bounceInOut;

const { Animator, Animation } = require('../dist');

const animator = new Animator();

// Basic animator loop based on setTimeout (60fps)
let elapsedTime = 0;
function update() {
    elapsedTime += 16.6;
    setTimeout(update, 16.6);
    animator.update(elapsedTime);
}

// Start the loop
update();

const target = {
    x: 10,
    y: 100,
    color: '#ff00ff',
};

const animation = new Animation(target, { color: '#00ff00' }, 2000);

animator.chain([animation, animation.invert()], undefined, p => console.log(p, target.color))
    .then(() => console.log('Animation finished', target.color, elapsedTime));

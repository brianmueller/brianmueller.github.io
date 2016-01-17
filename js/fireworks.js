// function setup() {
//     createCanvas(windowWidth, windowHeight);
// }

// function draw() {
//     // clear();
//     // fill(255);
//     // ellipse(mouseX, mouseY, 20, 20);
// }

// function mousePressed(){

// }


// Javascript ES6 Classes Firework Demo
// Chrome Only
// Original: Jacob Joaquin
// Remixed: Brian Mueller

'use strict';

let gravity,
    fireworks;

class DisplayableList extends Array {
    update() {
        this.forEach(function(item) {
            item.update();
        })
    }

    display() {
        this.forEach(function(item) {
            item.display();
        })
    }
}

class Ray {
    constructor(position, velocity) {
        this.position = position;
        this.velocity = velocity;
    }

    update() {
        this.velocity.add(gravity);
        this.position.add(this.velocity);
    }

    display() {
        let p2 = this.position.copy().sub(this.velocity.copy().mult(4));
        line(this.position.x, this.position.y, p2.x, p2.y);
    }
}

class Firework {
    constructor(nFrames, nRays, col) {
        this.nFrames = nFrames;
        this.framesLeft = nFrames;
        this.nRays = nRays;
        this.rays = new DisplayableList();
        this.col = col;
        let start_position = createVector(mouseX, mouseY);

        for (let i = 0; i < this.nRays; i++) {
            let position = start_position.copy(),
                velocity = p5.Vector.fromAngle(random(TAU)).mult(random(2)),
                ray = new Ray(position, velocity);
            this.rays.push(ray);
        }

    }

    update() {
        this.rays.update();
        this.framesLeft--;
    }

    display() {
        push();
        colorMode(BLEND);
        stroke(
            max(32, red(this.col)),
            max(32, green(this.col)),
            max(32, blue(this.col)),
            128 * this.framesLeft / this.nFrames
        );
        this.rays.display();
        pop();
    }
}

class FireworksManager extends DisplayableList {
    trigger() {
        push();
        colorMode(HSB);
        let col = color(random(255), 255, random(128, 255));
        pop();
        this.push(new Firework(random(30, 200), random(50, 300), col));
    }

    update() {
        for (let i = this.length - 1; i >= 0; i--) {
            let firework = this[i];
            firework.update();
            if (firework.framesLeft <= 0) {
                this.splice(i, 1);
            }
        }
    }

    display() {
        push();
        blendMode(ADD);
        for (let i = this.length - 1; i >= 0; i--) {
            let firework = this[i];
            firework.display();
        }
        pop();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    gravity = p5.Vector.fromAngle(HALF_PI).mult(0.025);
    fireworks = new FireworksManager();
    fireworks.trigger();
}

function draw() {
    blendMode(BLEND);
    clear();
    if (random(1) < 0.025) {
        fireworks.trigger();
    }
    fireworks.update();
    fireworks.display();
}
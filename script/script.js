class CursorFollower {
    constructor(color, startAngle) {
        this.element = document.createElement('div');
        this.element.className = 'cursor-follower';
        this.element.style.background = color;

        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.speedX = 0;
        this.speedY = 0;
        this.baseAngle = startAngle;
        this.distance = 40;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.positions = [];
        this.delay = 4;  // Reduced delay
    }

    update(mainX, mainY) {
        this.positions.push({ x: mainX, y: mainY });
        if (this.positions.length > this.delay) {
            this.positions.shift();
        }

        const delayedPosition = this.positions[0] || { x: mainX, y: mainY };
        const mouseSpeed = Math.hypot(delayedPosition.x - this.lastMouseX, delayedPosition.y - this.lastMouseY);
        const isMoving = mouseSpeed > 0.1;

        if (isMoving) {
            const dx = delayedPosition.x - this.x;
            const dy = delayedPosition.y - this.y;
            const angle = Math.atan2(dy, dx);

            this.targetX = delayedPosition.x + Math.cos(angle + Math.PI) * (30 + Math.random() * 15);
            this.targetY = delayedPosition.y + Math.sin(angle + Math.PI) * (30 + Math.random() * 15);
        } else {
            this.targetX = delayedPosition.x + Math.cos(this.baseAngle) * this.distance;
            this.targetY = delayedPosition.y + Math.sin(this.baseAngle) * this.distance;
        }

        const ax = (this.targetX - this.x) * 0.08;  // Increased acceleration
        const ay = (this.targetY - this.y) * 0.08;  // Increased acceleration

        this.speedX = this.speedX * 0.85 + ax;  // Increased damping
        this.speedY = this.speedY * 0.85 + ay;  // Increased damping

        this.x += this.speedX;
        this.y += this.speedY;

        this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;

        this.lastMouseX = delayedPosition.x;
        this.lastMouseY = delayedPosition.y;
    }
}

const wrapper = document.querySelector('.cursor-wrapper');
const mainCursor = document.querySelector('.cursor-main');
const colors = ['#7f00ff', '#0000ff', '#ff00ff', '#ff007f', '#ff00ff', '#7f00ff'];

const followers = colors.map((color, i) => {
    const angle = (i / colors.length) * Math.PI * 2;
    const follower = new CursorFollower(color, angle);
    wrapper.appendChild(follower.element);
    return follower;
});

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    mainCursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
});

function animate() {
    followers.forEach(follower => follower.update(mouseX, mouseY));
    requestAnimationFrame(animate);
}

animate();
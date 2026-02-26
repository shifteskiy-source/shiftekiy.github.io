const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: -1000, y: -1000 };

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

class Particle {
    constructor() {
        this.init();
    }

    init() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.size = Math.random() * 5 + 8;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.angle = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.05;
    }

    draw() {
        // Координаты вершин треугольника относительно центра (0,0)
        const vertices = [
            { x: 0, y: -this.size * 4 },       // Верхняя точка
            { x: -this.size * 0.8, y: this.size }, // Левая нижняя (чуть расширил для красоты)
            { x: this.size * 0.8, y: this.size }   // Правая нижняя
        ];

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // Эффект вращения в 3D (сплющивание)
        let scaleY = Math.abs(Math.cos(this.angle * 0.5));
        ctx.scale(1, scaleY);

        // 1. Рисуем сам треугольник (линии)
        ctx.beginPath();
        ctx.moveTo(vertices[0].x, vertices[0].y);
        ctx.lineTo(vertices[1].x, vertices[1].y);
        ctx.lineTo(vertices[2].x, vertices[2].y);
        ctx.closePath();
        
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.shadowBlur = 15;
        ctx.shadowColor = "white";
        ctx.stroke();

        // 2. Рисуем жирные точки в углах
        ctx.fillStyle = "white";
        vertices.forEach(v => {
            ctx.beginPath();
            // Рисуем круг радиусом 2.5 пикселя в каждой вершине
            ctx.arc(v.x, v.y, 2.5, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.restore();
    }

    update() {
        this.angle += this.spin;
        this.x += this.vx;
        this.y += this.vy;

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist < 200) {
            let force = (200 - dist) / 200;
            this.vx -= (dx / dist) * force * 0.8;
            this.vy -= (dy / dist) * force * 0.8;
        }

        this.vx *= 0.999;
        this.vy *= 0.999;

        if (this.x < -100) this.x = canvas.width + 100;
        if (this.x > canvas.width + 100) this.x = -100;
        if (this.y < -100) this.y = canvas.height + 100;
        if (this.y > canvas.height + 100) this.y = -100;
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}

const sections = document.querySelectorAll('.page-section');
const dots = document.querySelectorAll('.dot');

window.addEventListener('scroll', () => {
    let current = "";
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });

    dots.forEach(dot => {
        dot.classList.remove('active');
        if (dot.getAttribute('data-target') === current) {
            dot.classList.add('active');
        }
    });
});

resize();
for(let i = 0; i < 60; i++) {
    particles.push(new Particle());
}
animate();
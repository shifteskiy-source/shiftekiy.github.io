const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: -1000, y: -1000 };

    function init() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particles = [];
        for(let i=0; i<40; i++) particles.push(new Pyramid());
    }

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });

    class Pyramid {
        constructor() { this.reset(); this.opacity = Math.random() * 0.2 + 0.1; }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 10 + 10;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.rotX = Math.random() * Math.PI;
            this.rotY = Math.random() * Math.PI;
            this.rotZ = Math.random() * Math.PI;
            this.speedRotX = (Math.random() - 0.5) * 0.01;
            this.speedRotY = (Math.random() - 0.5) * 0.01;
            this.speedRotZ = (Math.random() - 0.5) * 0.01;
            this.basePoints = [
                {x: 0, y: -1.2, z: 0}, {x: -1, y: 1, z: 1}, {x: 1, y: 1, z: 1},
                {x: 1, y: 1, z: -1}, {x: -1, y: 1, z: -1}
            ];
        }
        project(p) {
            let x = p.x * this.size;
            let y = p.y * this.size;
            let z = p.z * this.size;
            let y1 = y * Math.cos(this.rotX) - z * Math.sin(this.rotX);
            let z1 = y * Math.sin(this.rotX) + z * Math.cos(this.rotX);
            let x2 = x * Math.cos(this.rotY) + z1 * Math.sin(this.rotY);
            let z2 = -x * Math.sin(this.rotY) + z1 * Math.cos(this.rotY);
            let x3 = x2 * Math.cos(this.rotZ) - y1 * Math.sin(this.rotZ);
            let y3 = x2 * Math.sin(this.rotZ) + y1 * Math.cos(this.rotZ);
            return { x: x3 + this.x, y: y3 + this.y };
        }
        draw() {
            let projected = this.basePoints.map(p => this.project(p));
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.strokeStyle = "#ff1493";
            ctx.lineWidth = 0.5;

            const connections = [[0,1], [0,2], [0,3], [0,4], [1,2], [2,3], [3,4], [4,1]];
            connections.forEach(([a, b]) => {
                ctx.beginPath(); ctx.moveTo(projected[a].x, projected[a].y);
                ctx.lineTo(projected[b].x, projected[b].y); ctx.stroke();
            });

            let d = Math.sqrt((mouse.x - this.x)**2 + (mouse.y - this.y)**2);
            if (d < 150) {
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.strokeStyle = `rgba(255, 20, 147, ${1 - d/150})`;
                ctx.stroke();
            }
            ctx.restore();
        }
        update() {
            this.x += this.vx; this.y += this.vy;
            this.rotX += this.speedRotX; this.rotY += this.speedRotY; this.rotZ += this.speedRotZ;
            if (this.x < -20) this.x = canvas.width + 20;
            if (this.x > canvas.width + 20) this.x = -20;
            if (this.y < -20) this.y = canvas.height + 20;
            if (this.y > canvas.height + 20) this.y = -20;
        }
    }

    function animate() {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }

    const sections = document.querySelectorAll('.page-section');
    const dots = document.querySelectorAll('.dot');
    window.addEventListener('scroll', () => {
        let current = "";
        sections.forEach(section => {
            if (pageYOffset >= section.offsetTop - 300) current = section.getAttribute('id');
        });
        dots.forEach(dot => {
            dot.classList.toggle('active', dot.getAttribute('data-target') === current);
        });
    }, { passive: true });

    dots.forEach(dot => {
        dot.onclick = () => document.getElementById(dot.getAttribute('data-target')).scrollIntoView({ behavior: 'smooth' });
    });

    init();
    animate();

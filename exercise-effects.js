// 琳凯蒂亚语练习系统 - 动态效果模块
// 包含烟花、粒子效果、魔法动画等

console.log('🎆 加载练习动态效果系统...');

// ===== 动态效果管理器 =====
class ExerciseEffects {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.animations = [];
        this.particles = [];
        this.sounds = {};
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.initSounds();
        this.startAnimationLoop();
        
        // 添加魔法光效样式
        this.addMagicStyles();
    }
    
    // 创建画布
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'exerciseEffectsCanvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 9999;
            opacity: 0.9;
        `;
        
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        // 设置画布尺寸
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    // 初始化音效
    initSounds() {
        // 创建音效（使用Web Audio API生成）
        this.sounds = {
            correct: this.createTone(800, 0.2, 'triangle'),
            wrong: this.createTone(300, 0.3, 'sawtooth'),
            magic: this.createTone(600, 0.4, 'sine'),
            complete: this.createTone(1000, 0.5, 'triangle')
        };
    }
    
    // 创建音调
    createTone(frequency, duration, type = 'sine') {
        return () => {
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = frequency;
                oscillator.type = type;
                
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
                
                oscillator.start();
                oscillator.stop(audioContext.currentTime + duration);
            } catch (e) {
                console.log('音效播放失败:', e);
            }
        };
    }
    
    // 添加魔法样式
    addMagicStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .magic-glow {
                animation: magicGlow 2s ease-in-out infinite;
                box-shadow: 0 0 20px rgba(102, 126, 234, 0.6);
            }
            
            .magic-sparkle {
                position: relative;
                overflow: hidden;
            }
            
            .magic-sparkle::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: linear-gradient(45deg, transparent, rgba(255,255,255,0.8), transparent);
                transform: rotate(45deg);
                animation: sparkle 1.5s ease-in-out;
            }
            
            .shake-animation {
                animation: shake 0.5s ease-in-out;
            }
            
            .bounce-animation {
                animation: bounce 0.6s ease-in-out;
            }
            
            .fade-in-up {
                animation: fadeInUp 0.8s ease-out;
            }
            
            @keyframes magicGlow {
                0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.6); }
                50% { box-shadow: 0 0 30px rgba(102, 126, 234, 0.9), 0 0 40px rgba(102, 126, 234, 0.6); }
            }
            
            @keyframes sparkle {
                0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
                100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            
            @keyframes fadeInUp {
                0% { opacity: 0; transform: translateY(30px); }
                100% { opacity: 1; transform: translateY(0); }
            }
            
            .firework-text {
                font-size: 2em;
                font-weight: bold;
                color: #ff6b6b;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                animation: fireworkText 2s ease-out;
            }
            
            @keyframes fireworkText {
                0% { transform: scale(0.5) rotate(-10deg); opacity: 0; }
                50% { transform: scale(1.2) rotate(5deg); opacity: 1; }
                100% { transform: scale(1) rotate(0deg); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 动画循环
    startAnimationLoop() {
        const animate = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // 更新和绘制粒子
            this.particles = this.particles.filter(particle => {
                particle.update();
                particle.draw(this.ctx);
                return particle.life > 0;
            });
            
            requestAnimationFrame(animate);
        };
        animate();
    }
    
    // 烟花效果
    createFireworks(x, y, colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7']) {
        console.log('🎆 触发烟花效果');
        
        // 播放音效
        this.sounds.correct();
        
        // 创建烟花粒子
        for (let i = 0; i < 30; i++) {
            const angle = (Math.PI * 2 * i) / 30;
            const velocity = 3 + Math.random() * 4;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            this.particles.push(new FireworkParticle(
                x, y, 
                Math.cos(angle) * velocity,
                Math.sin(angle) * velocity,
                color
            ));
        }
        
        // 添加额外的闪烁粒子
        for (let i = 0; i < 20; i++) {
            this.particles.push(new SparkleParticle(
                x + (Math.random() - 0.5) * 100,
                y + (Math.random() - 0.5) * 100
            ));
        }
    }
    
    // 错误震动效果
    createShakeEffect(element) {
        console.log('⚡ 触发震动效果');
        
        // 播放错误音效
        this.sounds.wrong();
        
        // 添加震动动画
        if (element) {
            element.classList.add('shake-animation');
            setTimeout(() => {
                element.classList.remove('shake-animation');
            }, 500);
        }
        
        // 创建红色粒子效果
        const rect = element ? element.getBoundingClientRect() : {left: window.innerWidth/2, top: window.innerHeight/2};
        for (let i = 0; i < 15; i++) {
            this.particles.push(new ErrorParticle(
                rect.left + rect.width/2,
                rect.top + rect.height/2
            ));
        }
    }
    
    // 魔法光效
    createMagicEffect(element) {
        console.log('✨ 触发魔法效果');
        
        // 播放魔法音效
        this.sounds.magic();
        
        if (element) {
            element.classList.add('magic-glow', 'magic-sparkle');
            setTimeout(() => {
                element.classList.remove('magic-glow', 'magic-sparkle');
            }, 2000);
        }
        
        // 创建魔法粒子
        const rect = element ? element.getBoundingClientRect() : {left: window.innerWidth/2, top: window.innerHeight/2};
        for (let i = 0; i < 25; i++) {
            this.particles.push(new MagicParticle(
                rect.left + Math.random() * rect.width,
                rect.top + Math.random() * rect.height
            ));
        }
    }
    
    // 完成庆祝效果
    createCompletionEffect() {
        console.log('🎉 触发完成庆祝效果');
        
        // 播放完成音效
        this.sounds.complete();
        
        // 全屏烟花
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight * 0.6;
                this.createFireworks(x, y);
            }, i * 300);
        }
        
        // 彩虹粒子雨
        this.createConfettiRain();
    }
    
    // 彩虹粒子雨
    createConfettiRain() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#fd79a8', '#6c5ce7'];
        
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                this.particles.push(new ConfettiParticle(
                    Math.random() * window.innerWidth,
                    -20,
                    colors[Math.floor(Math.random() * colors.length)]
                ));
            }, Math.random() * 2000);
        }
    }
    
    // 浮动提示效果
    showFloatingText(text, x, y, color = '#4ecdc4') {
        const textElement = document.createElement('div');
        textElement.textContent = text;
        textElement.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            color: ${color};
            font-size: 1.5em;
            font-weight: bold;
            pointer-events: none;
            z-index: 10000;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            animation: floatingText 2s ease-out forwards;
        `;
        
        // 添加浮动文字动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatingText {
                0% { transform: translateY(0) scale(0.8); opacity: 1; }
                100% { transform: translateY(-50px) scale(1.2); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(textElement);
        
        setTimeout(() => {
            document.body.removeChild(textElement);
            document.head.removeChild(style);
        }, 2000);
    }
}

// ===== 粒子类 =====

// 烟花粒子
class FireworkParticle {
    constructor(x, y, vx, vy, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.life = 1.0;
        this.decay = 0.02;
        this.gravity = 0.1;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.vx *= 0.99;
        this.life -= this.decay;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// 闪烁粒子
class SparkleParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.life = 1.0;
        this.decay = 0.05;
        this.size = Math.random() * 3 + 1;
    }
    
    update() {
        this.life -= this.decay;
        this.size *= 0.98;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// 错误粒子
class ErrorParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.life = 1.0;
        this.decay = 0.03;
        this.color = '#ff6b6b';
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.95;
        this.vy *= 0.95;
        this.life -= this.decay;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// 魔法粒子
class MagicParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = -Math.random() * 3 - 1;
        this.life = 1.0;
        this.decay = 0.02;
        this.colors = ['#667ee8', '#4ecdc4', '#96ceb4'];
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 添加光晕效果
        ctx.globalAlpha = this.life * 0.3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// 彩虹纸屑粒子
class ConfettiParticle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = Math.random() * 3 + 2;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;
        this.color = color;
        this.life = 1.0;
        this.decay = 0.005;
        this.gravity = 0.1;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.rotation += this.rotationSpeed;
        this.life -= this.decay;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color;
        ctx.fillRect(-3, -3, 6, 6);
        ctx.restore();
    }
}

// ===== 全局效果管理器实例 =====
let exerciseEffects = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎭 初始化练习动态效果系统');
    exerciseEffects = new ExerciseEffects();
    console.log('✅ 动态效果系统加载完成');
});

// 导出全局函数供练习系统使用
window.showFireworks = function(element) {
    if (exerciseEffects && element) {
        const rect = element.getBoundingClientRect();
        exerciseEffects.createFireworks(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2
        );
    }
};

window.showShakeEffect = function(element) {
    if (exerciseEffects) {
        exerciseEffects.createShakeEffect(element);
    }
};

window.showMagicEffect = function(element) {
    if (exerciseEffects) {
        exerciseEffects.createMagicEffect(element);
    }
};

window.showCompletionEffect = function() {
    if (exerciseEffects) {
        exerciseEffects.createCompletionEffect();
    }
};

window.showFloatingText = function(text, x, y, color) {
    if (exerciseEffects) {
        exerciseEffects.showFloatingText(text, x, y, color);
    }
};

console.log('✨ 练习动态效果模块加载完成');
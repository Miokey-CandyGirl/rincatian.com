// 琳凯蒂亚语语法页面交互脚本

// 语法标签切换功能
function showGrammarSection(sectionId) {
    // 隐藏所有语法部分
    const sections = document.querySelectorAll('.grammar-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // 移除所有标签的激活状态
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // 显示选中的部分
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.add('active');
    }
    
    // 激活对应的标签
    const activeTab = event.target;
    activeTab.classList.add('active');
    
    // 滚动到内容区域
    const grammarContent = document.querySelector('.grammar-content');
    if (grammarContent) {
        grammarContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // 重新初始化星空效果，确保星星继续旋转
    if (window.initializeStarfield) {
        setTimeout(() => {
            // 重新激活星空动画
            const starfield = document.getElementById('starfield');
            if (starfield) {
                const stars = starfield.querySelectorAll('.star');
                stars.forEach(star => {
                    // 重新应用旋转动画
                    const currentAnimation = star.style.animation;
                    star.style.animation = '';
                    setTimeout(() => {
                        star.style.animation = currentAnimation || `twinkle ${Math.random() * 4 + 2}s ease-in-out infinite alternate`;
                    }, 10);
                });
            }
        }, 100);
    }
    
    // 添加切换动画效果
    if (activeSection) {
        activeSection.style.opacity = '0';
        activeSection.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            activeSection.style.transition = 'all 0.5s ease';
            activeSection.style.opacity = '1';
            activeSection.style.transform = 'translateY(0)';
        }, 50);
    }
    
    // 创建魔法切换特效
    createMagicTransition();
    
    // 记录学习进度
    if (typeof learningProgress !== 'undefined') {
        learningProgress.markSectionVisited(sectionId);
    }
}

// 魔法切换特效
function createMagicTransition() {
    const sparkles = document.createElement('div');
    sparkles.className = 'magic-sparkles';
    sparkles.innerHTML = '✨'.repeat(0);
    sparkles.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 30px;
        animation: sparkleRotate 1s ease-out;
        pointer-events: none;
        z-index: 1000;
    `;
    
    document.body.appendChild(sparkles);
    
    setTimeout(() => {
        sparkles.remove();
    }, 1000);
}

// 练习答案检查功能
function checkAnswer(questionNumber) {
    const answerElement = document.getElementById(`answer-${questionNumber}`);
    
    // 对于选择题，检查答案是否正确
    if (questionNumber >= 4 && questionNumber <= 7) {
        const selectedOption = document.querySelector(`input[name="q${questionNumber}"]:checked`);
        if (selectedOption) {
            const correctAnswers = {
                4: "'ô",
                5: "'ō",
                6: "le",
                7: "ze"
            };
            
            const isCorrect = selectedOption.value === correctAnswers[questionNumber];
            
            // 显示结果反馈
            if (isCorrect) {
                selectedOption.parentElement.style.background = 'rgba(0, 255, 0, 0.2)';
                selectedOption.parentElement.style.borderColor = '#00ff00';
                createCorrectEffect(selectedOption.parentElement);
            } else {
                selectedOption.parentElement.style.background = 'rgba(255, 0, 0, 0.2)';
                selectedOption.parentElement.style.borderColor = '#ff0000';
                
                // 高亮正确答案
                const correctOption = document.querySelector(`input[name="q${questionNumber}"][value="${correctAnswers[questionNumber]}"]`);
                if (correctOption) {
                    correctOption.parentElement.style.background = 'rgba(0, 255, 0, 0.2)';
                    correctOption.parentElement.style.borderColor = '#00ff00';
                }
            }
        }
    }
    
    if (answerElement.style.display === 'none') {
        answerElement.style.display = 'block';
        answerElement.style.opacity = '0';
        answerElement.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            answerElement.style.transition = 'all 0.3s ease';
            answerElement.style.opacity = '1';
            answerElement.style.transform = 'translateY(0)';
        }, 50);
        
        // 创建魔法粒子效果
        createMagicCheckEffect(event.target);
    } else {
        answerElement.style.opacity = '0';
        answerElement.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            answerElement.style.display = 'none';
        }, 300);
    }
}

// 正确答案的得分效果
function createCorrectEffect(element) {
    const effect = document.createElement('div');
    effect.textContent = '✓ 正确!';
    effect.style.cssText = `
        position: absolute;
        top: -30px;
        right: 10px;
        color: #00ff00;
        font-weight: bold;
        font-size: 1.2rem;
        z-index: 1000;
        animation: correct-popup 2s ease-out forwards;
    `;
    
    element.style.position = 'relative';
    element.appendChild(effect);
    
    setTimeout(() => {
        effect.remove();
    }, 2000);
}

// 添加正确答案动画
const correctStyle = document.createElement('style');
correctStyle.textContent = `
    @keyframes correct-popup {
        0% {
            opacity: 0;
            transform: scale(0.5) translateY(20px);
        }
        50% {
            opacity: 1;
            transform: scale(1.2) translateY(-10px);
        }
        100% {
            opacity: 0;
            transform: scale(1) translateY(-30px);
        }
    }
`;
document.head.appendChild(correctStyle);

// 创建检查答案时的魔法效果
function createMagicCheckEffect(button) {
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.width = '6px';
        particle.style.height = '6px';
        particle.style.background = '#00bcd4';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        particle.style.boxShadow = '0 0 10px #00bcd4';
        
        document.body.appendChild(particle);
        
        const angle = (i / 8) * Math.PI * 2;
        const distance = 100;
        const endX = centerX + Math.cos(angle) * distance;
        const endY = centerY + Math.sin(angle) * distance;
        
        const animation = particle.animate([
            {
                transform: 'translate(-50%, -50%) scale(0)',
                opacity: 1
            },
            {
                transform: `translate(${endX - centerX}px, ${endY - centerY}px) scale(1)`,
                opacity: 0
            }
        ], {
            duration: 800,
            easing: 'ease-out'
        });
        
        animation.addEventListener('finish', () => {
            particle.remove();
        });
    }
}

// 语音播放功能（模拟）
function playPronunciation(text) {
    // 这里可以集成语音合成API
    console.log(`播放琳凯蒂亚语发音: ${text}`);
    
    // 创建音频反馈效果
    const audioIndicator = document.createElement('div');
    audioIndicator.style.position = 'fixed';
    audioIndicator.style.top = '50%';
    audioIndicator.style.left = '50%';
    audioIndicator.style.transform = 'translate(-50%, -50%)';
    audioIndicator.style.background = 'rgba(255, 215, 0, 0.9)';
    audioIndicator.style.color = '#1a237e';
    audioIndicator.style.padding = '1rem 2rem';
    audioIndicator.style.borderRadius = '20px';
    audioIndicator.style.fontSize = '1.2rem';
    audioIndicator.style.fontWeight = 'bold';
    audioIndicator.style.zIndex = '10000';
    audioIndicator.style.boxShadow = '0 10px 30px rgba(255, 215, 0, 0.5)';
    audioIndicator.textContent = `🔊 ${text}`;
    
    document.body.appendChild(audioIndicator);
    
    setTimeout(() => {
        audioIndicator.style.transition = 'all 0.3s ease';
        audioIndicator.style.opacity = '0';
        audioIndicator.style.transform = 'translate(-50%, -50%) scale(0.8)';
        
        setTimeout(() => {
            audioIndicator.remove();
        }, 300);
    }, 1500);
}

// 为琳凯蒂亚语文本添加点击发音功能
document.addEventListener('DOMContentLoaded', function() {
    const RincatianTexts = document.querySelectorAll('.Rincatian');
    RincatianTexts.forEach(text => {
        text.style.cursor = 'pointer';
        text.title = '点击播放发音';
        
        text.addEventListener('click', function() {
            playPronunciation(this.textContent.trim());
        });
        
        // 添加悬停效果
        text.addEventListener('mouseenter', function() {
            this.style.textShadow = '0 0 20px #ffd700';
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'all 0.3s ease';
        });
        
        text.addEventListener('mouseleave', function() {
            this.style.textShadow = 'none';
            this.style.transform = 'scale(1)';
        });
    });
});

// 语法卡片动画效果
function initializeGrammarAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    const cards = document.querySelectorAll('.grammar-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

// 搜索功能
function initializeSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = '搜索语法内容...';
    searchInput.className = 'grammar-search';
    searchInput.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 0.8rem 1.2rem;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 215, 0, 0.3);
        border-radius: 25px;
        color: white;
        font-size: 0.9rem;
        width: 250px;
        z-index: 1001;
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(searchInput);
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const allTextElements = document.querySelectorAll('.grammar-section p, .grammar-section h3, .grammar-section h4, .Rincatian, .translation');
        
        allTextElements.forEach(element => {
            const text = element.textContent.toLowerCase();
            if (searchTerm && text.includes(searchTerm)) {
                element.style.background = 'rgba(255, 215, 0, 0.3)';
                element.style.borderRadius = '3px';
            } else {
                element.style.background = 'none';
            }
        });
    });
}

// 学习进度跟踪
class LearningProgress {
    constructor() {
        this.progress = JSON.parse(localStorage.getItem('Rincatian-progress') || '{}');
        this.initializeProgress();
    }
    
    initializeProgress() {
        const sections = ['basics', 'phonetics', 'morphology', 'syntax', 'aspect', 'magic', 'exercises'];
        sections.forEach(section => {
            if (!this.progress[section]) {
                this.progress[section] = {
                    visited: false,
                    completed: false,
                    timeSpent: 0
                };
            }
        });
        this.saveProgress();
    }
    
    markSectionVisited(sectionId) {
        if (this.progress[sectionId]) {
            this.progress[sectionId].visited = true;
            this.saveProgress();
            this.updateProgressIndicator();
        }
    }
    
    markSectionCompleted(sectionId) {
        if (this.progress[sectionId]) {
            this.progress[sectionId].completed = true;
            this.saveProgress();
            this.updateProgressIndicator();
        }
    }
    
    saveProgress() {
        localStorage.setItem('Rincatian-progress', JSON.stringify(this.progress));
    }
    
    updateProgressIndicator() {
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach((tab, index) => {
            const sections = ['basics', 'phonetics', 'morphology', 'syntax', 'aspect', 'magic', 'exercises'];
            const sectionId = sections[index];
            
            if (this.progress[sectionId]?.completed) {
                tab.innerHTML = ' ✨';
            }
        });
    }
}

// 初始化学习进度
const learningProgress = new LearningProgress();

// 修改showGrammarSection函数以跟踪进度
const originalShowGrammarSection = showGrammarSection;
showGrammarSection = function(sectionId) {
    originalShowGrammarSection.call(this, sectionId);
    learningProgress.markSectionVisited(sectionId);
};

// 页面加载时初始化所有功能
document.addEventListener('DOMContentLoaded', function() {
    // 确保认证系统正确初始化
    if (typeof initializeAuthSystem === 'function') {
        initializeAuthSystem();
        setTimeout(() => {
            updateAuthenticationState();
        }, 100);
    }
    
    initializeGrammarAnimations();
    // initializeSearch(); // 移除搜索框功能
    learningProgress.updateProgressIndicator();
    
    // 添加键盘快捷键
    document.addEventListener('keydown', function(e) {
        // 按数字键1-7切换标签
        if (e.key >= '1' && e.key <= '7') {
            const sections = ['basics', 'phonetics', 'morphology', 'syntax', 'aspect', 'magic', 'exercises'];
            const sectionIndex = parseInt(e.key) - 1;
            if (sections[sectionIndex]) {
                showGrammarSection(sections[sectionIndex]);
                // 更新对应标签的激活状态
                const tabs = document.querySelectorAll('.tab-btn');
                tabs.forEach(tab => tab.classList.remove('active'));
                tabs[sectionIndex].classList.add('active');
            }
        }
    });
});

// 导出功能（将语法内容导出为PDF或打印）
function exportGrammar() {
    window.print();
}

// 添加导出按钮
function addExportButton() {
    const exportBtn = document.createElement('button');
    exportBtn.textContent = '📄 导出语法';
    exportBtn.className = 'export-btn';
    exportBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: linear-gradient(45deg, #7b1fa2, #1a237e);
        color: white;
        border: none;
        border-radius: 25px;
        cursor: pointer;
        font-weight: bold;
        z-index: 1001;
        box-shadow: 0 5px 15px rgba(123, 31, 162, 0.4);
        transition: all 0.3s ease;
    `;
    
    exportBtn.addEventListener('click', exportGrammar);
    exportBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 8px 25px rgba(123, 31, 162, 0.6)';
    });
    
    exportBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 5px 15px rgba(123, 31, 162, 0.4)';
    });
    
    document.body.appendChild(exportBtn);
}

// 页面加载完成后添加导出按钮
setTimeout(addExportButton, 1000);
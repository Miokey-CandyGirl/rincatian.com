// 琳凯蒂亚语语法练习系统 - 重构版本
// 带有魔法特效和互动功能

// ===== 全局函数声明 =====
// 立即暴露所有必要函数到全局作用域，确保HTML中的onclick可以正常调用

// 练习类型切换
window.showExerciseType = function(type) {
    console.log('切换练习类型:', type);
    ExerciseSystem.showType(type);
};

// 选择题相关
window.nextChoiceQuestion = function() {
    console.log('下一题按钮被点击');
    ExerciseSystem.nextQuestion('choice');
};

window.selectChoice = function(index) {
    console.log('选择选项:', index);
    ExerciseSystem.selectOption(index);
};

// 其他题型的全局函数
window.nextJudgeQuestion = function() { ExerciseSystem.nextQuestion('judge'); };
window.nextFillQuestion = function() { ExerciseSystem.nextQuestion('fill'); };
window.nextTranslateQuestion = function() { ExerciseSystem.nextQuestion('translate'); };
window.nextMagicQuestion = function() { ExerciseSystem.nextQuestion('magic'); };
window.selectJudge = function(value) { ExerciseSystem.selectJudge(value); };
window.submitChoiceExercise = function() { ExerciseSystem.submitExercise(); };
window.restartAllExercises = function() { ExerciseSystem.restart(); };
window.showExerciseReview = function() { ExerciseSystem.showReview(); };

console.log('全局函数已注册到window对象');

// ===== 练习系统核心类 =====
const ExerciseSystem = {
    // 初始化标志
    initialized: false,
    
    // 初始化方法
    init() {
        if (this.initialized) return;
        
        console.log('初始化练习系统...');
        
        // 默认显示选择题
        this.showType('choice');
        this.initialized = true;
        
        console.log('练习系统初始化完成');
    },
    
    // 显示练习类型
    showType(type) {
        console.log('显示练习类型:', type);
        
        // 隐藏所有练习类型
        document.querySelectorAll('.exercise-type-section').forEach(el => {
            el.classList.remove('active');
        });
        
        // 移除所有标签的活动状态
        document.querySelectorAll('.exercise-tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // 显示选中的练习类型
        const targetSection = document.getElementById(type + '-exercises');
        if (targetSection) {
            targetSection.classList.add('active');
            console.log('激活练习区域:', targetSection.id);
        } else {
            console.error('找不到练习区域:', type + '-exercises');
            return;
        }
        
        // 激活对应标签
        const activeBtn = document.querySelector(`.exercise-tab-btn[onclick*="${type}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
            console.log('激活标签按钮');
        }
        
        // 初始化对应练习
        this.initExerciseType(type);
        
        // 魔法特效
        this.createMagicTransition();
    },
    
    // 初始化具体练习类型
    initExerciseType(type) {
        console.log('初始化练习类型:', type);
        
        switch(type) {
            case 'choice':
                this.initChoiceExercise();
                break;
            default:
                console.log('其他练习类型暂未实现:', type);
        }
    },
    
    // 初始化选择题
    initChoiceExercise() {
        console.log('初始化选择题');
        
        const container = document.getElementById('choiceContainer');
        if (!container) {
            console.error('找不到choiceContainer元素');
            return;
        }
        
        const current = currentExercises.choice;
        const total = exerciseData.choice.length;
        
        console.log('当前题目索引:', current, '总题目数:', total);
        
        if (current >= total) {
            container.innerHTML = '<p class="completion-message">🎉 恭喜完成所有选择题！</p>';
            return;
        }
        
        const question = exerciseData.choice[current];
        container.innerHTML = `
            <div class="question-container">
                <div class="question-header">
                    <div class="question-number">第 ${current + 1} 题</div>
                    <div class="question-type">${question.type}</div>
                </div>
                <div class="question-text">${question.question}</div>
                <div class="choices">
                    ${question.options.map((option, index) => `
                        <div class="choice-item" onclick="selectChoice(${index})">
                            <input type="radio" name="choice" value="${String.fromCharCode(65 + index)}" id="choice${index}">
                            <div class="choice-label">${String.fromCharCode(65 + index)}</div>
                            <div class="choice-text">${option}</div>
                        </div>
                    `).join('')}
                </div>
                <div class="answer-feedback" id="choiceFeedback"></div>
            </div>
        `;
        
        // 启用下一题按钮
        const nextBtn = document.getElementById('choiceNextBtn');
        if (nextBtn) {
            nextBtn.disabled = false;
            console.log('下一题按钮已启用');
        }
    },
    
    // 选择选项
    selectOption(index) {
        console.log('选择选项:', index);
        const choiceInput = document.getElementById(`choice${index}`);
        if (choiceInput) {
            choiceInput.checked = true;
            console.log('已选中选项:', index);
        } else {
            console.error('找不到选项输入框:', `choice${index}`);
        }
    },
    
    // 下一题
    nextQuestion(type) {
        console.log('下一题:', type);
        
        if (type === 'choice') {
            this.handleChoiceNext();
        }
    },
    
    // 处理选择题下一题
    handleChoiceNext() {
        const selectedOption = document.querySelector('input[name="choice"]:checked');
        if (!selectedOption) {
            this.showWarning('请先选择一个答案！');
            return;
        }
        
        const current = currentExercises.choice;
        const question = exerciseData.choice[current];
        const isCorrect = selectedOption.value === question.correct;
        
        console.log('当前题目:', current, '答案是否正确:', isCorrect);
        
        this.showFeedback('choice', isCorrect, question.explanation);
        
        if (isCorrect) {
            exerciseStats.correctAnswers++;
            exerciseStats.magicPoints += 10;
        } else {
            exerciseStats.magicPoints += 2;
        }
        
        exerciseStats.totalAnswered++;
        currentExercises.choice++;
        
        setTimeout(() => {
            this.initChoiceExercise();
            const nextBtn = document.getElementById('choiceNextBtn');
            if (nextBtn) nextBtn.disabled = true;
        }, 2000);
    },
    
    // 显示反馈
    showFeedback(type, isCorrect, explanation) {
        const feedbackEl = document.getElementById(type + 'Feedback');
        if (!feedbackEl) return;
        
        const icon = isCorrect ? '🎉' : '💫';
        const title = isCorrect ? '恭喜答对了！' : '再试试看吧！';
        const className = isCorrect ? 'correct' : 'incorrect';
        
        feedbackEl.innerHTML = `
            <div class="feedback ${className}">
                <div class="feedback-icon">${icon}</div>
                <div class="feedback-content">
                    <h4>${title}</h4>
                    <p>${explanation}</p>
                </div>
            </div>
        `;
    },
    
    // 显示警告
    showWarning(message) {
        const warning = document.createElement('div');
        warning.className = 'exercise-warning';
        warning.innerHTML = `
            <div class="warning-content">
                <span class="warning-icon">⚠️</span>
                <span class="warning-text">${message}</span>
            </div>
        `;
        
        document.body.appendChild(warning);
        
        setTimeout(() => {
            warning.remove();
        }, 3000);
    },
    
    // 魔法切换特效
    createMagicTransition() {
        const sparkles = document.createElement('div');
        sparkles.innerHTML = '✨'.repeat(10);
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
    },
    
    // 占位方法
    selectJudge(value) { console.log('选择判断:', value); },
    submitExercise() { console.log('提交练习'); },
    restart() { console.log('重新开始练习'); },
    showReview() { console.log('查看错题'); }
};

// ===== 数据定义 =====

// 练习数据
const exerciseData = {
    choice: [
        {
            id: 1,
            type: '语音文字',
            question: '琳凯蒂亚语共有多少个字母？',
            options: ['26个', '41个', '36个', '48个'],
            correct: 'B',
            explanation: '琳凯蒂亚语有15个元音和26个辅音，总共41个字母。这些字母来自星辰，每个都承载着魔法的力量。'
        },
        {
            id: 2,
            type: '词法概述',
            question: '"我爱你"的正确琳凯蒂亚语表达是：',
            options: [
                "Wi'ô ni'ō amale yo.",
                "Ni'ô wi'ō amale yo.",
                "Wi amale ni yo.",
                "Wi'ô amale ni'ō yo."
            ],
            correct: 'A',
            explanation: '正确结构：Wi\'ô（我+主语助词）ni\'ō（你+直接宾语助词）amale（爱+动词词尾）yo（陈述句结语）。'
        },
        {
            id: 3,
            type: '核心句法',
            question: '琳凯蒂亚语的标准句式结构是：',
            options: [
                '主语+谓语+宾语',
                '领语+主语+谓语+宾语+结语',
                '谓语+主语+宾语',
                '宾语+主语+谓语'
            ],
            correct: 'B',
            explanation: '琳凯蒂亚语的标准句式包含五个基本成分：领语+主语+谓语+宾语+结语。如星法塔般层次分明。'
        }
    ]
};

// 当前练习状态
const currentExercises = {
    choice: 0,
    judge: 0,
    fill: 0,
    translate: 0,
    magic: 0
};

// 练习统计
const exerciseStats = {
    totalAnswered: 0,
    correctAnswers: 0,
    magicPoints: 0,
    completedSections: new Set()
};

// ===== 初始化 =====

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM内容已加载，准备初始化练习系统');
    
    // 检查是否在语法页面
    const exerciseSection = document.querySelector('.exercise-section');
    if (exerciseSection) {
        console.log('检测到练习区域，延迟初始化以确保所有元素都已加载');
        
        // 延迟初始化，确保所有DOM元素都已加载
        setTimeout(() => {
            ExerciseSystem.init();
        }, 200);
    } else {
        console.log('当前页面不包含练习区域');
    }
});

// ===== CSS动画 =====
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkleRotate {
        0% { transform: translate(-50%, -50%) rotate(0deg) scale(0); }
        50% { transform: translate(-50%, -50%) rotate(180deg) scale(1); }
        100% { transform: translate(-50%, -50%) rotate(360deg) scale(0); }
    }
    
    .exercise-warning {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 193, 7, 0.95);
        color: #856404;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: bold;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
    
    .feedback {
        margin-top: 15px;
        padding: 15px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .feedback.correct {
        background: rgba(76, 175, 80, 0.1);
        border: 1px solid rgba(76, 175, 80, 0.3);
        color: #2e7d32;
    }
    
    .feedback.incorrect {
        background: rgba(244, 67, 54, 0.1);
        border: 1px solid rgba(244, 67, 54, 0.3);
        color: #c62828;
    }
    
    .feedback-icon {
        font-size: 24px;
    }
    
    .feedback-content h4 {
        margin: 0 0 8px 0;
        font-size: 16px;
    }
    
    .feedback-content p {
        margin: 0;
        line-height: 1.5;
    }
`;
document.head.appendChild(style);

console.log('练习系统脚本已加载完成');
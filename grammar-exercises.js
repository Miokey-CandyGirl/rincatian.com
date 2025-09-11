// 琳凯蒂亚语小试牛刀练习系统
// 全新简洁版本 - 直接基于HTML结构

console.log('🎯 初始化练习系统...');

// 练习数据
const exercises = {
    choice: [
        {
            question: '琳凯蒂亚语共有多少个字母？',
            options: ['26个', '41个', '36个', '48个'],
            correct: 1,
            explanation: '琳凯蒂亚语有15个元音和26个辅音，总共41个字母。'
        },
        {
            question: '"我爱你"的正确琳凯蒂亚语表达是：',
            options: [
                "Wi'ô ni'ō amale yo.",
                "Ni'ô wi'ō amale yo.", 
                "Wi amale ni yo.",
                "Wi'ô amale ni'ō yo."
            ],
            correct: 0,
            explanation: '正确结构：Wi\'ô（我+主语助词）ni\'ō（你+直接宾语助词）amale（爱+动词词尾）yo（陈述句结语）。'
        },
        {
            question: '琳凯蒂亚语的标准句式结构是：',
            options: [
                '主语+谓语+宾语',
                '领语+主语+谓语+宾语+结语',
                '谓语+主语+宾语',
                '宾语+主语+谓语'
            ],
            correct: 1,
            explanation: '琳凯蒂亚语的标准句式包含五个基本成分：领语+主语+谓语+宾语+结语。'
        }
    ]
};

// 当前状态
let currentExerciseType = 'choice';
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;

// 切换练习类型 - 全局函数
function showExerciseType(type) {
    console.log('切换练习类型到:', type);
    
    currentExerciseType = type;
    currentQuestionIndex = 0;
    score = 0;
    selectedAnswer = null;
    
    // 隐藏所有练习区域
    document.querySelectorAll('.exercise-type-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // 移除所有标签激活状态
    document.querySelectorAll('.exercise-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 显示目标练习区域
    const targetSection = document.getElementById(type + '-exercises');
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // 激活对应标签
    event.target.classList.add('active');
    
    // 加载练习内容
    if (type === 'choice') {
        loadChoiceQuestion();
    }
}

// 加载选择题
function loadChoiceQuestion() {
    const container = document.getElementById('choiceContainer');
    const progressFill = document.getElementById('choiceProgress');
    const progressText = document.getElementById('choiceProgressText');
    
    if (!container) return;
    
    const totalQuestions = exercises.choice.length;
    
    // 更新进度
    const progress = (currentQuestionIndex / totalQuestions) * 100;
    progressFill.style.width = progress + '%';
    progressText.textContent = `${currentQuestionIndex}/${totalQuestions}`;
    
    // 检查是否完成
    if (currentQuestionIndex >= totalQuestions) {
        const finalScore = `${score}/${totalQuestions}`;
        const percentage = Math.round((score / totalQuestions) * 100);
        
        let congratsMessage = '';
        let celebrationLevel = 0;
        
        if (percentage === 100) {
            congratsMessage = '🎆 完美无缺！您是真正的琳凯蒂亚语大师！';
            celebrationLevel = 3;
        } else if (percentage >= 80) {
            congratsMessage = '🎉 太好了！您对琳凯蒂亚语有着很好的掌握！';
            celebrationLevel = 2;
        } else if (percentage >= 60) {
            congratsMessage = '👍 不错！继续加油，您会越来越好！';
            celebrationLevel = 1;
        } else {
            congratsMessage = '💪 加油加油！多多练习就会进步的！';
            celebrationLevel = 0;
        }
        
        container.innerHTML = `
            <div style="text-align:center; padding:40px;" class="completion-container">
                <div class="firework-text">${congratsMessage}</div>
                <div style="margin:20px 0; font-size:1.8em; color:#007bff;">
                    🏆 您的得分：${finalScore} (${percentage}%)
                </div>
                <div style="margin:20px 0;">
                    <div class="magic-level-badge" style="
                        padding:10px 20px; 
                        border-radius:25px; 
                        background:linear-gradient(45deg, #667ee8, #4ecdc4);
                        color:white;
                        font-weight:bold;
                        display:inline-block;
                        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                    ">
                        ✨ ${getMagicLevel(percentage)}
                    </div>
                </div>
                <button onclick="restartChoiceExercise()" style="
                    margin-top:15px; 
                    padding:12px 25px; 
                    border:none; 
                    background:#007bff; 
                    color:white; 
                    border-radius:8px; 
                    cursor:pointer;
                    font-size:16px;
                    font-weight:500;
                    transition:all 0.3s ease;
                    margin-right: 15px;
                " class="restart-btn">🔄 重新开始</button>
                
                <button onclick="proceedToNextExerciseType()" style="
                    margin-top:15px; 
                    padding:12px 25px; 
                    border:none; 
                    background:#28a745; 
                    color:white; 
                    border-radius:8px; 
                    cursor:pointer;
                    font-size:16px;
                    font-weight:500;
                    transition:all 0.3s ease;
                " class="next-type-btn">🎆 进入下一类型</button>
            </div>
        `;
        
        // 根据成绩触发不同级别的庆祝效果
        setTimeout(() => {
            if (celebrationLevel >= 3 && window.showCompletionEffect) {
                // 满分：全屏烟花庆祝
                window.showCompletionEffect();
            } else if (celebrationLevel >= 2 && window.showFireworks) {
                // 高分：多个烟花
                const containerRect = container.getBoundingClientRect();
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => {
                        window.showFireworks(container);
                    }, i * 300);
                }
            } else if (celebrationLevel >= 1 && window.showMagicEffect) {
                // 中等分数：魔法效果
                window.showMagicEffect(container);
            }
            
            // 添加重新开始按钮的悬停效果
            const restartBtn = container.querySelector('.restart-btn');
            if (restartBtn) {
                restartBtn.addEventListener('mouseenter', function() {
                    this.style.background = '#0056b3';
                    this.style.transform = 'translateY(-2px)';
                    if (window.showMagicEffect) {
                        window.showMagicEffect(this);
                    }
                });
                restartBtn.addEventListener('mouseleave', function() {
                    this.style.background = '#007bff';
                    this.style.transform = 'translateY(0)';
                });
            }
        }, 500);
        
        return;
    }
    
    const question = exercises.choice[currentQuestionIndex];
    
    // 生成题目HTML
    let optionsHTML = '';
    question.options.forEach((option, index) => {
        optionsHTML += `
            <div style="margin:10px 0; cursor:pointer;" onclick="selectChoiceOption(${index})">
                <label style="display:flex; align-items:center; cursor:pointer; padding:10px; border-radius:5px; border:2px solid #ddd; transition:all 0.3s;">
                    <input type="radio" name="choice" value="${index}" style="margin-right:10px;">
                    <span>${String.fromCharCode(65 + index)}. ${option}</span>
                </label>
            </div>
        `;
    });
    
    container.innerHTML = `
        <div style="margin-bottom:20px;">
            <h4>第 ${currentQuestionIndex + 1} 题 / 共 ${totalQuestions} 题</h4>
            <p style="font-size:18px; margin:15px 0;">${question.question}</p>
        </div>
        <div id="choiceOptions">${optionsHTML}</div>
        <div id="choiceFeedback" style="display:none; margin-top:15px; padding:15px; border-radius:8px;"></div>
    `;
    
    selectedAnswer = null;
    // 不再默认禁用按钮，让用户可以直接点击
}

// 选择选项
function selectChoiceOption(index) {
    console.log('选择选项:', index);
    
    selectedAnswer = index;
    
    // 清除所有选择
    document.querySelectorAll('#choiceOptions input[type="radio"]').forEach(radio => {
        radio.checked = false;
        radio.parentElement.style.borderColor = '#ddd';
        radio.parentElement.style.backgroundColor = 'transparent';
        radio.parentElement.classList.remove('magic-sparkle', 'bounce-animation');
    });
    
    // 选中当前选项
    const selectedRadio = document.querySelector(`#choiceOptions input[value="${index}"]`);
    if (selectedRadio) {
        selectedRadio.checked = true;
        selectedRadio.parentElement.style.borderColor = '#007bff';
        selectedRadio.parentElement.style.backgroundColor = '#f0f7ff';
        
        // 添加选中动效
        selectedRadio.parentElement.classList.add('bounce-animation');
        
        // 轻微的魔法效果
        if (window.showMagicEffect) {
            setTimeout(() => {
                window.showMagicEffect(selectedRadio.parentElement);
            }, 100);
        }
        
        // 播放选中音效（轻微）
        if (window.exerciseEffects && window.exerciseEffects.sounds) {
            // 创建轻微的选中音效
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = 400;
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.1);
            } catch (e) {
                // 忽略音效错误
            }
        }
    }
}

// 下一题
function nextChoiceQuestion() {
    console.log('点击下一题');
    
    if (selectedAnswer === null) {
        alert('请先选择一个答案！');
        return;
    }
    
    const question = exercises.choice[currentQuestionIndex];
    const isCorrect = selectedAnswer === question.correct;
    
    if (isCorrect) {
        score++;
    }
    
    // 显示反馈
    const feedbackDiv = document.getElementById('choiceFeedback');
    const icon = isCorrect ? '✅' : '❌';
    const title = isCorrect ? '回答正确！' : '回答错误';
    const bgColor = isCorrect ? '#d4edda' : '#f8d7da';
    const textColor = isCorrect ? '#155724' : '#721c24';
    
    feedbackDiv.innerHTML = `
        <div style="background:${bgColor}; color:${textColor}; padding:15px; border-radius:8px;">
            <strong>${icon} ${title}</strong><br>
            ${question.explanation}
        </div>
    `;
    feedbackDiv.style.display = 'block';
    feedbackDiv.classList.add('fade-in-up');
    
    // 添加动态效果
    if (isCorrect) {
        // 正确答案：烟花效果
        setTimeout(() => {
            if (window.showFireworks) {
                window.showFireworks(feedbackDiv);
            }
            if (window.showFloatingText) {
                const rect = feedbackDiv.getBoundingClientRect();
                const messages = ['太棒了！', '答对了！', '很好！', '继续加油！', '完美！', '优秀！'];
                const message = messages[Math.floor(Math.random() * messages.length)];
                window.showFloatingText(message, rect.left + rect.width/2, rect.top, '#4ecdc4');
            }
        }, 200);
        
        // 为整个练习容器添加魔法效果
        const container = document.getElementById('choiceContainer');
        if (container && window.showMagicEffect) {
            setTimeout(() => window.showMagicEffect(container), 500);
        }
    } else {
        // 错误答案：震动效果
        if (window.showShakeEffect) {
            window.showShakeEffect(feedbackDiv);
        }
        if (window.showFloatingText) {
            const rect = feedbackDiv.getBoundingClientRect();
            const messages = ['再想想', '加油！', '不要放弃', '继续努力'];
            const message = messages[Math.floor(Math.random() * messages.length)];
            window.showFloatingText(message, rect.left + rect.width/2, rect.top, '#ff6b6b');
        }
    }
    
    // 不再禁用按钮，让用户可以直接进入下一题
    
    setTimeout(() => {
        currentQuestionIndex++;
        loadChoiceQuestion();
    }, 2000);
}

// 重新开始选择题
function restartChoiceExercise() {
    currentQuestionIndex = 0;
    score = 0;
    selectedAnswer = null;
    
    // 添加重新开始的动效
    const container = document.getElementById('choiceContainer');
    if (container && window.showMagicEffect) {
        window.showMagicEffect(container);
    }
    
    loadChoiceQuestion();
}

// 进入下一个练习类型
function proceedToNextExerciseType() {
    console.log('🎆 进入下一个练习类型');
    
    // 练习类型顺序
    const exerciseTypes = ['choice', 'judge', 'fill', 'translate', 'magic'];
    const currentIndex = exerciseTypes.indexOf(currentExerciseType);
    
    if (currentIndex < exerciseTypes.length - 1) {
        // 进入下一个类型
        const nextType = exerciseTypes[currentIndex + 1];
        
        // 显示切换动画
        if (window.showMagicEffect) {
            const container = document.getElementById('choiceContainer');
            window.showMagicEffect(container);
        }
        
        // 显示进度提示
        if (window.showFloatingText) {
            const typeNames = {
                'judge': '📝 判断题',
                'fill': '✏️ 填空题', 
                'translate': '🌍 翻译题',
                'magic': '🔮 魔法练习'
            };
            window.showFloatingText(`即将进入 ${typeNames[nextType]}`, window.innerWidth/2, window.innerHeight/2, '#4ecdc4');
        }
        
        // 延迟切换，让动画播放完毕
        setTimeout(() => {
            showExerciseType(nextType);
        }, 1500);
    } else {
        // 已经是最后一个类型，显示全部完成
        if (window.showCompletionEffect) {
            window.showCompletionEffect();
        }
        if (window.showFloatingText) {
            window.showFloatingText('🎉 所有练习已完成！', window.innerWidth/2, window.innerHeight/2, '#ffd700');
        }
        alert('🎉 恭喜！您已经完成了所有类型的练习！');
    }
}

// 获取根据分数获取魔法等级
function getMagicLevel(percentage) {
    if (percentage === 100) return '传说魔法师 🏆';
    if (percentage >= 90) return '大魔法师 ✨';
    if (percentage >= 80) return '高级魔法师 🔮';
    if (percentage >= 70) return '中级魔法师 🌟';
    if (percentage >= 60) return '初级魔法师 🌱';
    return '魔法学徒 📚';
}

// 其他练习类型的实现（简化版）
function nextJudgeQuestion() {
    console.log('📝 进入判断题练习');
    
    const judgeContainer = document.getElementById('judgeContainer');
    if (!judgeContainer) return;
    
    // 显示判断题示例
    judgeContainer.innerHTML = `
        <div style="text-align:center; padding:40px;">
            <h3>📝 判断题示例</h3>
            <div style="margin:20px 0; font-size:18px;">
                “琳凯蒂亚语的句式结构是 主+谓+宾” - 这个说法是否正确？
            </div>
            <div style="margin:20px 0;">
                <button onclick="judgeAnswer(false)" style="margin:10px; padding:15px 30px; background:#28a745; color:white; border:none; border-radius:8px; cursor:pointer; font-size:16px;">✓ 正确</button>
                <button onclick="judgeAnswer(true)" style="margin:10px; padding:15px 30px; background:#dc3545; color:white; border:none; border-radius:8px; cursor:pointer; font-size:16px;">✗ 错误</button>
            </div>
            <div id="judgeResult" style="margin-top:20px; padding:15px; border-radius:8px; display:none;"></div>
            <div style="margin-top:30px;">
                <button onclick="proceedToNextExerciseType()" style="padding:12px 25px; background:#007bff; color:white; border:none; border-radius:8px; cursor:pointer;">🎆 进入下一类型</button>
            </div>
        </div>
    `;
    
    if (judgeContainer && window.showMagicEffect) {
        window.showMagicEffect(judgeContainer);
    }
}

function judgeAnswer(isCorrect) {
    const resultDiv = document.getElementById('judgeResult');
    const correct = false; // 正确答案是“错误”，因为琳凯蒂亚语的句式是“领+主+谓+宾+结”
    
    if (isCorrect === correct) {
        resultDiv.innerHTML = '<div style="background:#d4edda; color:#155724; padding:15px; border-radius:8px;"><strong>✓ 回答正确！</strong><br>琳凯蒂亚语的标准句式是：领语+主语+谓语+宾语+结语。</div>';
        if (window.showFireworks) {
            window.showFireworks(resultDiv);
        }
    } else {
        resultDiv.innerHTML = '<div style="background:#f8d7da; color:#721c24; padding:15px; border-radius:8px;"><strong>✗ 回答错误</strong><br>琳凯蒂亚语的标准句式是：领语+主语+谓语+宾语+结语，而不是简单的主谓宾结构。</div>';
        if (window.showShakeEffect) {
            window.showShakeEffect(resultDiv);
        }
    }
    
    resultDiv.style.display = 'block';
}

function nextFillQuestion() {
    console.log('✏️ 进入填空题练习');
    
    const fillContainer = document.getElementById('fillContainer');
    if (!fillContainer) return;
    
    fillContainer.innerHTML = `
        <div style="text-align:center; padding:40px;">
            <h3>✏️ 填空题示例</h3>
            <div style="margin:20px 0; font-size:18px;">
                请填入正确的助词：<br><br>
                Wi'__ ni'__ amale yo.<br>
                <span style="font-size:14px; color:#666;">(我_你_爱句结)</span>
            </div>
            <div style="margin:20px 0;">
                <input type="text" id="blank1" placeholder="填入第一个空" style="margin:5px; padding:10px; border:2px solid #ddd; border-radius:5px; width:120px;">
                <input type="text" id="blank2" placeholder="填入第二个空" style="margin:5px; padding:10px; border:2px solid #ddd; border-radius:5px; width:120px;">
            </div>
            <div style="margin:20px 0;">
                <button onclick="checkFillAnswer()" style="margin:10px; padding:15px 30px; background:#007bff; color:white; border:none; border-radius:8px; cursor:pointer; font-size:16px;">✓ 检查答案</button>
            </div>
            <div id="fillResult" style="margin-top:20px; padding:15px; border-radius:8px; display:none;"></div>
            <div style="margin-top:30px;">
                <button onclick="proceedToNextExerciseType()" style="padding:12px 25px; background:#007bff; color:white; border:none; border-radius:8px; cursor:pointer;">🎆 进入下一类型</button>
            </div>
        </div>
    `;
    
    if (fillContainer && window.showMagicEffect) {
        window.showMagicEffect(fillContainer);
    }
}

function checkFillAnswer() {
    const blank1 = document.getElementById('blank1').value.trim().toLowerCase();
    const blank2 = document.getElementById('blank2').value.trim().toLowerCase();
    const resultDiv = document.getElementById('fillResult');
    
    if (blank1 === 'ô' && blank2 === 'ō') {
        resultDiv.innerHTML = '<div style="background:#d4edda; color:#155724; padding:15px; border-radius:8px;"><strong>✓ 回答正确！</strong><br>Wi\'\u00f4 表示“我+主语助词”，ni\'\u014d 表示“你+直接宾语助词”。</div>';
        if (window.showFireworks) {
            window.showFireworks(resultDiv);
        }
    } else {
        resultDiv.innerHTML = '<div style="background:#f8d7da; color:#721c24; padding:15px; border-radius:8px;"><strong>✗ 需要再努力</strong><br>正确答案是：Wi\'\u00f4 ni\'\u014d amale yo. <br>• \u00f4 是主语助词<br>• \u014d 是直接宾语助词</div>';
        if (window.showShakeEffect) {
            window.showShakeEffect(resultDiv);
        }
    }
    
    resultDiv.style.display = 'block';
}

function nextTranslateQuestion() {
    console.log('🌍 进入翻译题练习');
    
    const translateContainer = document.getElementById('translateContainer');
    if (!translateContainer) return;
    
    translateContainer.innerHTML = `
        <div style="text-align:center; padding:40px;">
            <h3>🌍 翻译题示例</h3>
            <div style="margin:20px 0; font-size:18px;">
                请将下列中文翻译为琳凯蒂亚语：<br><br>
                “你好，朋友！”
            </div>
            <div style="margin:20px 0;">
                <textarea id="translation" placeholder="请输入您的翻译..." style="width:300px; height:80px; padding:10px; border:2px solid #ddd; border-radius:5px; resize:vertical;"></textarea>
            </div>
            <div style="margin:20px 0;">
                <button onclick="checkTranslation()" style="margin:10px; padding:15px 30px; background:#007bff; color:white; border:none; border-radius:8px; cursor:pointer; font-size:16px;">✓ 检查翻译</button>
            </div>
            <div id="translateResult" style="margin-top:20px; padding:15px; border-radius:8px; display:none;"></div>
            <div style="margin-top:30px;">
                <button onclick="proceedToNextExerciseType()" style="padding:12px 25px; background:#007bff; color:white; border:none; border-radius:8px; cursor:pointer;">🎆 进入下一类型</button>
            </div>
        </div>
    `;
    
    if (translateContainer && window.showMagicEffect) {
        window.showMagicEffect(translateContainer);
    }
}

function checkTranslation() {
    const translation = document.getElementById('translation').value.trim();
    const resultDiv = document.getElementById('translateResult');
    
    // 简单的关键词检查
    const hasHello = translation.toLowerCase().includes('salute') || translation.toLowerCase().includes('halo');
    const hasFriend = translation.toLowerCase().includes('amiko') || translation.toLowerCase().includes('friend');
    
    if (hasHello && hasFriend) {
        resultDiv.innerHTML = '<div style="background:#d4edda; color:#155724; padding:15px; border-radius:8px;"><strong>✓ 翻译不错！</strong><br>参考翻译："Salute amiko yo!" 或 "Halo amiko yo!"</div>';
        if (window.showFireworks) {
            window.showFireworks(resultDiv);
        }
    } else {
        resultDiv.innerHTML = '<div style="background:#f8d7da; color:#721c24; padding:15px; border-radius:8px;"><strong>→ 参考答案</strong><br>“你好，朋友！” 可以翻译为：<br>• "Salute amiko yo!"<br>• "Halo amiko yo!"</div>';
        if (window.showMagicEffect) {
            window.showMagicEffect(resultDiv);
        }
    }
    
    resultDiv.style.display = 'block';
}

function nextMagicQuestion() {
    console.log('🔮 进入魔法练习');
    
    const magicContainer = document.getElementById('magicContainer');
    if (!magicContainer) return;
    
    magicContainer.innerHTML = `
        <div style="text-align:center; padding:40px;">
            <h3>🔮 魔法练习示例</h3>
            <div style="margin:20px 0; font-size:18px;">
                请使用琳凯蒂亚语表达一个魔法哒语：<br><br>
                🌟 选择一个魔法元素：
            </div>
            <div style="margin:20px 0;">
                <button onclick="castMagic('fire')" style="margin:5px; padding:12px 20px; background:linear-gradient(45deg, #ff6b6b, #ff8e53); color:white; border:none; border-radius:8px; cursor:pointer;">🔥 火</button>
                <button onclick="castMagic('water')" style="margin:5px; padding:12px 20px; background:linear-gradient(45deg, #4ecdc4, #44a08d); color:white; border:none; border-radius:8px; cursor:pointer;">💧 水</button>
                <button onclick="castMagic('light')" style="margin:5px; padding:12px 20px; background:linear-gradient(45deg, #ffd700, #ffed4a); color:#333; border:none; border-radius:8px; cursor:pointer;">✨ 光</button>
                <button onclick="castMagic('star')" style="margin:5px; padding:12px 20px; background:linear-gradient(45deg, #667eea, #764ba2); color:white; border:none; border-radius:8px; cursor:pointer;">⭐ 星</button>
            </div>
            <div id="magicResult" style="margin-top:20px; padding:15px; border-radius:8px; display:none;"></div>
            <div style="margin-top:30px;">
                <button onclick="completeMagicExercise()" style="padding:12px 25px; background:#28a745; color:white; border:none; border-radius:8px; cursor:pointer;">🎉 完成所有练习</button>
            </div>
        </div>
    `;
    
    if (magicContainer && window.showMagicEffect) {
        window.showMagicEffect(magicContainer);
        // 为魔法练习添加特别的烟花效果
        setTimeout(() => {
            if (window.showFireworks) {
                window.showFireworks(magicContainer);
            }
        }, 500);
    }
}

function castMagic(element) {
    const resultDiv = document.getElementById('magicResult');
    const magicSpells = {
        'fire': {
            spell: 'Flamo magipowi yo!',
            meaning: '火焰魔法力量！',
            effect: '🔥'
        },
        'water': {
            spell: 'Aqua magipowi yo!',
            meaning: '水之魔法力量！',
            effect: '💧'
        },
        'light': {
            spell: 'Lumi magipowi yo!',
            meaning: '光芒魔法力量！',
            effect: '✨'
        },
        'star': {
            spell: 'Stella magipowi yo!',
            meaning: '星辉魔法力量！',
            effect: '⭐'
        }
    };
    
    const magic = magicSpells[element];
    resultDiv.innerHTML = `
        <div style="background:linear-gradient(45deg, rgba(102,126,234,0.1), rgba(255,215,0,0.1)); padding:20px; border-radius:12px; border:2px solid rgba(102,126,234,0.3);">
            <div style="font-size:24px; margin:10px 0;">${magic.effect}</div>
            <div style="font-size:18px; font-weight:bold; color:#667eea; margin:10px 0;">${magic.spell}</div>
            <div style="color:#666; font-size:14px;">${magic.meaning}</div>
        </div>
    `;
    resultDiv.style.display = 'block';
    
    // 特殊魔法效果
    if (window.showFireworks) {
        setTimeout(() => window.showFireworks(resultDiv), 300);
    }
    if (window.showMagicEffect) {
        setTimeout(() => window.showMagicEffect(resultDiv), 600);
    }
}

function completeMagicExercise() {
    // 最终庆祝效果
    if (window.showCompletionEffect) {
        window.showCompletionEffect();
    }
    
    if (window.showFloatingText) {
        window.showFloatingText('🎆 恭喜成为琳凯蒂亚语大师！', window.innerWidth/2, window.innerHeight/2, '#ffd700');
    }
    
    setTimeout(() => {
        alert('🎉 恭喜！您已经完成了所有的琳凯蒂亚语练习！你现在是真正的琳凯蒂亚语大师！');
    }, 2000);
}

function restartAllExercises() {
    if (confirm('确定要重新开始所有练习吗？')) {
        currentQuestionIndex = 0;
        score = 0;
        selectedAnswer = null;
        showExerciseType('choice');
    }
}

function showExerciseReview() {
    alert('错题回顾功能开发中...');
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成，初始化练习系统');
    
    // 默认加载选择题
    setTimeout(() => {
        loadChoiceQuestion();
        console.log('✅ 练习系统加载完成');
    }, 100);
});

console.log('✅ 练习系统脚本加载完成');
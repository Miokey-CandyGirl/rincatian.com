// 琳凯蒂亚语语法练习系统
// 带有魔法特效和互动功能

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
        },
        {
            id: 4,
            type: '数词系统',
            question: '"第三"的琳凯蒂亚语表达是：',
            options: ['disâm', 'sâmdi', 'trisâm', 'sâmto'],
            correct: 'A',
            explanation: 'di-（序数词前缀）+ sâm（三）= disâm（第三）。序数词通过di-前缀构成。'
        },
        {
            id: 5,
            type: '动词体态',
            question: '"正在学习"应该使用哪个动词体态词尾？',
            options: ['-le（完成式）', '-ze（进行式）', '-ge（计划式）', '-e（一般式）'],
            correct: 'B',
            explanation: '-ze是主动进行式词尾，表示正在进行的动作。如同魔法师正在施展咒语。'
        },
        {
            id: 6,
            type: '转义词尾',
            question: '"美丽地"（副词）的正确词尾是：',
            options: ['-i', '-a', '-u', '-o'],
            correct: 'C',
            explanation: '副词转义词尾有两种：-u（修饰动词/形容词）和-li（修饰其他成分）。"美丽地"修饰动词用-u。'
        },
        {
            id: 7,
            type: '性状动词',
            question: '"A不是B"应该使用哪个性状动词？',
            options: ['es', 'ese', 'nes', 'ez'],
            correct: 'C',
            explanation: 'nes表示"不是、不等于"（A≠B），是性质动词es的否定形式。'
        },
        {
            id: 8,
            type: '形容词比较',
            question: '形容词最高级的词尾是：',
            options: ['-tē', '-sā', '-xol', '-yē'],
            correct: 'B',
            explanation: '形容词最高级使用-sā词尾，如belasā（最美丽的），如双月交叠时最灿烂的光芒。'
        },
        {
            id: 9,
            type: '代词系统',
            question: '"他们自己"的琳凯蒂亚语表达是：',
            options: ['hinẑi', 'hinẑia', 'hina', 'hiẑi'],
            correct: 'A',
            explanation: 'hin（他们）+ ẑi（反身词尾）= hinẑi（他们自己）。反身代词用于强调动作的主体。'
        },
        {
            id: 10,
            type: '魔法用语',
            question: '在魔法咒语中，表示"愿意使用魔力"的能愿前止词是：',
            options: ['deθi', 'voli', 'ghi', 'povi'],
            correct: 'B',
            explanation: 'voli表示"愿意"，在魔法施展中表达使用魔力的意愿，如银蓝色铃铛树的共鸣之愿。'
        }
    ],
    judge: [
        {
            id: 1,
            type: '字母系统',
            statement: '琳凯蒂亚语有15个元音和26个辅音。',
            correct: true,
            explanation: '正确！琳凯蒂亚语确实有15个元音和26个辅音，总共41个字母，每个都源自星辰的祥瑞之光。'
        },
        {
            id: 2,
            type: '词尾规则',
            statement: '名词转义词尾是"-e"，动词转义词尾是"-o"。',
            correct: false,
            explanation: '错误！名词转义词尾是"-o"（集体复数"-on"），动词转义词尾是"-e"及其他体态词尾。'
        },
        {
            id: 3,
            type: '魔法用语',
            statement: '在双月交叠时，琳凯蒂亚语的魔法咒语效果会增强。',
            correct: true,
            explanation: '正确！在银月与金月交叠形成彩虹光环时，魔法咒语的力量会得到强化。'
        },
        {
            id: 4,
            type: '声叹词',
            statement: '琳凯蒂亚语中的声叹词统一使用"-h"词尾。',
            correct: true,
            explanation: '正确！所有声叹词（拟声词、拟态词、叹词）都使用-h词尾，如diŋdoŋh（叮哚）。'
        },
        {
            id: 5,
            type: '数词系统',
            statement: '序数词使用"fu-"前缀构成。',
            correct: false,
            explanation: '错误！序数词使用"di-"前缀构成，如dilêm（第六）。"fu-"是负数词前缀。'
        },
        {
            id: 6,
            type: '体态系统',
            statement: '琳凯蒂亚语的动词体态系统有兤16种组合。',
            correct: false,
            explanation: '错误！琳凯蒂亚语的动词体态系统是4×4×2=32种组合（动词16种+形容词16种）。'
        },
        {
            id: 7,
            type: '方位词',
            statement: '方位词可以直接做名词使用。',
            correct: true,
            explanation: '正确！方位词能直接做名词使用，如Elasï\'l ez tāyaŋ（东边有太阳）。'
        },
        {
            id: 8,
            type: '结语规则',
            statement: '琳凯蒂亚语句子必须以结语结尾。',
            correct: true,
            explanation: '正确！每个琳凯蒂亚语句子都必须以适当的结语结尾，如yo（陈述）、ne（疑问）、ga（感叹）。'
        }
    ],
    fill: [
        {
            id: 1,
            type: '代词变格',
            question: '"我们的"应该写作：___a',
            answer: 'win',
            explanation: 'win（我们）+ a（物主词尾）= wina（我们的），如月光下的共同誓言。'
        },
        {
            id: 2,
            type: '数词应用',
            question: '"第六"的琳凯蒂亚语表达是：___',
            answer: 'dilêm',
            explanation: 'di-（序数词前缀）+ lêm（六）= dilêm（第六），如第六层星法塔。'
        },
        {
            id: 3,
            type: '动词体态',
            question: '"正在学习"的动词体态词尾是：-___',
            answer: 'ze',
            explanation: '-ze是主动进行式词尾，表示正在进行的动作，如银蓝色铃铛树正在轻歌。'
        },
        {
            id: 4,
            type: '方位词组',
            question: '"书在桌子上"中，"桌子上"应该写作：___wo',
            answer: 'deko',
            explanation: 'deko（桌子）+ wo（上）= dekowo（桌子上），方位词组的基本结构。'
        },
        {
            id: 5,
            type: '转义词尾',
            question: '"做家务"中的"家务"（复数名词）应该写作：hom___',
            answer: 'on',
            explanation: 'hom（家）+ on（集体名词词尾）= homon（家务们/家事）。'
        },
        {
            id: 6,
            type: '魔法词汇',
            question: '"彩虹"的琳凯蒂亚语表达是：___bow',
            answer: 'color',
            explanation: 'colorbow（彩虹）是琳凯蒂亚星球上双月交叠时出现的美丽光环。'
        }
    ],
    translate: [
        {
            id: 1,
            type: '基础翻译',
            chinese: '我是一名学生。',
            answer: "Wi'ô sose es yo.",
            explanation: 'Wi\'ô（我+主语助词）sose（学生）es（是）yo（陈述句结语）'
        },
        {
            id: 2,
            type: '魔法表达',
            chinese: '光芒在水晶中显现。',
            answer: "Link'ô kris'ku morēnge yo.",
            explanation: 'Link\'ô（光+主语助词）kris\'ku（水晶+地点状语）morēnge（显现+动词）yo（陈述句结语）'
        },
        {
            id: 3,
            type: '疑问句',
            chinese: '你会说琳凯蒂亚语吗？',
            answer: "Ni'ô ghi Rincatian'ō kone ne?",
            explanation: 'Ni\'ô（你+主语助词）ghi（会）Rincatian\'ō（琳凯蒂亚语+宾语助词）kone（说话）ne（疑问句结语）'
        },
        {
            id: 4,
            type: '时态表达',
            chinese: '银蓝色的树正在歌唱。',
            answer: "Siltelo'ô yonze yo.",
            explanation: 'Siltelo\'ô（银蓝树+主语助词）yonze（歌唱+进行式）yo（陈述句结语）'
        },
        {
            id: 5,
            type: '复句表达',
            chinese: '当双月交叠时，彩虹出现了。',
            answer: "Yinmun golmun qikozi'xu, colorbow morēnle yo.",
            explanation: 'Yinmun golmun（银月金月）qikozi\'xu（快速交叠+时间状语）colorbow（彩虹）morēnle（显现+完成式）yo（陈述句结语）'
        }
    ],
    magic: [
        {
            id: 1,
            type: '光线召唤',
            question: '完成这个光线魔法咒语：Link\'ô voli\'xu kris\'ku _____ teyo!',
            answer: 'morēnge',
            explanation: '光芒在水晶中显现的魔法咒语，morēnge表示"显现"'
        },
        {
            id: 2,
            type: '自然共鸣',
            question: '与银蓝树交流的咒语中，表示"一起"的词是：_____',
            answer: 'yixoli',
            explanation: 'yixoli表示"一起、同时"，用于与自然元素的和谐共鸣'
        },
        {
            id: 3,
            type: '双月祝福',
            question: '双月祝福咒语：Yinmun golmun\'ô colorbow\'ku _____ handêga!',
            answer: 'qikozi',
            explanation: 'qikozi表示"快速交叠"，是双月祝福的关键词'
        },
        {
            id: 4,
            type: '能愿魔法',
            question: '表示"渴望施展魔法"的能愿前止词是：_____',
            answer: 'deθi',
            explanation: 'deθi表示意愿态中的"渴望、想要"，用于魔法意愿表达'
        },
        {
            id: 5,
            type: '星法塔仪式',
            question: '在星法塔顶端施法时的庄严用语，表示"应该"的词是：_____',
            answer: 'devi',
            explanation: 'devi表示必然态中的"应该、应当"，用于庄严的魔法仪式'
        },
        {
            id: 6,
            type: '流光共振',
            question: '团体魔法中，表示"共鸣"的词是：_____',
            answer: 'resonan',
            explanation: 'resonan表示"共鸣"，用于多人合作施展大型魔法时的能量协调'
        },
        {
            id: 7,
            type: '魔法强化',
            question: '强调魔法效果的呼应结构中，加强词是：_____',
            answer: 'ce',
            explanation: 'ce是强调词，在魔法咒语中用于加强效果，如"θi link, ce link"'
        }
    ],
};

// 当前练习状态
let currentExercises = {
    choice: 0,
    judge: 0,
    fill: 0,
    translate: 0,
    magic: 0
};

// 练习统计
let exerciseStats = {
    totalAnswered: 0,
    correctAnswers: 0,
    magicPoints: 0,
    completedSections: new Set()
};

// 初始化判断题
function initJudgeExercise() {
    const container = document.getElementById('judgeContainer');
    if (!container) return;
    
    const current = currentExercises.judge;
    const total = exerciseData.judge.length;
    
    if (current >= total) {
        container.innerHTML = '<p class="completion-message">🎉 恭喜完成所有判断题！</p>';
        const submitBtn = document.querySelector('.exercise-submit[onclick="submitJudgeExercise()"]');
        if (submitBtn) submitBtn.style.display = 'block';
        return;
    }
    
    const question = exerciseData.judge[current];
    container.innerHTML = `
        <div class="question-container">
            <div class="question-header">
                <div class="question-number">第 ${current + 1} 题</div>
                <div class="question-type">${question.type}</div>
            </div>
            <div class="question-text">${question.statement}</div>
            <div class="judge-choices">
                <div class="judge-item" onclick="selectJudge(true)">
                    <input type="radio" name="judge" value="true" id="judgeTrue">
                    <span class="judge-label true">✓ 正确</span>
                </div>
                <div class="judge-item" onclick="selectJudge(false)">
                    <input type="radio" name="judge" value="false" id="judgeFalse">
                    <span class="judge-label false">✗ 错误</span>
                </div>
            </div>
            <div class="answer-feedback" id="judgeFeedback"></div>
        </div>
    `;
    
    updateProgress('judge', current, total);
    const nextBtn = document.getElementById('judgeNextBtn');
    if (nextBtn) nextBtn.disabled = false;
}

// 初始化填空题
function initFillExercise() {
    const container = document.getElementById('fillContainer');
    if (!container) return;
    
    const current = currentExercises.fill;
    const total = exerciseData.fill.length;
    
    if (current >= total) {
        container.innerHTML = '<p class="completion-message">🎉 恭喜完成所有填空题！</p>';
        const submitBtn = document.querySelector('.exercise-submit[onclick="submitFillExercise()"]');
        if (submitBtn) submitBtn.style.display = 'block';
        return;
    }
    
    const question = exerciseData.fill[current];
    const questionWithBlank = question.question.replace('___', '<input type="text" class="fill-blank" id="fillAnswer" placeholder="请填入答案">');
    
    container.innerHTML = `
        <div class="question-container">
            <div class="question-header">
                <div class="question-number">第 ${current + 1} 题</div>
                <div class="question-type">${question.type}</div>
            </div>
            <div class="question-text">${questionWithBlank}</div>
            <div class="answer-feedback" id="fillFeedback"></div>
        </div>
    `;
    
    updateProgress('fill', current, total);
    const nextBtn = document.getElementById('fillNextBtn');
    if (nextBtn) nextBtn.disabled = false;
}

// 初始化翻译题
function initTranslateExercise() {
    const container = document.getElementById('translateContainer');
    if (!container) return;
    
    const current = currentExercises.translate;
    const total = exerciseData.translate.length;
    
    if (current >= total) {
        container.innerHTML = '<p class="completion-message">🎉 恭喜完成所有翻译题！</p>';
        const submitBtn = document.querySelector('.exercise-submit[onclick="submitTranslateExercise()"]');
        if (submitBtn) submitBtn.style.display = 'block';
        return;
    }
    
    const question = exerciseData.translate[current];
    container.innerHTML = `
        <div class="question-container">
            <div class="question-header">
                <div class="question-number">第 ${current + 1} 题</div>
                <div class="question-type">${question.type}</div>
            </div>
            <div class="chinese-text">${question.chinese}</div>
            <textarea class="translation-input" id="translateAnswer" placeholder="请输入琳凯蒂亚语翻译..."></textarea>
            <div class="answer-feedback" id="translateFeedback"></div>
        </div>
    `;
    
    updateProgress('translate', current, total);
    const nextBtn = document.getElementById('translateNextBtn');
    if (nextBtn) nextBtn.disabled = false;
}

// 初始化魔法练习
function initMagicExercise() {
    const container = document.getElementById('magicContainer');
    if (!container) return;
    
    const current = currentExercises.magic;
    const total = exerciseData.magic.length;
    
    if (current >= total) {
        container.innerHTML = '<p class="completion-message">🎉 恭喜完成所有魔法练习！</p>';
        const submitBtn = document.querySelector('.exercise-submit[onclick="submitMagicExercise()"]');
        if (submitBtn) submitBtn.style.display = 'block';
        return;
    }
    
    const question = exerciseData.magic[current];
    const questionWithBlank = question.question.replace('_____', '<input type="text" class="fill-blank" id="magicAnswer" placeholder="魔法词汇">');
    
    container.innerHTML = `
        <div class="question-container magic-question">
            <div class="question-header">
                <div class="question-number">第 ${current + 1} 题</div>
                <div class="question-type">${question.type}</div>
            </div>
            <div class="question-text">${questionWithBlank}</div>
            <div class="answer-feedback" id="magicFeedback"></div>
        </div>
    `;
    
    updateProgress('magic', current, total);
    const nextBtn = document.getElementById('magicNextBtn');
    if (nextBtn) nextBtn.disabled = false;
}
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
    }
    
    // 激活对应标签
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // 初始化对应练习
    if (type === 'choice') {
        initChoiceExercise();
    } else if (type === 'judge') {
        initJudgeExercise();
    } else if (type === 'fill') {
        initFillExercise();
    } else if (type === 'translate') {
        initTranslateExercise();
    } else if (type === 'magic') {
        initMagicExercise();
    }
    
    // 魔法切换特效
    createMagicTransition();
}

// 初始化选择题
function initChoiceExercise() {
    const container = document.getElementById('choiceContainer');
    if (!container) return;
    
    const current = currentExercises.choice;
    const total = exerciseData.choice.length;
    
    if (current >= total) {
        container.innerHTML = '<p class="completion-message">🎉 恭喜完成所有选择题！</p>';
        const submitBtn = document.querySelector('.exercise-submit[onclick="submitChoiceExercise()"]');
        if (submitBtn) submitBtn.style.display = 'block';
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
    
    updateProgress('choice', current, total);
    const nextBtn = document.getElementById('choiceNextBtn');
    if (nextBtn) nextBtn.disabled = false;
}

// 更新进度
function updateProgress(type, current, total) {
    const progressFill = document.getElementById(type + 'Progress');
    const progressText = document.getElementById(type + 'ProgressText');
    
    if (progressFill && progressText) {
        const percentage = (current / total) * 100;
        progressFill.style.width = percentage + '%';
        progressText.textContent = `${current}/${total}`;
    }
}

// 选择选项
function selectChoice(index) {
    document.getElementById(`choice${index}`).checked = true;
}

// 选择判断
function selectJudge(value) {
    const input = document.getElementById(value ? 'judgeTrue' : 'judgeFalse');
    if (input) input.checked = true;
}

// 下一题函数
function nextJudgeQuestion() {
    const selectedOption = document.querySelector('input[name="judge"]:checked');
    if (!selectedOption) {
        showWarning('请先选择一个答案！');
        return;
    }
    
    const current = currentExercises.judge;
    const question = exerciseData.judge[current];
    const isCorrect = (selectedOption.value === 'true') === question.correct;
    
    showFeedback('judge', isCorrect, question.explanation);
    
    if (isCorrect) {
        exerciseStats.correctAnswers++;
        exerciseStats.magicPoints += 10;
        createSuccessEffect(document.getElementById('judgeNextBtn'));
    } else {
        exerciseStats.magicPoints += 2;
        createRetryEffect(document.getElementById('judgeNextBtn'));
    }
    
    exerciseStats.totalAnswered++;
    currentExercises.judge++;
    
    setTimeout(() => {
        initJudgeExercise();
        const nextBtn = document.getElementById('judgeNextBtn');
        if (nextBtn) nextBtn.disabled = true;
    }, 2000);
}

function nextFillQuestion() {
    const answer = document.getElementById('fillAnswer');
    if (!answer || !answer.value.trim()) {
        showWarning('请先填入答案！');
        return;
    }
    
    const current = currentExercises.fill;
    const question = exerciseData.fill[current];
    const userAnswer = answer.value.trim().toLowerCase();
    const correctAnswer = question.answer.toLowerCase();
    const isCorrect = userAnswer === correctAnswer;
    
    showFeedback('fill', isCorrect, question.explanation, question.answer);
    
    if (isCorrect) {
        exerciseStats.correctAnswers++;
        exerciseStats.magicPoints += 15;
        createSuccessEffect(document.getElementById('fillNextBtn'));
    } else {
        exerciseStats.magicPoints += 3;
        createRetryEffect(document.getElementById('fillNextBtn'));
    }
    
    exerciseStats.totalAnswered++;
    currentExercises.fill++;
    
    setTimeout(() => {
        initFillExercise();
        const nextBtn = document.getElementById('fillNextBtn');
        if (nextBtn) nextBtn.disabled = true;
    }, 2000);
}

function nextTranslateQuestion() {
    const answer = document.getElementById('translateAnswer');
    if (!answer || !answer.value.trim()) {
        showWarning('请先输入翻译！');
        return;
    }
    
    const current = currentExercises.translate;
    const question = exerciseData.translate[current];
    const userAnswer = answer.value.trim();
    const correctAnswer = question.answer;
    
    // 使用相似度计算来判断翻译的正确性
    const similarity = calculateSimilarity(userAnswer.toLowerCase(), correctAnswer.toLowerCase());
    const isCorrect = similarity >= 0.7; // 70%相似度以上认为正确
    
    showFeedback('translate', isCorrect, question.explanation, correctAnswer);
    
    if (isCorrect) {
        exerciseStats.correctAnswers++;
        exerciseStats.magicPoints += 20;
        createSuccessEffect(document.getElementById('translateNextBtn'));
    } else {
        exerciseStats.magicPoints += 5;
        createRetryEffect(document.getElementById('translateNextBtn'));
    }
    
    exerciseStats.totalAnswered++;
    currentExercises.translate++;
    
    setTimeout(() => {
        initTranslateExercise();
        const nextBtn = document.getElementById('translateNextBtn');
        if (nextBtn) nextBtn.disabled = true;
    }, 2000);
}

function nextMagicQuestion() {
    const answer = document.getElementById('magicAnswer');
    if (!answer || !answer.value.trim()) {
        showWarning('请先填入魔法词汇！');
        return;
    }
    
    const current = currentExercises.magic;
    const question = exerciseData.magic[current];
    const userAnswer = answer.value.trim().toLowerCase();
    const correctAnswer = question.answer.toLowerCase();
    const isCorrect = userAnswer === correctAnswer;
    
    showFeedback('magic', isCorrect, question.explanation, question.answer);
    
    if (isCorrect) {
        exerciseStats.correctAnswers++;
        exerciseStats.magicPoints += 25;
        createSuccessEffect(document.getElementById('magicNextBtn'));
        // 特殊魔法特效
        createMagicCelebration();
    } else {
        exerciseStats.magicPoints += 5;
        createRetryEffect(document.getElementById('magicNextBtn'));
    }
    
    exerciseStats.totalAnswered++;
    currentExercises.magic++;
    
    setTimeout(() => {
        initMagicExercise();
        const nextBtn = document.getElementById('magicNextBtn');
        if (nextBtn) nextBtn.disabled = true;
    }, 2000);
}

// 提交练习按钮函数
function submitJudgeExercise() {
    showCompletionMessage('judge', '✅ 判断题练习完成！');
    createMagicCelebration();
}

function submitFillExercise() {
    showCompletionMessage('fill', '📝 填空题练习完成！');
    createMagicCelebration();
}

function submitTranslateExercise() {
    showCompletionMessage('translate', '🌍 翻译题练习完成！');
    createMagicCelebration();
}

function submitMagicExercise() {
    showCompletionMessage('magic', '🔮 魔法练习完成！');
    createMagicCelebration();
    // 特殊成就解锁
    unlockMagicAchievement();
}

// 魔法成就解锁
function unlockMagicAchievement() {
    const achievement = document.createElement('div');
    achievement.innerHTML = '🏆 获得成就：魔法大师！';
    achievement.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #ffd700, #ff6b6b);
        color: white;
        padding: 20px 30px;
        border-radius: 15px;
        font-size: 1.3rem;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 10px 30px rgba(255,215,0,0.5);
        animation: achievementPop 3s ease-out forwards;
    `;
    
    document.body.appendChild(achievement);
    
    setTimeout(() => {
        achievement.remove();
    }, 3000);
}

// 下一题函数
function nextChoiceQuestion() {
    const selectedOption = document.querySelector('input[name="choice"]:checked');
    if (!selectedOption) {
        showWarning('请先选择一个答案！');
        return;
    }
    
    const current = currentExercises.choice;
    const question = exerciseData.choice[current];
    const isCorrect = selectedOption.value === question.correct;
    
    showFeedback('choice', isCorrect, question.explanation);
    
    if (isCorrect) {
        exerciseStats.correctAnswers++;
        exerciseStats.magicPoints += 10;
        createSuccessEffect(document.getElementById('choiceNextBtn'));
    } else {
        exerciseStats.magicPoints += 2;
        createRetryEffect(document.getElementById('choiceNextBtn'));
    }
    
    exerciseStats.totalAnswered++;
    currentExercises.choice++;
    
    setTimeout(() => {
        initChoiceExercise();
        const nextBtn = document.getElementById('choiceNextBtn');
        if (nextBtn) nextBtn.disabled = true;
    }, 2000);
}

// 显示反馈
function showFeedback(type, isCorrect, explanation, correctAnswer = null) {
    const feedbackEl = document.getElementById(type + 'Feedback');
    if (!feedbackEl) return;
    
    const icon = isCorrect ? '🎉' : '💫';
    const title = isCorrect ? '恭喜答对了！' : '再试试看吧！';
    const className = isCorrect ? 'correct' : 'incorrect';
    
    let content = `
        <div class="feedback ${className}">
            <div class="feedback-icon">${icon}</div>
            <div class="feedback-content">
                <h4>${title}</h4>
                ${!isCorrect && correctAnswer ? `<p>正确答案是：${correctAnswer}</p>` : ''}
                <p>${explanation}</p>
            </div>
        </div>
    `;
    
    feedbackEl.innerHTML = content;
}

// 提交练习按钮函数
function submitChoiceExercise() {
    showCompletionMessage('choice', '🎯 选择题练习完成！');
    createMagicCelebration();
}

// 显示完成消息
function showCompletionMessage(type, message) {
    const container = document.getElementById(type + 'Container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="completion-celebration">
            <h3>${message}</h3>
            <p>你已完成所有${type === 'choice' ? '选择' : type === 'judge' ? '判断' : type === 'fill' ? '填空' : type === 'translate' ? '翻译' : '魔法'}题练习！</p>
            <div class="celebration-effects">🌟✨🎉💫🔮</div>
        </div>
    `;
    
    // 显示统计信息
    updateExerciseStats();
}

// 更新练习统计
function updateExerciseStats() {
    const totalQuestions = Object.values(exerciseData).reduce((sum, category) => sum + category.length, 0);
    const completedQuestions = Object.values(currentExercises).reduce((sum, current) => sum + current, 0);
    const accuracy = exerciseStats.totalAnswered > 0 
        ? Math.round((exerciseStats.correctAnswers / exerciseStats.totalAnswered) * 100)
        : 0;
    
    // 确定魔法等级
    let magicLevel = '初学者';
    if (exerciseStats.magicPoints >= 500) magicLevel = '大魔法师';
    else if (exerciseStats.magicPoints >= 300) magicLevel = '魔法师';
    else if (exerciseStats.magicPoints >= 150) magicLevel = '魔法学徒';
    else if (exerciseStats.magicPoints >= 50) magicLevel = '见习魔法师';
    
    // 显示统计信息
    const statsSection = document.getElementById('exerciseStats');
    if (statsSection) {
        const totalScoreEl = document.getElementById('totalScore');
        const accuracyEl = document.getElementById('accuracy');
        const completedEl = document.getElementById('completedExercises');
        const magicLevelEl = document.getElementById('magicLevel');
        
        if (totalScoreEl) totalScoreEl.textContent = exerciseStats.magicPoints;
        if (accuracyEl) accuracyEl.textContent = accuracy + '%';
        if (completedEl) completedEl.textContent = `${completedQuestions}/${totalQuestions}`;
        if (magicLevelEl) magicLevelEl.textContent = magicLevel;
        
        statsSection.style.display = 'block';
    }
}

// 重新开始所有练习
function restartAllExercises() {
    if (!confirm('确定要重新开始所有练习吗？这将清除当前进度。')) {
        return;
    }
    
    // 重置所有状态
    currentExercises = { choice: 0, judge: 0, fill: 0, translate: 0, magic: 0 };
    exerciseStats = { totalAnswered: 0, correctAnswers: 0, magicPoints: 0, completedSections: new Set() };
    
    // 隐藏统计信息
    const statsSection = document.getElementById('exerciseStats');
    if (statsSection) {
        statsSection.style.display = 'none';
    }
    
    // 重新初始化当前练习
    const activeTab = document.querySelector('.exercise-tab-btn.active');
    if (activeTab) {
        const type = activeTab.textContent.includes('选择') ? 'choice' :
                    activeTab.textContent.includes('判断') ? 'judge' :
                    activeTab.textContent.includes('填空') ? 'fill' :
                    activeTab.textContent.includes('翻译') ? 'translate' : 'magic';
        showExerciseType(type);
    }
    
    createMagicTransition();
}

// 查看错题
function showExerciseReview() {
    alert('错题回顾功能正在开发中，敬请期待！');
}

// 初始化页面时启动选择题
document.addEventListener('DOMContentLoaded', function() {
    // 默认显示选择题
    initChoiceExercise();
});

// 创建魔法切换特效
function createMagicTransition() {
    const sparkles = document.createElement('div');
    sparkles.className = 'magic-sparkles';
    sparkles.innerHTML = '✨'.repeat(10);
    sparkles.style.position = 'fixed';
    sparkles.style.top = '50%';
    sparkles.style.left = '50%';
    sparkles.style.transform = 'translate(-50%, -50%)';
    sparkles.style.fontSize = '30px';
    sparkles.style.animation = 'sparkleRotate 1s ease-out';
    sparkles.style.pointerEvents = 'none';
    sparkles.style.zIndex = '1000';
    
    document.body.appendChild(sparkles);
    
    setTimeout(() => {
        sparkles.remove();
    }, 1000);
}

// 正确答案魔法特效
function createSuccessEffect(button) {
    if (!button) return;
    
    // 创建彩虹爆炸特效
    const explosion = document.createElement('div');
    explosion.className = 'rainbow-explosion';
    explosion.innerHTML = '🌈✨💫⭐🎉'.repeat(5);
    
    const rect = button.getBoundingClientRect();
    explosion.style.position = 'fixed';
    explosion.style.left = rect.left + rect.width / 2 + 'px';
    explosion.style.top = rect.top + rect.height / 2 + 'px';
    explosion.style.transform = 'translate(-50%, -50%)';
    explosion.style.fontSize = '24px';
    explosion.style.animation = 'magicExplode 2s ease-out forwards';
    explosion.style.pointerEvents = 'none';
    explosion.style.zIndex = '1000';
    
    document.body.appendChild(explosion);
    
    // 按钮闪光效果
    button.style.animation = 'successGlow 1s ease-in-out';
    
    setTimeout(() => {
        explosion.remove();
        button.style.animation = '';
    }, 2000);
}

// 重试魔法特效
function createRetryEffect(button) {
    if (!button) return;
    
    const shimmer = document.createElement('div');
    shimmer.className = 'retry-shimmer';
    shimmer.innerHTML = '💫🔮✨';
    
    const rect = button.getBoundingClientRect();
    shimmer.style.position = 'fixed';
    shimmer.style.left = rect.left + rect.width / 2 + 'px';
    shimmer.style.top = rect.top - 20 + 'px';
    shimmer.style.transform = 'translateX(-50%)';
    shimmer.style.fontSize = '20px';
    shimmer.style.animation = 'floatUp 1.5s ease-out forwards';
    shimmer.style.pointerEvents = 'none';
    shimmer.style.zIndex = '1000';
    
    document.body.appendChild(shimmer);
    
    // 按钮闪烁效果
    button.style.animation = 'retryPulse 0.8s ease-in-out';
    
    setTimeout(() => {
        shimmer.remove();
        button.style.animation = '';
    }, 1500);
}

// 创建魔法庆祝特效
function createMagicCelebration() {
    const celebration = document.createElement('div');
    celebration.innerHTML = '🌟🎆🌈✨💫🔮⭐🎊🎉🌙';
    celebration.style.position = 'fixed';
    celebration.style.top = '20px';
    celebration.style.left = '50%';
    celebration.style.transform = 'translateX(-50%)';
    celebration.style.fontSize = '40px';
    celebration.style.animation = 'celebrationBounce 3s ease-out forwards';
    celebration.style.pointerEvents = 'none';
    celebration.style.zIndex = '1000';
    
    document.body.appendChild(celebration);
    
    setTimeout(() => {
        celebration.remove();
    }, 3000);
}

// 显示警告
function showWarning(message) {
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
}

// 计算字符串相似度（用于翻译题评分）
function calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) {
        return 1.0;
    }
    
    const distance = levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
}

// 计算编辑距离
function levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    
    return matrix[str2.length][str1.length];
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes magicExplode {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
        50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0.8; }
        100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
    }
    
    @keyframes successGlow {
        0%, 100% { box-shadow: 0 0 5px rgba(0,255,0,0.3); }
        50% { box-shadow: 0 0 20px rgba(0,255,0,0.8), 0 0 30px rgba(0,255,0,0.6); }
    }
    
    @keyframes retryPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    @keyframes floatUp {
        0% { transform: translateX(-50%) translateY(0); opacity: 1; }
        100% { transform: translateX(-50%) translateY(-50px); opacity: 0; }
    }
    
    @keyframes sparkleRotate {
        0% { transform: translate(-50%, -50%) rotate(0deg) scale(0); opacity: 0; }
        50% { transform: translate(-50%, -50%) rotate(180deg) scale(1.5); opacity: 1; }
        100% { transform: translate(-50%, -50%) rotate(360deg) scale(0); opacity: 0; }
    }
    
    @keyframes celebrationBounce {
        0% { transform: translateX(-50%) translateY(-20px) scale(0); opacity: 0; }
        20% { transform: translateX(-50%) translateY(0) scale(1.2); opacity: 1; }
        40% { transform: translateX(-50%) translateY(-10px) scale(1); opacity: 1; }
        60% { transform: translateX(-50%) translateY(0) scale(1.1); opacity: 1; }
        80% { transform: translateX(-50%) translateY(-5px) scale(1); opacity: 1; }
        100% { transform: translateX(-50%) translateY(20px) scale(.8); opacity: 0; }
    }
    
    @keyframes achievementPop {
        0% { transform: translate(-50%, -50%) scale(0) rotate(-10deg); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.1) rotate(5deg); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 0; }
    }
    
    .completion-message {
        text-align: center;
        font-size: 1.2rem;
        color: #667eea;
        padding: 40px 20px;
        background: linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1));
        border-radius: 15px;
        border: 2px solid rgba(102,126,234,0.3);
        margin: 20px 0;
    }
    
    .completion-celebration {
        text-align: center;
        padding: 40px 20px;
        background: linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,193,7,0.1));
        border: 2px solid #ffc107;
        border-radius: 15px;
        margin: 20px 0;
    }
    
    .completion-celebration h3 {
        color: #f57c00;
        margin-bottom: 15px;
        font-size: 1.5rem;
    }
    
    .celebration-effects {
        font-size: 2rem;
        margin-top: 20px;
        animation: sparkleRotate 2s infinite;
    }
    
    .magic-question {
        background: linear-gradient(135deg, rgba(138,43,226,0.1), rgba(75,0,130,0.1));
        border-left-color: #8a2be2;
    }
`;
document.head.appendChild(style);
// AI翻译功能模块 - 琳凯蒂亚语社区
// DeepSeek API集成版本

// =================  AI翻译功能 ================

// DeepSeek API配置
const DEEPSEEK_CONFIG = {
    API_KEY: 'sk-3ffe1e44a745483396428932cb0a4f81',
    BASE_URL: 'https://api.deepseek.com/v1/chat/completions',
    MODELS: {
        CHAT: 'deepseek-chat',
        REASONER: 'deepseek-reasoner'
    }
};

// 初始化AI翻译功能
function initAITranslation() {
    console.log('🤖 初始化AI翻译功能...');
    
    const input = document.getElementById('aiTranslationInput');
    const charCount = document.getElementById('charCount');
    const translateBtn = document.getElementById('translateBtn');
    const balanceElement = document.getElementById('userBalance');
    
    if (!input || !charCount || !translateBtn) {
        console.warn('⚠️ AI翻译组件初始化失败：缺少必要元素');
        return;
    }
    
    // 初始化用户余额
    initUserBalance();
    
    // 输入框字符计数
    input.addEventListener('input', function() {
        const length = this.value.length;
        charCount.textContent = length;
        
        // 尝试获取按钮，如果不存在则跳过
        const button = document.getElementById('translateBtn');
        if (button) {
            button.disabled = length === 0 || length > 100;
        }
        
        // 字符数提示颜色
        if (length > 90) {
            charCount.style.color = '#ff6b6b';
        } else if (length > 70) {
            charCount.style.color = '#ffa500';
        } else {
            charCount.style.color = '#4ecdc4';
        }
    });
    
    // 翻译按钮点击事件
    translateBtn.addEventListener('click', handleAITranslation);
    
    console.log('✅ AI翻译功能初始化完成');
}

// 初始化用户余额
function initUserBalance() {
    const storedBalance = localStorage.getItem('userTranslationBalance');
    const balance = storedBalance ? parseFloat(storedBalance) : 10.00; // 默认给新用户10元
    
    updateBalanceDisplay(balance);
    
    // 如果是新用户，保存默认余额
    if (!storedBalance) {
        localStorage.setItem('userTranslationBalance', balance.toString());
    }
}

// 更新余额显示
function updateBalanceDisplay(balance) {
    const balanceElement = document.getElementById('userBalance');
    if (balanceElement) {
        balanceElement.textContent = balance.toFixed(2);
    }
}

// 获取当前时间应使用的模型
function getCurrentModel() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    // 0:30-8:30 使用 deepseek-reasoner，其他时间使用 deepseek-chat
    const isReasonerTime = (hour === 0 && minute >= 30) || (hour >= 1 && hour < 8) || (hour === 8 && minute <= 30);
    
    return {
        model: isReasonerTime ? 'deepseek-reasoner' : 'deepseek-chat',
        timeRange: isReasonerTime ? '0:30-8:30 高精度模式' : '常规时段'
    };
}

// 处理AI翻译请求
async function handleAITranslation() {
    const input = document.getElementById('aiTranslationInput');
    const resultDiv = document.getElementById('aiTranslationResult');
    const outputDiv = document.getElementById('translationOutput');
    const modelBadge = document.getElementById('usedModel');
    const translateBtn = document.getElementById('translateBtn');
    
    if (!input || !resultDiv || !outputDiv) {
        console.error('翻译组件未找到');
        return;
    }
    
    const text = input.value.trim();
    if (!text) {
        showAINotification('请输入要翻译的文本', 'warning');
        return;
    }
    
    if (text.length > 100) {
        showAINotification('输入文本超过100字符限制', 'error');
        return;
    }
    
    // 检查余额
    const currentBalance = parseFloat(localStorage.getItem('userTranslationBalance') || '0');
    if (currentBalance < 0.1) {
        showAINotification('余额不足，请充值后使用', 'error');
        return;
    }
    
    // 检查用户登录状态
    const currentUser = getCurrentUserForAI();
    if (!currentUser) {
        showAINotification('请先登录后使用AI翻译功能', 'warning');
        return;
    }
    
    // 获取翻译方向
    const direction = document.querySelector('input[name="direction"]:checked').value;
    const modelInfo = getCurrentModel();
    
    // 禁用按钮，显示加载状态
    translateBtn.disabled = true;
    translateBtn.innerHTML = '🔄 翻译中...';
    
    try {
        // 调用DeepSeek API进行真实翻译
        const result = await performAITranslation(text, direction, modelInfo.model);
        
        // 扣除费用
        const newBalance = currentBalance - 0.1;
        localStorage.setItem('userTranslationBalance', newBalance.toString());
        updateBalanceDisplay(newBalance);
        
        // 显示结果
        outputDiv.innerHTML = result.translation;
        modelBadge.textContent = modelInfo.model;
        modelBadge.title = `使用模型: ${modelInfo.model} (${modelInfo.timeRange})`;
        
        resultDiv.style.display = 'block';
        
        // 保存翻译历史
        saveTranslationHistory({
            original: text,
            translation: result.translation,
            direction: direction,
            model: modelInfo.model,
            timestamp: Date.now(),
            userId: currentUser.id
        });
        
        showAINotification('翻译完成！已扣费0.1元', 'success');
        
    } catch (error) {
        console.error('翻译错误:', error);
        showAINotification('翻译失败，请稍后再试', 'error');
        resultDiv.style.display = 'none';
    } finally {
        // 恢复按钮状态
        translateBtn.disabled = false;
        translateBtn.innerHTML = '✨ 开始翻译 (0.1元/次)';
    }
}

// 调用DeepSeek API进行真实翻译
async function callDeepSeekAPI(text, direction, model) {
    const systemPrompt = createSystemPrompt(direction);
    const userPrompt = createUserPrompt(text, direction);
    
    const requestBody = {
        model: model,
        messages: [
            {
                role: "system",
                content: systemPrompt
            },
            {
                role: "user", 
                content: userPrompt
            }
        ],
        temperature: 0.7,
        max_tokens: 200,
        stream: false
    };
    
    try {
        const response = await fetch(DEEPSEEK_CONFIG.BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_CONFIG.API_KEY}`
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.choices && data.choices.length > 0) {
            const translation = data.choices[0].message.content.trim();
            return {
                translation: translation,
                model: model,
                confidence: 0.95,
                usage: data.usage
            };
        } else {
            throw new Error('API返回数据格式异常');
        }
    } catch (error) {
        console.error('DeepSeek API调用失败:', error);
        // 如果API调用失败，回退到本地模拟翻译
        return await fallbackTranslation(text, direction, model);
    }
}

// 创建系统提示词
function createSystemPrompt(direction) {
    if (direction === 'zh-to-rincatian') {
        return `你是一个专业的琳凯蒂亚语翻译专家。琳凯蒂亚语是一种虚构的奇幻语言，具有以下特点：

语法规则：
1. 基本语序：主语+宾语+谓语 (SOV)
2. 助词系统：主语用'ō，宾语用'xa，地点用'poroŋ
3. 体态词尾：-e(一般主动)，-ê(进行式)，-ezi(过去式)，-ge(计划式)
4. 句子结尾：陈述句用yo，疑问句用ka

词汇特点：
- Wi(我)，Qavi(你)，Kare(他)，Win(我们)，Qavitachi(你们)
- beleli(美丽)，suleko(好)，arigaze(谢谢)，madara(再见)
- libo(书)，soseo(学习)，miru(看)

请将中文准确翻译成琳凯蒂亚语，保持语法正确和文化适应性。`;
    } else {
        return `你是一个专业的琳凯蒂亚语翻译专家。请将琳凯蒂亚语准确翻译成中文，注意：

1. 理解琳凯蒂亚语的SOV语序
2. 正确解析助词和词尾的含义
3. 保持翻译的自然性和准确性
4. 体现奇幻语言的魔法色彩

直接输出中文翻译结果，不需要解释。`;
    }
}

// 创建用户提示词
function createUserPrompt(text, direction) {
    if (direction === 'zh-to-rincatian') {
        return `请将以下中文翻译成琳凯蒂亚语："${text}"`;
    } else {
        return `请将以下琳凯蒂亚语翻译成中文："${text}"`;
    }
}

// 备用翻译函数（API失败时使用）
async function fallbackTranslation(text, direction, model) {
    console.log('使用备用翻译模式');
    
    // 备用翻译词典
    const translations = {
        'zh-to-rincatian': {
            '今天的天气很好': "Zanava'xa quen'va beleli yo.",
            '我爱你': "Wi qavi'ō belaze yo.",
            '谢谢': "Arigaze yo.",
            '你好': "Qavi suleko yo.",
            '再见': "Madara yo.",
            '我在学习琳凯蒂亚语': "Wi Rincatiana'ō soseo yo.",
            '这本书很有趣': "Ko libo'va tsumali yo.",
            '愿光芒照亮你的道路': "Sil qavi'xa michi'ō terasu yo.",
            '月亮很美丽': "Luna'va beleli yo.",
            '我们是朋友': "Win'ō tomodachi yo."
        },
        'rincatian-to-zh': {
            "Wi'ō libo'ō midê yo.": '我在看书。',
            "Qavi suleko yo.": '你好。',
            "Zanava'xa quen'va beleli yo.": '今天的天气很好。',
            "Arigaze yo.": '谢谢。',
            "Madara yo.": '再见。',
            "Wi Rincatiana'ō soseo yo.": '我在学习琳凯蒂亚语。',
            "Ko libo'va tsumali yo.": '这本书很有趣。',
            "Luna'va beleli yo.": '月亮很美丽。',
            "Win'ō tomodachi yo.": '我们是朋友。'
        }
    };
    
    const translationMap = translations[direction] || {};
    let result = translationMap[text];
    
    if (!result) {
        result = `[备用翻译] ${text} → ${direction === 'zh-to-rincatian' ? '琳凯蒂亚语' : '中文'}`;
    }
    
    return {
        translation: result,
        model: model + '(备用)',
        confidence: 0.75
    };
}

// 主翻译函数（替换原来的simulateAITranslation）
async function performAITranslation(text, direction, model) {
    try {
        // 首先尝试调用DeepSeek API
        return await callDeepSeekAPI(text, direction, model);
    } catch (error) {
        console.error('AI翻译失败，使用备用方案:', error);
        // 如果API调用失败，使用备用翻译
        return await fallbackTranslation(text, direction, model);
    }
}

// 保存翻译历史
function saveTranslationHistory(translation) {
    const history = JSON.parse(localStorage.getItem('translationHistory') || '[]');
    history.unshift(translation); // 最新的在前面
    
    // 只保存最近100条记录
    if (history.length > 100) {
        history.splice(100);
    }
    
    localStorage.setItem('translationHistory', JSON.stringify(history));
}

// 复制翻译结果
function copyTranslation() {
    const output = document.getElementById('translationOutput');
    if (output && output.textContent) {
        navigator.clipboard.writeText(output.textContent).then(() => {
            showAINotification('翻译结果已复制到剪贴板', 'success');
        }).catch(() => {
            showAINotification('复制失败', 'error');
        });
    }
}

// 分享翻译结果
function shareTranslation() {
    const input = document.getElementById('aiTranslationInput');
    const output = document.getElementById('translationOutput');
    
    if (input && output && input.value && output.textContent) {
        const shareText = `翻译分享：\n原文：${input.value}\n译文：${output.textContent}\n\n来自琳凯蒂亚语社区`;
        
        if (navigator.share) {
            navigator.share({
                title: '翻译分享',
                text: shareText
            });
        } else {
            // fallback: 复制到剪贴板
            navigator.clipboard.writeText(shareText).then(() => {
                showAINotification('分享内容已复制到剪贴板', 'success');
            });
        }
    }
}

// 获取当前用户
function getCurrentUserForAI() {
    return (window.authSystem && window.authSystem.currentUser) || 
           (window.communitySystem && window.communitySystem.currentUser) ||
           JSON.parse(localStorage.getItem('currentUser') || 'null');
}

// AI翻译专用通知函数
function showAINotification(message, type = 'info') {
    // 如果存在全局通知函数，使用它
    if (typeof showNotification === 'function') {
        showNotification(message, type);
        return;
    }
    
    // 否则创建简单的通知
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : type === 'warning' ? '#ff9800' : '#2196f3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        font-size: 0.9rem;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// 获取翻译历史记录
function getTranslationHistory(userId = null) {
    const history = JSON.parse(localStorage.getItem('translationHistory') || '[]');
    
    if (userId) {
        return history.filter(item => item.userId === userId);
    }
    
    return history;
}

// 清空翻译历史
function clearTranslationHistory() {
    localStorage.removeItem('translationHistory');
    showAINotification('翻译历史已清空', 'success');
}

// 充值余额（模拟功能）
function rechargeBalance(amount) {
    const currentBalance = parseFloat(localStorage.getItem('userTranslationBalance') || '0');
    const newBalance = currentBalance + amount;
    localStorage.setItem('userTranslationBalance', newBalance.toString());
    updateBalanceDisplay(newBalance);
    showAINotification(`充值成功！余额增加 ${amount} 元`, 'success');
}

// 导出AI翻译功能到全局
window.AITranslation = {
    init: initAITranslation,
    translate: handleAITranslation,
    copyResult: copyTranslation,
    shareResult: shareTranslation,
    getHistory: getTranslationHistory,
    clearHistory: clearTranslationHistory,
    recharge: rechargeBalance,
    getCurrentModel: getCurrentModel
};

console.log('🤖 AI翻译模块已加载！');
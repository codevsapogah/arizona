// RIASEC Test Data and Logic

// Test Questions
const questions = [
    {
        id: 1,
        text: "1. Что я предпочитаю делать руками?",
        options: [
            { value: 'a', text: 'Чинить сломанное оборудование', type: 'R' },
            { value: 'b', text: 'Выращивать цветы или ухаживать за животными', type: 'I' },
            { value: 'c', text: 'Учить людей новым навыкам', type: 'S' },
            { value: 'd', text: 'Писать статьи или разрабатывать программы', type: 'C' },
            { value: 'e', text: 'Рисовать, сочинять музыку или дизайн', type: 'A' },
            { value: 'f', text: 'Вести переговоры и убеждать людей', type: 'E' }
        ]
    },
    {
        id: 2,
        text: "2. В каком коллективе мне комфортнее?",
        options: [
            { value: 'a', text: 'В небольшой команде, занятой физической работой', type: 'R' },
            { value: 'b', text: 'В одиночку или с небольшой группой, проводящей исследования', type: 'I' },
            { value: 'c', text: 'В большой команде, работающей над общей целью', type: 'S' },
            { value: 'd', text: 'В команде, где нужно анализировать данные', type: 'C' },
            { value: 'e', text: 'В среде, где ценят творческую свободу', type: 'A' },
            { value: 'f', text: 'В команде, где я могу руководить и мотивировать', type: 'E' }
        ]
    },
    {
        id: 3,
        text: "3. Что я ценю в работе?",
        options: [
            { value: 'a', text: 'Предсказуемость и четкие инструкции', type: 'R' },
            { value: 'b', text: 'Возможность постоянно учиться и исследовать', type: 'I' },
            { value: 'c', text: 'Помощь другим людям и обществу', type: 'S' },
            { value: 'd', text: 'Возможность систематизировать и вести учет', type: 'C' },
            { value: 'e', text: 'Возможность выражать свои идеи без ограничений', type: 'A' },
            { value: 'f', text: 'Власть, статус и финансовую успешность', type: 'E' }
        ]
    },
    {
        id: 4,
        text: "4. Какой предмет мне давался лучше всего в школе?",
        options: [
            { value: 'a', text: 'Физкультура, технология, труд', type: 'R' },
            { value: 'b', text: 'Химия, физика, биология, информатика', type: 'I' },
            { value: 'c', text: 'История, обществознание, литература', type: 'S' },
            { value: 'd', text: 'Математика, черчение, иностранные языки', type: 'C' },
            { value: 'e', text: 'ИЗО, музыка, театр', type: 'A' },
            { value: 'f', text: 'Экономика, право, география', type: 'E' }
        ]
    },
    {
        id: 5,
        text: "5. Мое любимое хобби",
        options: [
            { value: 'a', text: 'Заниматься спортом, водить машину, работать с инструментами', type: 'R' },
            { value: 'b', text: 'Читать научные книги, решать головоломки', type: 'I' },
            { value: 'c', text: 'Быть волонтером, организовывать праздники для друзей', type: 'S' },
            { value: 'd', text: 'Составлять бюджет, играть в шахматы', type: 'C' },
            { value: 'e', text: 'Фотографировать, писать стихи', type: 'A' },
            { value: 'f', text: 'Продавать что-то, спорить', type: 'E' }
        ]
    },
    {
        id: 6,
        text: "6. Мое основное качество",
        options: [
            { value: 'a', text: 'Практичность и выносливость', type: 'R' },
            { value: 'b', text: 'Любознательность и аналитический ум', type: 'I' },
            { value: 'c', text: 'Эмпатия и общительность', type: 'S' },
            { value: 'd', text: 'Точность и организованность', type: 'C' },
            { value: 'e', text: 'Воображение и оригинальность', type: 'A' },
            { value: 'f', text: 'Уверенность и амбициозность', type: 'E' }
        ]
    },
    {
        id: 7,
        text: "7. Какую проблему я выберу для решения?",
        options: [
            { value: 'a', text: 'Как улучшить производительность машины', type: 'R' },
            { value: 'b', text: 'Почему происходит то или иное явление', type: 'I' },
            { value: 'c', text: 'Как помочь человеку в трудной ситуации', type: 'S' },
            { value: 'd', text: 'Как упорядочить большой массив данных', type: 'C' },
            { value: 'e', text: 'Как создать красивый и необычный предмет', type: 'A' },
            { value: 'f', text: 'Как убедить группу людей принять мое решение', type: 'E' }
        ]
    },
    {
        id: 8,
        text: "8. Какое описание профессии меня привлекает?",
        options: [
            { value: 'a', text: 'Специалист, работающий на открытом воздухе или с техникой', type: 'R' },
            { value: 'b', text: 'Ученый или исследователь в лаборатории', type: 'I' },
            { value: 'c', text: 'Учитель, врач или социальный работник', type: 'S' },
            { value: 'd', text: 'Бухгалтер, аудитор или специалист по документообороту', type: 'C' },
            { value: 'e', text: 'Дизайнер, актер или писатель', type: 'A' },
            { value: 'f', text: 'Менеджер, политик или предприниматель', type: 'E' }
        ]
    },
    {
        id: 9,
        text: "9. Что для меня важнее в рабочем месте?",
        options: [
            { value: 'a', text: 'Физическая активность и возможность видеть результаты', type: 'R' },
            { value: 'b', text: 'Тишина, возможность сосредоточиться', type: 'I' },
            { value: 'c', text: 'Активное взаимодействие с людьми', type: 'S' },
            { value: 'd', text: 'Структура, порядок, архивы и документация', type: 'C' },
            { value: 'e', text: 'Свободный график и необычный интерьер', type: 'A' },
            { value: 'f', text: 'Возможность принимать решения и нести ответственность', type: 'E' }
        ]
    },
    {
        id: 10,
        text: "10. Кем я себя вижу через 10 лет?",
        options: [
            { value: 'a', text: 'Профессионалом с золотыми руками', type: 'R' },
            { value: 'b', text: 'Признанным экспертом в узкой области', type: 'I' },
            { value: 'c', text: 'Наставником или лидером общественной организации', type: 'S' },
            { value: 'd', text: 'Главным специалистом по контролю или отчетности', type: 'C' },
            { value: 'e', text: 'Создателем известного произведения или бренда', type: 'A' },
            { value: 'f', text: 'Владельцем или директором собственной компании', type: 'E' }
        ]
    },
    {
        id: 11,
        text: "11. Профильные предметы",
        multiple: true,
        options: [
            { value: 'a', text: 'Физика – Математика' },
            { value: 'b', text: 'Химия – Биология' },
            { value: 'c', text: 'География – Математика' },
            { value: 'd', text: 'Информатика – Математика' },
            { value: 'e', text: 'Иностранный язык – Всемирная история' },
            { value: 'f', text: 'География – Иностранный язык' },
            { value: 'g', text: 'Всемирная история – География' },
            { value: 'h', text: 'Казахский язык – Казахская литература' },
            { value: 'i', text: 'Русский язык – Русская литература' },
            { value: 'j', text: 'Творческий экзамен' },
            { value: 'k', text: 'Биология – География' },
            { value: 'l', text: 'Химия – Физика' },
            { value: 'm', text: 'Всемирная история – Основы права' }
        ]
    }
];

// Majors by type
const majorsByType = {
    R: [
        "Инженер-строитель",
        "Архитектор-проектировщик",
        "Механик/автомеханик",
        "Инженер по IT-инфраструктуре",
        "Технолог на производстве"
    ],
    I: [
        "Программист / Software Engineer",
        "Data Analyst / Data Scientist",
        "Биотехнолог",
        "Инженер-химик",
        "Исследователь в лаборатории"
    ],
    A: [
        "Графический дизайнер",
        "UI/UX-дизайнер",
        "Маркетолог/бренд-менеджер",
        "Журналист, копирайтер",
        "Видеооператор / режиссёр монтажа"
    ],
    S: [
        "Учитель (школа, колледж)",
        "Психолог",
        "Врач / медсестра",
        "Социальный педагог",
        "Коуч/тренер"
    ],
    E: [
        "Предприниматель",
        "Менеджер по продажам",
        "Product/Project Manager",
        "Маркетолог по продвижению",
        "Менеджер по работе с клиентами"
    ],
    C: [
        "Бухгалтер",
        "Финансовый аналитик",
        "Экономист",
        "Специалист по документообороту",
        "Офис-менеджер / администратор"
    ]
};

// Majors by combination
const majorsByCombo = {
    "AS": ["Маркетолог/креативщик", "SMM-специалист", "Журналист, ведущий", "Психолог", "Организатор мероприятий"],
    "SE": ["Продюсер образовательных проектов", "HR-менеджер", "Руководитель учебного центра", "Менеджер по продажам"],
    "RC": ["Инженер-проектировщик", "Логист", "Инженер по качеству", "Системный администратор"],
    "IC": ["Финансовый аналитик", "Data Analyst", "Бизнес-аналитик", "Back-end разработчик"],
    "AI": ["Архитектор", "UI/UX + аналитика продукта", "Креатив в IT"]
};

// Type descriptions
const typeDescriptions = {
    R: "Реалистичный",
    I: "Исследовательский",
    A: "Артистичный",
    S: "Социальный",
    E: "Предпринимательский",
    C: "Системный"
};

// Full descriptions
const fullDescriptions = {
    R: "Вы практичны и любите работать руками. Вам нравится создавать реальные вещи и видеть результат своей работы.",
    I: "Вы аналитичны и любознательны. Вам нравится исследовать, анализировать и понимать, как всё работает.",
    A: "Вы креативны и оригинальны. Вам нравится создавать что-то новое и выражать свои идеи.",
    S: "Вы эмпатичны и общительны. Вам нравится помогать людям и работать в команде.",
    E: "Вы амбициозны и уверены в себе. Вам нравится руководить, убеждать и достигать целей.",
    C: "Вы организованны и внимательны к деталям. Вам нравится систематизировать информацию и работать с данными."
};

// ENT profiles matching RIASEC types
const entProfilesByType = {
    R: ['a', 'd', 'l'],  // Физика-Математика, Информатика-Математика, Химия-Физика
    I: ['b', 'd', 'l'],  // Химия-Биология, Информатика-Математика, Химия-Физика
    A: ['j', 'e', 'h', 'i'],  // Творческий экзамен, Иностранный язык-Всемирная история, Казахский/Русский язык
    S: ['k', 'g', 'b'],  // Биология-География, Всемирная история-География, Химия-Биология
    E: ['f', 'm', 'e'],  // География-Иностранный язык, Всемирная история-Основы права
    C: ['c', 'd', 'a']   // Математика-География, Информатика-Математика, Физика-Математика
};

// Global state
let studentInfo = {};
let currentQuestionIndex = 0;
let answers = {};

// Function to start test after form submission (called from amoCRM callback)
window.startTestAfterForm = function() {
    showSection('test-section');
    renderQuestion();
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Set student info
    studentInfo = {
        fullName: 'Студент',
        studentPhone: '',
        parentName: '',
        parentPhone: '',
        grade: '',
        date: new Date().toLocaleDateString('ru-RU')
    };

    // Start test directly
    showSection('test-section');
    renderQuestion();

    // Test navigation
    document.getElementById('nextBtn').addEventListener('click', nextQuestion);
    document.getElementById('prevBtn').addEventListener('click', prevQuestion);
    document.getElementById('testForm').addEventListener('submit', submitTest);

    // PDF download
    document.getElementById('downloadPdfBtn').addEventListener('click', generatePDF);

    document.getElementById('totalQuestions').textContent = questions.length;
});

function formatPhone(e) {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length > 0) {
        if (value[0] === '8') {
            value = '7' + value.substring(1);
        } else if (value[0] !== '7') {
            value = '7' + value;
        }
    }

    let formatted = '+7';
    if (value.length > 1) {
        formatted += ' (' + value.substring(1, 4);
    }
    if (value.length >= 5) {
        formatted += ') ' + value.substring(4, 7);
    }
    if (value.length >= 8) {
        formatted += '-' + value.substring(7, 9);
    }
    if (value.length >= 10) {
        formatted += '-' + value.substring(9, 11);
    }

    e.target.value = formatted;
}

function showSection(sectionId) {
    // Force scroll to top FIRST
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Switch sections
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');

    // Scroll again after a tiny delay to be sure
    requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    });
}

function renderQuestion() {
    const question = questions[currentQuestionIndex];
    const container = document.getElementById('questionsContainer');

    const inputType = question.multiple ? 'checkbox' : 'radio';
    const inputName = `q${question.id}`;

    let html = `
        <div class="question-card">
            <h3 class="question-title">${question.text}</h3>
            <div class="options">
    `;

    question.options.forEach(option => {
        const checked = answers[question.id] &&
            (question.multiple ? answers[question.id].includes(option.value) : answers[question.id] === option.value);

        html += `
            <div class="option ${checked ? 'selected' : ''}" onclick="selectOption(this, ${question.id}, '${option.value}', ${question.multiple || false})">
                <input type="${inputType}"
                       name="${inputName}"
                       value="${option.value}"
                       ${checked ? 'checked' : ''}>
                <label>${option.text}</label>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    container.innerHTML = html;

    updateProgress();
    updateButtons();
}

function selectOption(element, questionId, value, isMultiple) {
    if (isMultiple) {
        if (!answers[questionId]) answers[questionId] = [];

        const input = element.querySelector('input');
        const index = answers[questionId].indexOf(value);

        if (index > -1) {
            answers[questionId].splice(index, 1);
            element.classList.remove('selected');
            input.checked = false;
        } else {
            answers[questionId].push(value);
            element.classList.add('selected');
            input.checked = true;
        }
    } else {
        answers[questionId] = value;

        document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
        element.classList.add('selected');
        element.querySelector('input').checked = true;
    }
}

function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
}

function updateButtons() {
    // Use visibility instead of display for prevBtn so Next button stays in same position
    const prevBtn = document.getElementById('prevBtn');
    prevBtn.style.display = 'block';
    prevBtn.style.visibility = currentQuestionIndex > 0 ? 'visible' : 'hidden';

    document.getElementById('nextBtn').style.display = currentQuestionIndex < questions.length - 1 ? 'block' : 'none';
    document.getElementById('submitBtn').style.display = currentQuestionIndex === questions.length - 1 ? 'block' : 'none';
}

function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
    }
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
    }
}

function submitTest(e) {
    e.preventDefault();

    // Validate all questions answered
    for (let i = 1; i <= questions.length; i++) {
        if (!answers[i] || (Array.isArray(answers[i]) && answers[i].length === 0)) {
            alert('Пожалуйста, ответьте на все вопросы');
            return;
        }
    }

    const results = calculateRiasec();
    displayResults(results);
}

function calculateRiasec() {
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

    // Calculate scores from questions 1-10
    for (let i = 1; i <= 10; i++) {
        const answer = answers[i];
        const question = questions[i - 1];
        const option = question.options.find(opt => opt.value === answer);
        if (option) {
            scores[option.type]++;
        }
    }

    // Sort by score
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);

    const top3 = sorted.slice(0, 3);
    const code = top3.map(([type]) => type).join('-');

    // Get majors
    const top2Code = top3[0][0] + top3[1][0];
    let majors = [];

    if (majorsByCombo[top2Code]) {
        majors = majorsByCombo[top2Code];
    } else if (majorsByCombo[top2Code.split('').reverse().join('')]) {
        majors = majorsByCombo[top2Code.split('').reverse().join('')];
    }

    // Add from individual types
    majors = [...new Set([...majors, ...majorsByType[top3[0][0]], ...majorsByType[top3[1][0]]])];

    return {
        code,
        scores,
        top3,
        majors,
        entSubjects: answers[11]
    };
}

function displayResults(results) {
    // Force scroll to absolute top before anything else
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    showSection('results-section');

    // Force scroll again after section switch
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // Display code
    document.getElementById('riasecCode').textContent = results.code;

    // Display description
    const descriptions = results.code.split('-').map(type => fullDescriptions[type]);
    document.getElementById('codeDescription').textContent = descriptions.join(' ');

    // Display scores chart
    const chartHTML = Object.entries(results.scores)
        .sort((a, b) => b[1] - a[1])
        .map(([type, score]) => `
            <div class="score-bar">
                <div class="score-label">
                    <span>${type} - ${typeDescriptions[type]}</span>
                    <span>${score}/10</span>
                </div>
                <div class="score-progress">
                    <div class="score-fill" style="width: ${(score / 10) * 100}%">
                        ${score}
                    </div>
                </div>
            </div>
        `).join('');

    document.getElementById('scoresChart').innerHTML = chartHTML;

    // Display majors
    const majorsHTML = results.majors.slice(0, 15).map(major =>
        `<span class="major-chip">${major}</span>`
    ).join('');

    document.getElementById('majorsList').innerHTML = majorsHTML;

    // ENT analysis - check if selected subjects match RIASEC type
    const topType = results.top3[0][0];
    const matchingProfiles = entProfilesByType[topType] || [];
    const selectedSubjects = results.entSubjects || [];

    // Check if any selected subject matches the top RIASEC type
    const hasMatch = selectedSubjects.some(subj => matchingProfiles.includes(subj));

    if (hasMatch) {
        document.getElementById('entAnalysis').textContent =
            'Ваш выбор профильных предметов хорошо согласуется с вашим типом личности. Это усиливает результат теста.';
    } else {
        document.getElementById('entAnalysis').textContent =
            'Текущий выбор профильных предметов отличается от вашего профиля. Можно обсудить это с профориентатором.';
    }

    // Store results globally
    window.testResults = results;

    // Final scroll to top after everything is rendered
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 50);
}

// Helper function to render Cyrillic text as image for PDF
function textToImage(text, options = {}) {
    const {
        fontSize = 16,
        fontFamily = 'Arial, sans-serif',
        color = '#000000',
        maxWidth = 500,
        align = 'left',
        fontWeight = 'normal'
    } = options;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

    // Word wrap
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    }
    if (currentLine) lines.push(currentLine);

    const lineHeight = fontSize * 1.3;
    const textWidth = Math.min(maxWidth, Math.max(...lines.map(l => ctx.measureText(l).width)));

    canvas.width = textWidth + 20;
    canvas.height = lines.length * lineHeight + 10;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textBaseline = 'top';

    lines.forEach((line, i) => {
        let x = 10;
        if (align === 'center') x = (canvas.width - ctx.measureText(line).width) / 2;
        else if (align === 'right') x = canvas.width - ctx.measureText(line).width - 10;
        ctx.fillText(line, x, i * lineHeight + 5);
    });

    return {
        dataUrl: canvas.toDataURL('image/png'),
        width: canvas.width,
        height: canvas.height
    };
}

async function generatePDF() {
    const btn = document.getElementById('downloadPdfBtn');
    const originalText = btn.textContent;
    btn.textContent = 'Создание PDF...';
    btn.disabled = true;

    try {
        const results = window.testResults;

        // Check ENT match for results
        const topType = results.top3[0][0];
        const matchingProfiles = entProfilesByType[topType] || [];
        const selectedSubjects = results.entSubjects || [];
        const entMatch = selectedSubjects.some(subj => matchingProfiles.includes(subj));

        const response = await fetch('/generate-pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                results: {
                    code: results.code,
                    scores: results.scores,
                    majors: results.majors,
                    entMatch: entMatch
                },
                studentInfo: studentInfo
            })
        });

        if (!response.ok) {
            throw new Error('Server error');
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        // Random filename
        const randomId = Math.random().toString(36).substring(2, 10);
        a.download = `RIASEC_${randomId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Произошла ошибка при создании PDF. Убедитесь, что сервер запущен.');
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

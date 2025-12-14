const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// PDF generation endpoint
app.post('/generate-pdf', async (req, res) => {
    const { results, studentInfo } = req.body;

    try {
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // Build HTML
        const html = buildPdfHtml(results, studentInfo);

        await page.setContent(html, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '15mm', right: '15mm', bottom: '15mm', left: '15mm' }
        });

        await browser.close();

        res.setHeader('Content-Type', 'application/pdf');
        // Random filename
        const randomId = Math.random().toString(36).substring(2, 10);
        const filename = `RIASEC_${randomId}.pdf`;
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(pdfBuffer);

    } catch (error) {
        console.error('PDF generation error:', error);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
});

function buildPdfHtml(results, studentInfo) {
    const typeDescriptions = {
        R: 'Реалистичный',
        I: 'Исследовательский',
        A: 'Артистичный',
        S: 'Социальный',
        E: 'Предпринимательский',
        C: 'Системный'
    };

    const fullDescriptions = {
        R: 'Вы практичны и любите работать руками. Вам нравится создавать реальные вещи и видеть результат своей работы.',
        I: 'Вы аналитичны и любознательны. Вам нравится исследовать, анализировать и понимать, как всё работает.',
        A: 'Вы креативны и оригинальны. Вам нравится создавать что-то новое и выражать свои идеи.',
        S: 'Вы общительны и эмпатичны. Вам нравится помогать людям и работать в команде.',
        E: 'Вы амбициозны и энергичны. Вам нравится вести за собой и добиваться целей.',
        C: 'Вы организованны и внимательны к деталям. Вам нравится порядок и чёткие правила.'
    };

    const getScoreColor = (score) => {
        if (score >= 8) return '#00B8D4';
        if (score >= 5) return '#FF9800';
        return '#E0E0E0';
    };

    const sortedScores = Object.entries(results.scores).sort((a, b) => b[1] - a[1]);
    const typeNames = results.code.split('-').map(t => typeDescriptions[t]).join(' - ');
    const descriptions = results.code.split('-').map(t => fullDescriptions[t]).join(' ');

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, sans-serif;
            color: #2c3e50;
            line-height: 1.5;
            padding: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #00B8D4;
        }

        .logos {
            display: flex;
            justify-content: center;
            gap: 40px;
            margin-bottom: 15px;
        }

        .logos img {
            height: 40px;
            object-fit: contain;
        }

        .title {
            font-size: 24px;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 5px;
        }

        .student-info {
            font-size: 11px;
            color: #666;
        }

        .riasec-section {
            text-align: center;
            margin: 25px 0;
        }

        .riasec-label {
            font-size: 12px;
            color: #666;
            margin-bottom: 5px;
        }

        .riasec-code {
            font-size: 42px;
            font-weight: 700;
            color: #00B8D4;
            letter-spacing: 8px;
            margin-bottom: 8px;
        }

        .type-names {
            font-size: 13px;
            font-weight: 500;
            color: #2c3e50;
            margin-bottom: 10px;
        }

        .description {
            font-size: 11px;
            color: #555;
            max-width: 500px;
            margin: 0 auto;
            text-align: center;
        }

        .scores-section {
            margin: 25px 0;
        }

        .section-title {
            font-size: 14px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 12px;
        }

        .score-row {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
        }

        .score-label {
            width: 180px;
            font-size: 11px;
            color: #2c3e50;
        }

        .score-bar-container {
            flex: 1;
            height: 8px;
            background: #E8E8E8;
            border-radius: 4px;
            margin: 0 10px;
        }

        .score-bar {
            height: 100%;
            border-radius: 4px;
            background: #00B8D4;
        }

        .score-value {
            width: 40px;
            text-align: right;
            font-size: 11px;
            font-weight: 600;
            color: #2c3e50;
        }

        .majors-section {
            margin: 25px 0;
        }

        .majors-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }

        .major-tag {
            background: #E3F2FD;
            color: #1976D2;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 10px;
            font-weight: 500;
        }

        .ent-section {
            margin: 25px 0;
            padding: 15px;
            background: #F5F5F5;
            border-left: 4px solid #00B8D4;
            border-radius: 4px;
        }

        .ent-title {
            font-size: 12px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 8px;
        }

        .ent-text {
            font-size: 11px;
            color: #555;
        }

        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #E0E0E0;
        }

        .footer-link {
            font-size: 10px;
            color: #00B8D4;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logos">
            <img src="https://ku.arizona.cv/logos/arizona-logo-ku.svg" alt="KU">
            <img src="https://ku.arizona.cv/logos/arizona-logo-arizona.png" alt="Arizona">
            <img src="https://ku.arizona.cv/logos/ertis academy logo vertical for alfacrm.png" alt="Ertis">
        </div>
        <div class="title">Результаты теста</div>
        <div class="student-info">${new Date().toLocaleDateString('ru-RU')}</div>
    </div>

    <div class="riasec-section">
        <div class="riasec-label">Ваш тип личности RIASEC:</div>
        <div class="riasec-code">${results.code}</div>
        <div class="type-names">${typeNames}</div>
        <div class="description">${descriptions}</div>
    </div>

    <div class="scores-section">
        <div class="section-title">Детальные результаты:</div>
        ${sortedScores.map(([type, score]) => `
            <div class="score-row">
                <div class="score-label">${type} - ${typeDescriptions[type]}</div>
                <div class="score-bar-container">
                    <div class="score-bar" style="width: ${score * 10}%; background: ${getScoreColor(score)}"></div>
                </div>
                <div class="score-value">${score}/10</div>
            </div>
        `).join('')}
    </div>

    <div class="majors-section">
        <div class="section-title">Рекомендуемые специальности:</div>
        <div class="majors-grid">
            ${results.majors.map(major => `<span class="major-tag">${major}</span>`).join('')}
        </div>
    </div>

    <div class="ent-section">
        <div class="ent-title">Анализ профильных предметов:</div>
        <div class="ent-text">${results.entMatch
            ? 'Ваш выбор профильных предметов хорошо согласуется с вашим типом личности.'
            : 'Текущий выбор профильных предметов отличается от вашего профиля. Можно обсудить это с профориентатором.'}</div>
    </div>

    <div class="footer">
        <a href="https://ku.arizona.cv/riasec-test.html" class="footer-link">ku.arizona.cv/riasec-test</a>
    </div>
</body>
</html>
    `;
}

// PDF generation endpoint for riasec-full.js (50-question test)
app.post('/generate-riasec-full-pdf', async (req, res) => {
    const { results, studentInfo } = req.body;

    try {
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // Build HTML for full test
        const html = buildFullPdfHtml(results, studentInfo);

        await page.setContent(html, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '15mm', right: '15mm', bottom: '15mm', left: '15mm' }
        });

        await browser.close();

        res.setHeader('Content-Type', 'application/pdf');
        const randomId = Math.random().toString(36).substring(2, 10);
        const filename = `RIASEC_Full_${randomId}.pdf`;
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(pdfBuffer);

    } catch (error) {
        console.error('PDF generation error:', error);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
});

function buildFullPdfHtml(results, studentInfo) {
    const typeDescriptions = {
        R: 'Реалистичный',
        I: 'Исследовательский',
        A: 'Артистичный',
        S: 'Социальный',
        E: 'Предпринимательский',
        C: 'Системный'
    };

    const fullDescriptions = {
        R: 'Вы практичны и любите работать руками. Вам нравится создавать реальные вещи и видеть результат своей работы.',
        I: 'Вы аналитичны и любознательны. Вам нравится исследовать, анализировать и понимать, как всё работает.',
        A: 'Вы креативны и оригинальны. Вам нравится создавать что-то новое и выражать свои идеи.',
        S: 'Вы общительны и эмпатичны. Вам нравится помогать людям и работать в команде.',
        E: 'Вы амбициозны и энергичны. Вам нравится вести за собой и добиваться целей.',
        C: 'Вы организованны и внимательны к деталям. Вам нравится порядок и чёткие правила.'
    };

    const majorsByType = {
        R: ["Инженерия", "Механика", "Строительство", "Сельское хозяйство", "Спорт", "Военное дело", "Ветеринария", "Геология"],
        I: ["Программирование", "Медицина", "Биология", "Физика", "Химия", "Математика", "Data Science", "Биотехнологии"],
        A: ["Дизайн", "Архитектура", "Журналистика", "Кино", "Музыка", "Реклама", "Фотография", "Мода"],
        S: ["Педагогика", "Психология", "Медицина", "Социальная работа", "HR", "Туризм", "Переводоведение"],
        E: ["Бизнес", "Менеджмент", "Маркетинг", "Юриспруденция", "Политология", "PR", "Финансы", "Международные отношения"],
        C: ["Бухгалтерия", "Экономика", "Банковское дело", "Логистика", "Статистика", "Аудит", "Госуправление", "IT-администрирование"]
    };

    const entAnalysisTexts = {
        "Физика – Математика": "Ваш выбор Физики и Математики отлично подходит для инженерных, IT и точных научных специальностей.",
        "Химия – Биология": "Выбор Химии и Биологии открывает путь в медицину, фармацевтику, биотехнологии и экологию.",
        "География – Математика": "Сочетание Географии и Математики подходит для геологии, картографии, экологии и градостроительства.",
        "Информатика – Математика": "Информатика с Математикой — идеальная комбинация для IT-карьеры: программирование, Data Science, кибербезопасность.",
        "Иностранный язык – Всемирная история": "Эти предметы открывают двери в международные отношения, переводоведение и журналистику.",
        "География – Иностранный язык": "Комбинация для международного бизнеса, туризма и логистики.",
        "Всемирная история – География": "Подходит для политологии, международных отношений и журналистики.",
        "Казахский язык – Казахская литература": "Идеально для филологии, журналистики и преподавания.",
        "Русский язык – Русская литература": "Идеально для филологии, журналистики и преподавания.",
        "Творческий экзамен": "Творческий экзамен открывает путь в дизайн, архитектуру, искусство и медиа.",
        "Биология – География": "Подходит для экологии, географии, туризма и природопользования.",
        "Химия – Физика": "Отличный выбор для инженерии, материаловедения и технических наук.",
        "Всемирная история – Основы права": "Идеально для юриспруденции, политологии и государственного управления."
    };

    const getScoreColor = (score, max) => {
        const pct = score / max;
        if (pct >= 0.7) return '#00B8D4';
        if (pct >= 0.4) return '#FF9800';
        return '#E0E0E0';
    };

    const sortedScores = results.sorted || Object.entries(results.scores).sort((a, b) => b[1] - a[1]);
    const maxScore = sortedScores[0] ? sortedScores[0][1] : 50;
    const top3 = results.top3 || sortedScores.slice(0, 3);
    const code = top3.map(([type]) => type).join('-');
    const typeNames = top3.map(([t]) => typeDescriptions[t]).join(' - ');
    const descriptions = top3.map(([t]) => fullDescriptions[t]).join(' ');

    // Generate majors from top 3 types
    const recommendedMajors = new Set();
    top3.forEach(([type]) => {
        majorsByType[type].slice(0, 4).forEach(major => recommendedMajors.add(major));
    });
    const majors = Array.from(recommendedMajors);

    // ENT analysis
    const selectedENT = results.selectedENT || [];
    const entTexts = selectedENT.map(ent => entAnalysisTexts[ent] || '').filter(t => t);
    const entAnalysis = entTexts.length > 0
        ? entTexts.join(' ')
        : 'Рекомендуем обсудить выбор профильных предметов с профориентатором.';

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Inter', -apple-system, sans-serif;
            color: #2c3e50;
            line-height: 1.5;
            padding: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #00B8D4;
        }

        .logos {
            display: flex;
            justify-content: center;
            gap: 40px;
            margin-bottom: 15px;
        }

        .logos img { height: 40px; object-fit: contain; }

        .title { font-size: 24px; font-weight: 700; color: #2c3e50; margin-bottom: 5px; }

        .student-info { font-size: 11px; color: #666; }

        .riasec-section { text-align: center; margin: 25px 0; }

        .riasec-label { font-size: 12px; color: #666; margin-bottom: 5px; }

        .riasec-code {
            font-size: 42px;
            font-weight: 700;
            color: #00B8D4;
            letter-spacing: 8px;
            margin-bottom: 8px;
        }

        .type-names { font-size: 13px; font-weight: 500; color: #2c3e50; margin-bottom: 10px; }

        .description { font-size: 11px; color: #555; max-width: 500px; margin: 0 auto; text-align: center; }

        .scores-section { margin: 25px 0; }

        .section-title { font-size: 14px; font-weight: 600; color: #2c3e50; margin-bottom: 12px; }

        .score-row { display: flex; align-items: center; margin-bottom: 8px; }

        .score-label { width: 180px; font-size: 11px; color: #2c3e50; }

        .score-bar-container { flex: 1; height: 8px; background: #E8E8E8; border-radius: 4px; margin: 0 10px; }

        .score-bar { height: 100%; border-radius: 4px; background: #00B8D4; }

        .score-value { width: 40px; text-align: right; font-size: 11px; font-weight: 600; color: #2c3e50; }

        .majors-section { margin: 25px 0; }

        .majors-grid { display: flex; flex-wrap: wrap; gap: 8px; }

        .major-tag {
            background: #E3F2FD;
            color: #1976D2;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 10px;
            font-weight: 500;
        }

        .ent-section {
            margin: 25px 0;
            padding: 15px;
            background: #F5F5F5;
            border-left: 4px solid #00B8D4;
            border-radius: 4px;
        }

        .ent-title { font-size: 12px; font-weight: 600; color: #2c3e50; margin-bottom: 8px; }

        .ent-text { font-size: 11px; color: #555; }

        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #E0E0E0;
        }

        .footer-link { font-size: 10px; color: #00B8D4; text-decoration: none; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logos">
            <img src="https://ku.arizona.cv/logos/arizona-logo-ku.svg" alt="KU">
            <img src="https://ku.arizona.cv/logos/arizona-logo-arizona.png" alt="Arizona">
            <img src="https://ku.arizona.cv/logos/ertis academy logo vertical for alfacrm.png" alt="Ertis">
        </div>
        <div class="title">Результаты RIASEC теста</div>
        <div class="student-info">${studentInfo?.name || ''} | ${new Date().toLocaleDateString('ru-RU')}</div>
    </div>

    <div class="riasec-section">
        <div class="riasec-label">Ваш тип личности RIASEC:</div>
        <div class="riasec-code">${code}</div>
        <div class="type-names">${typeNames}</div>
        <div class="description">${descriptions}</div>
    </div>

    <div class="scores-section">
        <div class="section-title">Детальные результаты:</div>
        ${sortedScores.map(([type, score]) => `
            <div class="score-row">
                <div class="score-label">${type} - ${typeDescriptions[type]}</div>
                <div class="score-bar-container">
                    <div class="score-bar" style="width: ${(score / maxScore) * 100}%; background: ${getScoreColor(score, maxScore)}"></div>
                </div>
                <div class="score-value">${score}</div>
            </div>
        `).join('')}
    </div>

    <div class="majors-section">
        <div class="section-title">Рекомендуемые специальности:</div>
        <div class="majors-grid">
            ${majors.map(major => `<span class="major-tag">${major}</span>`).join('')}
        </div>
    </div>

    <div class="ent-section">
        <div class="ent-title">Анализ профильных предметов:</div>
        <div class="ent-text">${entAnalysis}</div>
    </div>

    <div class="footer">
        <a href="https://ku.arizona.cv" class="footer-link">ku.arizona.cv</a>
    </div>
</body>
</html>
    `;
}

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`PDF Server running at http://localhost:${PORT}`);
    console.log(`Static files served from current directory`);
});

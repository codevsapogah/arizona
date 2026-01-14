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
    const { results, studentInfo, language } = req.body;

    try {
        const browser = await puppeteer.launch({
            headless: 'new',
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser',
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });

        const page = await browser.newPage();

        // Build HTML with language support
        const html = buildPdfHtml(results, studentInfo, language || 'ru');

        await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 10000 });

        // Wait for fonts to load
        await page.waitForTimeout(500);

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

function buildPdfHtml(results, studentInfo, language = 'ru') {
    const translations = {
        ru: {
            resultsTitle: 'Результаты теста',
            yourTypeTitle: 'Ваш тип личности RIASEC:',
            detailedResults: 'Детальные результаты:',
            recommendedMajors: 'Рекомендуемые специальности:',
            entAnalysisTitle: 'Анализ профильных предметов:',
            entMatchYes: 'Ваш выбор профильных предметов хорошо согласуется с вашим типом личности.',
            entMatchNo: 'Текущий выбор профильных предметов отличается от вашего профиля. Можно обсудить это с профориентатором.'
        },
        kk: {
            resultsTitle: 'Тест нәтижелері',
            yourTypeTitle: 'Сіздің RIASEC тұлға түріңіз:',
            detailedResults: 'Егжей-тегжейлі нәтижелер:',
            recommendedMajors: 'Ұсынылатын мамандықтар:',
            entAnalysisTitle: 'Таңдау пәндерінің талдауы:',
            entMatchYes: 'Сіздің таңдау пәндеріңіз тұлға түріңізбен жақсы сәйкес келеді.',
            entMatchNo: 'Ағымдағы таңдау пәндері сіздің профиліңізден ерекшеленеді. Мұны профориентатормен талқылауға болады.'
        }
    };

    const typeDescriptionsRu = {
        R: 'Реалистичный',
        I: 'Исследовательский',
        A: 'Артистичный',
        S: 'Социальный',
        E: 'Предпринимательский',
        C: 'Системный'
    };

    const typeDescriptionsKk = {
        R: 'Шынайы',
        I: 'Зерттеушілік',
        A: 'Көркемдік',
        S: 'Әлеуметтік',
        E: 'Кәсіпкерлік',
        C: 'Жүйелік'
    };

    const fullDescriptionsRu = {
        R: 'Вы практичны и любите работать руками. Вам нравится создавать реальные вещи и видеть результат своей работы.',
        I: 'Вы аналитичны и любознательны. Вам нравится исследовать, анализировать и понимать, как всё работает.',
        A: 'Вы креативны и оригинальны. Вам нравится создавать что-то новое и выражать свои идеи.',
        S: 'Вы общительны и эмпатичны. Вам нравится помогать людям и работать в команде.',
        E: 'Вы амбициозны и энергичны. Вам нравится вести за собой и добиваться целей.',
        C: 'Вы организованны и внимательны к деталям. Вам нравится порядок и чёткие правила.'
    };

    const fullDescriptionsKk = {
        R: 'Сіз практикалықсыз және қолмен жұмыс істеуді жақсы көресіз. Сіз нақты заттар жасауды және жұмысыңыздың нәтижесін көруді ұнатасыз.',
        I: 'Сіз аналитикалықсыз және қызығушысыз. Сіз зерттеуді, талдауды және бәрі қалай жұмыс істейтінін түсінуді ұнатасыз.',
        A: 'Сіз креативтісіз және өзгешесіз. Сіз жаңа нәрсе жасауды және идеяларыңызды білдіруді ұнатасыз.',
        S: 'Сіз эмпатиялысыз және қарым-қатынасшылсыз. Сіз адамдарға көмектесуді және командада жұмыс істеуді ұнатасыз.',
        E: 'Сіз амбициялысыз және өзіңізге сенімдісіз. Сіз басқаруды, көндіруді және мақсаттарға жетуді ұнатасыз.',
        C: 'Сіз ұйымдастырылғансыз және егжей-тегжейлерге мұқият қарайсыз. Сіз ақпаратты жүйелеуді және деректермен жұмыс істеуді ұнатасыз.'
    };

    const t = translations[language];
    const typeDescriptions = language === 'kk' ? typeDescriptionsKk : typeDescriptionsRu;
    const fullDescriptions = language === 'kk' ? fullDescriptionsKk : fullDescriptionsRu;

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
        <div class="title">${t.resultsTitle}</div>
        <div class="student-info">${new Date().toLocaleDateString(language === 'kk' ? 'kk-KZ' : 'ru-RU')}</div>
    </div>

    <div class="riasec-section">
        <div class="riasec-label">${t.yourTypeTitle}</div>
        <div class="riasec-code">${results.code}</div>
        <div class="type-names">${typeNames}</div>
        <div class="description">${descriptions}</div>
    </div>

    <div class="scores-section">
        <div class="section-title">${t.detailedResults}</div>
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
        <div class="section-title">${t.recommendedMajors}</div>
        <div class="majors-grid">
            ${results.majors.map(major => `<span class="major-tag">${major}</span>`).join('')}
        </div>
    </div>

    <div class="ent-section">
        <div class="ent-title">${t.entAnalysisTitle}</div>
        <div class="ent-text">${results.entMatch ? t.entMatchYes : t.entMatchNo}</div>
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
    const { results, studentInfo, language } = req.body;

    try {
        const browser = await puppeteer.launch({
            headless: 'new',
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser',
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });

        const page = await browser.newPage();

        // Build HTML for full test with language support
        const html = buildFullPdfHtml(results, studentInfo, language || 'kk');

        await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 10000 });

        // Wait for fonts to load
        await page.waitForTimeout(500);

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

function buildFullPdfHtml(results, studentInfo, language = 'kk') {
    const translations = {
        ru: {
            resultsTitle: 'Результаты RIASEC теста',
            yourTypeTitle: 'Ваш тип личности RIASEC:',
            detailedResults: 'Детальные результаты:',
            recommendedMajors: 'Рекомендуемые специальности:',
            entAnalysisTitle: 'Анализ профильных предметов:',
            entAnalysisDefault: 'Рекомендуем обсудить выбор профильных предметов с профориентатором.'
        },
        kk: {
            resultsTitle: 'RIASEC тестінің нәтижелері',
            yourTypeTitle: 'Сіздің RIASEC тұлға типіңіз:',
            detailedResults: 'Егжей-тегжейлі нәтижелер:',
            recommendedMajors: 'Ұсынылатын мамандықтар:',
            entAnalysisTitle: 'Таңдау пәндерін талдау:',
            entAnalysisDefault: 'Профориентатормен таңдау пәндерін талқылауды ұсынамыз.'
        }
    };

    const typeDescriptionsKk = {
        R: 'Реалистік',
        I: 'Зерттеушілік',
        A: 'Артистік',
        S: 'Әлеуметтік',
        E: 'Кәсіпкерлік',
        C: 'Жүйелік'
    };

    const typeDescriptionsRu = {
        R: 'Реалистичный',
        I: 'Исследовательский',
        A: 'Артистичный',
        S: 'Социальный',
        E: 'Предпринимательский',
        C: 'Системный'
    };

    const fullDescriptionsKk = {
        R: 'Сіз практикалысыз және қолыңызбен жұмыс істегенді ұнатасыз. Нақты заттарды жасап, жұмысыңыздың нәтижесін көргенді жақсы көресіз.',
        I: 'Сіз талдаушысыз және білгіңіз келеді. Зерттеп, талдап, барлығының қалай жұмыс істейтінін түсінгенді ұнатасыз.',
        A: 'Сіз креативтісіз және бірегейсіз. Жаңа нәрселер жасап, идеяларыңызды білдіргенді ұнатасыз.',
        S: 'Сіз эмпатиялысыз және коммуникабельдісіз. Адамдарға көмектесіп, командада жұмыс істегенді жақсы көресіз.',
        E: 'Сіз амбициялысыз және өзіңізге сенімдісіз. Басқаруды, сендіруді және мақсаттарға жетуді ұнатасыз.',
        C: 'Сіз ұйымдастырылғансыз және бөлшектерге мән бересіз. Ақпаратты жүйелеп, деректермен жұмыс істегенді ұнатасыз.'
    };

    const fullDescriptionsRu = {
        R: 'Вы практичны и любите работать руками. Вам нравится создавать реальные вещи и видеть результат своей работы.',
        I: 'Вы аналитичны и любознательны. Вам нравится исследовать, анализировать и понимать, как всё работает.',
        A: 'Вы креативны и оригинальны. Вам нравится создавать что-то новое и выражать свои идеи.',
        S: 'Вы эмпатичны и общительны. Вам нравится помогать людям и работать в команде.',
        E: 'Вы амбициозны и уверены в себе. Вам нравится руководить, убеждать и достигать целей.',
        C: 'Вы организованны и внимательны к деталям. Вам нравится систематизировать информацию и работать с данными.'
    };

    const t = translations[language];
    const typeDescriptions = language === 'kk' ? typeDescriptionsKk : typeDescriptionsRu;
    const fullDescriptions = language === 'kk' ? fullDescriptionsKk : fullDescriptionsRu;

    const majorsByType = {
        R: ["Инженерия", "Механика", "Құрылыс", "Ауыл шаруашылығы", "Спорт", "Әскери іс", "Ветеринария", "Геология"],
        I: ["Бағдарламалау", "Медицина", "Биология", "Физика", "Химия", "Математика", "Data Science", "Биотехнология"],
        A: ["Дизайн", "Сәулет", "Журналистика", "Кино", "Музыка", "Жарнама", "Фотография", "Сән"],
        S: ["Педагогика", "Психология", "Медицина", "Әлеуметтік жұмыс", "HR", "Туризм", "Аудармашылық"],
        E: ["Бизнес", "Менеджмент", "Маркетинг", "Заң", "Саясаттану", "PR", "Қаржы", "Халықаралық қатынастар"],
        C: ["Бухгалтерия", "Экономика", "Банк ісі", "Логистика", "Статистика", "Аудит", "Мемлекеттік басқару", "IT-әкімшілендіру"]
    };

    const entAnalysisTextsKk = {
        "Физика – Математика": "Физика мен Математиканы таңдауыңыз инженерлік, IT және дәл ғылыми мамандықтарға өте жақсы сәйкес келеді.",
        "Химия – Биология": "Химия мен Биологияны таңдау медицинаға, фармацевтикаға, биотехнологияға және экологияға жол ашады.",
        "География – Математика": "География мен Математиканың үйлесімі геологияға, картографияға, экологияға және қала құрылысына қолайлы.",
        "Информатика – Математика": "Информатика мен Математика IT-мансапқа өте жақсы үйлесім: бағдарламалау, Data Science, киберқауіпсіздік.",
        "Шет тілі – Дүниежүзі тарихы": "Бұл пәндер халықаралық қатынастарға, аудармашылыққа және журналистикаға есік ашады.",
        "География – Шет тілі": "Халықаралық бизнес, туризм және логистикаға арналған үйлесім.",
        "Дүниежүзі тарихы – География": "Саясаттануға, халықаралық қатынастарға және журналистикаға қолайлы.",
        "Қазақ тілі – Қазақ әдебиеті": "Филологияға, журналистикаға және оқытуға өте жақсы.",
        "Орыс тілі – Орыс әдебиеті": "Филологияға, журналистикаға және оқытуға өте жақсы.",
        "Шығармашылық емтихан": "Шығармашылық емтихан дизайнға, сәулетке, өнерге және медиаға жол ашады.",
        "Биология – География": "Экологияға, географияға, туризмге және табиғатты пайдалануға қолайлы.",
        "Химия – Физика": "Инженерияға, материалтануға және техникалық ғылымдарға тамаша таңдау.",
        "Дүниежүзі тарихы – Құқық негіздері": "Заңға, саясаттануға және мемлекеттік басқаруға өте жақсы."
    };

    const entAnalysisTextsRu = {
        "Физика – Математика": "Ваш выбор Физики и Математики отлично подходит для инженерных, IT и точных научных специальностей.",
        "Химия – Биология": "Выбор Химии и Биологии открывает путь в медицину, фармацевтику, биотехнологии и экологию.",
        "География – Математика": "Сочетание Географии и Математики подходит для геологии, картографии, экологии и градостроительства.",
        "Информатика – Математика": "Информатика и Математика — отличное сочетание для IT-карьеры: программирование, Data Science, кибербезопасность.",
        "Шет тілі – Дүниежүзі тарихы": "Эти предметы открывают двери в международные отношения, переводческое дело и журналистику.",
        "География – Шет тілі": "Сочетание для международного бизнеса, туризма и логистики.",
        "Дүниежүзі тарихы – География": "Подходит для политологии, международных отношений и журналистики.",
        "Қазақ тілі – Қазақ әдебиеті": "Отлично подходит для филологии, журналистики и преподавания.",
        "Орыс тілі – Орыс әдебиеті": "Отлично подходит для филологии, журналистики и преподавания.",
        "Шығармашылық емтихан": "Творческий экзамен открывает путь в дизайн, архитектуру, искусство и медиа.",
        "Биология – География": "Подходит для экологии, географии, туризма и природопользования.",
        "Химия – Физика": "Отличный выбор для инженерии, материаловедения и технических наук.",
        "Дүниежүзі тарихы – Құқық негіздері": "Отлично подходит для юриспруденции, политологии и государственного управления."
    };

    const entAnalysisTexts = language === 'kk' ? entAnalysisTextsKk : entAnalysisTextsRu;

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
        : t.entAnalysisDefault;

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
        <div class="title">${t.resultsTitle}</div>
        <div class="student-info">${studentInfo?.name || ''} | ${new Date().toLocaleDateString(language === 'kk' ? 'kk-KZ' : 'ru-RU')}</div>
    </div>

    <div class="riasec-section">
        <div class="riasec-label">${t.yourTypeTitle}</div>
        <div class="riasec-code">${code}</div>
        <div class="type-names">${typeNames}</div>
        <div class="description">${descriptions}</div>
    </div>

    <div class="scores-section">
        <div class="section-title">${t.detailedResults}</div>
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
        <div class="section-title">${t.recommendedMajors}</div>
        <div class="majors-grid">
            ${majors.map(major => `<span class="major-tag">${major}</span>`).join('')}
        </div>
    </div>

    <div class="ent-section">
        <div class="ent-title">${t.entAnalysisTitle}</div>
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

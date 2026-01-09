# Arizona Project - RIASEC Career Orientation Platform

## Project Overview
RIASEC Career Orientation Test Platform for Kozybayev University in partnership with University of Arizona and Ertis Academy.

**Live Site:** https://ku.arizona.cv

**Current Version:** Auto-bumped on each deployment (see package.json)

---

## Architecture

### Frontend
- **Languages:** Kazakh (primary), Russian
- **Tests:**
  - `riasec-test.html` - Short version (11 questions)
  - `riasec-full.html` - Full version (51 questions)
- **Scripts:**
  - `riasec.js` - Short test logic with bilingual support
  - `riasec-full.js` - Full test logic with bilingual support
  - `script.js` - Main site functionality

### Backend
- **PDF Server:** `pdf-server.js` (Express + Puppeteer)
  - Port: 3002 (proxied through nginx)
  - Endpoints:
    - `POST /generate-pdf` - Short test PDF
    - `POST /generate-riasec-full-pdf` - Full test PDF
    - `POST /generate-holland-pdf` - Holland test PDF

### Deployment
- **Production Server:** 194.32.141.21
- **Web Root:** `/var/www/arizona`
- **Process Manager:** PM2 (process name: `arizona-pdf`)
- **Web Server:** Nginx with SSL (Let's Encrypt)
- **Domain:** ku.arizona.cv

---

## Version Management

### Automatic Version Bumping
Every deployment automatically increments the patch version (1.0.0 → 1.0.1 → 1.0.2).

**Scripts:**
```bash
npm run version:patch   # 1.0.0 → 1.0.1 (auto-used by deploy.sh)
npm run version:minor   # 1.0.0 → 1.1.0 (manual for features)
npm run version:major   # 1.0.0 → 2.0.0 (manual for breaking changes)
```

**How it works:**
1. `./deploy.sh` runs `npm run version:patch`
2. package.json version is updated
3. Version change is committed automatically
4. Changes are pushed to GitHub
5. Files are deployed to production

### Manual Version Bump
If you need to bump minor or major version:
```bash
npm run version:minor
git add package.json
git commit -m "Bump version to vX.Y.Z"
git push origin main
./deploy.sh  # This will skip auto-bump if version already changed
```

---

## Deployment Guide

### Prerequisites
- `sshpass` installed (`brew install sshpass`)
- `rsync` installed (pre-installed on macOS)
- Git repository configured
- SSH access to production server

### Deploy to Production
```bash
./deploy.sh
```

This automatically:
1. ✅ Bumps version (patch)
2. ✅ Commits version change
3. ✅ Pushes to GitHub
4. ✅ Uploads files to server
5. ✅ Restarts PDF server (PM2)
6. ✅ Reloads nginx

### Manual Steps (if needed)
```bash
# Start PDF server manually
ssh ubuntu@194.32.141.21
cd /var/www/arizona
pm2 start pdf-server.js --name arizona-pdf
pm2 save

# Check PM2 status
pm2 status arizona-pdf
pm2 logs arizona-pdf

# Restart nginx
sudo systemctl restart nginx
```

---

## Bug Fixes History

### 2026-01-09: Critical Bug Fixes (v1.0.0)

**Bug #1: Missing Next Button**
- **Issue:** Next button not appearing in riasec-full.js (51 questions)
- **Fix:** Added null safety checks in `updateButtons()` function
- **Files:** riasec-full.js:1008-1020

**Bug #2: PDF Generation Not Working**
- **Issue:** PDF generation timeouts and network errors
- **Root Cause:**
  - Puppeteer couldn't find Chrome executable on server
  - Fetch URLs using localhost:3002 didn't work through nginx
- **Fix:**
  - Added `executablePath: '/usr/bin/chromium-browser'` to Puppeteer config
  - Changed fetch URLs from absolute to relative paths
  - Configured nginx reverse proxy for `/generate-pdf` and `/generate-riasec-full-pdf`
- **Files:** pdf-server.js:17-19, 364-366, riasec.js, riasec-full.js

---

## Technical Stack

### Dependencies
```json
{
  "express": "^5.2.1",      // Web server
  "puppeteer": "^24.32.1",  // PDF generation
  "cors": "^2.8.5"          // CORS handling
}
```

### Server Requirements
- Node.js (v18+)
- Chromium browser (`/usr/bin/chromium-browser`)
- PM2 process manager
- Nginx with SSL

### Nginx Configuration
Located at `/etc/nginx/sites-available/ku.arizona.cv`:
- Proxies PDF endpoints to localhost:3002
- 120s timeout for PDF generation
- SSL enabled via Let's Encrypt

---

## Development

### Local Setup
```bash
# Install dependencies
npm install

# Start PDF server locally
npm start
# OR
node pdf-server.js

# Server runs at http://localhost:3002
```

### Testing PDF Generation Locally
```bash
# Start server
node pdf-server.js

# Open tests in browser
open riasec-test.html
open riasec-full.html

# Test PDF endpoint
curl -X POST http://localhost:3002/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{"results":{"code":"R-I-A","scores":{"R":8},"majors":[],"entMatch":true},"studentInfo":{},"language":"ru"}' \
  --output test.pdf
```

### File Structure
```
arizona/
├── index.html              # Landing page
├── riasec-test.html       # Short test (11 questions)
├── riasec-full.html       # Full test (51 questions)
├── riasec.js              # Short test logic
├── riasec-full.js         # Full test logic
├── pdf-server.js          # PDF generation server
├── script.js              # Main site JS
├── style.css              # Main site styles
├── riasec-style.css       # Test styles
├── package.json           # Dependencies & version
├── deploy.sh              # Auto-deploy script
├── claude.md              # This file
└── logos/                 # University logos
```

---

## Troubleshooting

### PDF Generation Fails
```bash
# Check PM2 logs
pm2 logs arizona-pdf

# Check if Chromium is installed
which chromium-browser

# Test server locally on production
ssh ubuntu@194.32.141.21
curl http://localhost:3002
```

### Deployment Issues
```bash
# Check nginx config
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx

# Check PM2 processes
pm2 status
```

### Version Not Updating
```bash
# Manually bump and commit
npm run version:patch
git add package.json
git commit -m "Bump version"
git push origin main
```

---

## API Endpoints

### POST /generate-pdf
Generate PDF for short RIASEC test (11 questions).

**Request:**
```json
{
  "results": {
    "code": "R-I-A",
    "scores": {"R": 8, "I": 7, "A": 6, "S": 4, "E": 3, "C": 2},
    "majors": ["Инженерия", "Программирование"],
    "entMatch": true
  },
  "studentInfo": {},
  "language": "ru"
}
```

**Response:** PDF file (binary)

### POST /generate-riasec-full-pdf
Generate PDF for full RIASEC test (51 questions).

**Request:**
```json
{
  "results": {
    "code": "R-I-A",
    "scores": {"R": 45, "I": 38, "A": 32, "S": 25, "E": 20, "C": 15},
    "sorted": [["R", 45], ["I", 38], ...],
    "top3": [["R", 45], ["I", 38], ["A", 32]],
    "majors": ["Инженерия", "Бағдарламалау", "Дизайн"],
    "selectedENT": ["Физика – Математика"]
  },
  "studentInfo": {"name": "Student Name"},
  "language": "kk"
}
```

**Response:** PDF file (binary)

---

## Important Notes

### Security
- SSH password stored in `deploy.sh` (keep this file secure)
- Never commit sensitive credentials to GitHub
- Production server uses SSH key authentication

### Performance
- PDF generation takes 3-6 seconds
- Nginx timeout set to 120s for safety
- PM2 auto-restarts on crashes

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- JavaScript required

---

## Contact & Support

**Project Team:**
- Kozybayev University
- University of Arizona
- Ertis Academy

**Repository:** https://github.com/codevsapogah/arizona

**Issues:** Report bugs via GitHub Issues

---

*Last Updated: 2026-01-09*
*Documentation maintained by Claude Code*

#!/bin/bash
# Update version.js from package.json

VERSION=$(node -p "require('./package.json').version")

cat > version.js << EOF
// Version display utility
// Auto-generated from package.json version
const APP_VERSION = '$VERSION';

// Display version in footer
function displayVersion() {
    const footers = document.querySelectorAll('.site-footer p');
    footers.forEach(footer => {
        if (footer.textContent.includes('Career Vision')) {
            footer.innerHTML = footer.innerHTML.replace(
                'Career Vision | 2025',
                \`Career Vision | 2025 | <span style="color: #00B8D4;">v\${APP_VERSION}</span>\`
            );
        }
    });
}

// Run on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', displayVersion);
} else {
    displayVersion();
}
EOF

echo "Updated version.js to v$VERSION"

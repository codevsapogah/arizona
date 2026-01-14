// Version display utility
// Auto-generated from package.json version
const APP_VERSION = '1.0.2';

// Display version in footer
function displayVersion() {
    const footers = document.querySelectorAll('.site-footer p');
    footers.forEach(footer => {
        if (footer.textContent.includes('Career Vision')) {
            // Add version on a new line at the very bottom
            const versionSpan = `<br><span style="color: #00B8D4; font-size: 0.9em;">v${APP_VERSION}</span>`;

            // Replace text, handling potential line breaks
            if (!footer.innerHTML.includes(versionSpan)) {
                footer.innerHTML = footer.innerHTML.replace(
                    /(Career Vision \| 2025)/,
                    `$1${versionSpan}`
                );
            }
        }
    });
}

// Run on page load with delay to ensure DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(displayVersion, 100);
    });
} else {
    setTimeout(displayVersion, 100);
}

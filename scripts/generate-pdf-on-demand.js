const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generatePDFOnDemand(htmlContent) {
    console.log('🚀 Starting on-demand PDF generation...');
    
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: "new",
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--single-process',
                '--disable-gpu'
            ]
        });

        const page = await browser.newPage();
        
        // Set high DPI for 4K quality
        await page.setViewport({
            width: 1240,
            height: 1754,
            deviceScaleFactor: 3
        });

        // Set the HTML content directly
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        // Wait for fonts and complete rendering
        await page.evaluate(() => {
            return document.fonts.ready;
        });

        await page.waitForTimeout(2000);

        console.log('📝 Generating PDF...');

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            preferCSSPageSize: true,
            margin: {
                top: '0mm',
                right: '0mm',
                bottom: '0mm',
                left: '0mm'
            },
            displayHeaderFooter: false,
            scale: 1,
            omitBackground: false,
            timeout: 30000
        });

        const outputPath = path.join(__dirname, '..', 'public', 'assets', 'cv', 'Trần_Nguyên_Khánh_CV.pdf');
        fs.writeFileSync(outputPath, pdfBuffer);

        console.log('✅ PDF generated successfully!');
        console.log(`📁 Output file: ${outputPath}`);
        
        return outputPath;

    } catch (error) {
        console.error('❌ Error during PDF generation:', error.message);
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

module.exports = generatePDFOnDemand;

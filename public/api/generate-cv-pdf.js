const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generateCVPDF(req, res) {
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

        // Get the HTML CV from the React app
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const cvUrl = `${baseUrl}/resume?view=print`;
        
        console.log(`📄 Loading CV from: ${cvUrl}`);
        
        await page.goto(cvUrl, {
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

        // Set response headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="Trần_Nguyên_Khánh_CV.pdf"');
        res.setHeader('Content-Length', pdfBuffer.length);

        // Send the PDF buffer
        res.send(pdfBuffer);

        console.log('✅ PDF generated and sent successfully!');

    } catch (error) {
        console.error('❌ Error during PDF generation:', error.message);
        res.status(500).json({ 
            error: 'PDF generation failed', 
            message: error.message 
        });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

module.exports = generateCVPDF;

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔄 Updating CV PDF...');

try {
    // Navigate to .cv directory and run export
    const cvDir = path.join(__dirname, '..', '.cv');
    process.chdir(cvDir);
    
    console.log('📄 Generating PDF from HTML...');
    execSync('node export-to-pdf.js', { stdio: 'inherit' });
    
    // Copy the generated PDF to public assets
    const sourcePdf = path.join(cvDir, 'SE172279_Trần_Nguyên_Khánh_4K.pdf');
    const destPdf = path.join(__dirname, '..', 'public', 'assets', 'cv', 'Trần_Nguyên_Khánh_CV.pdf');
    
    console.log('📁 Copying PDF to public assets...');
    fs.copyFileSync(sourcePdf, destPdf);
    
    console.log('✅ CV PDF updated successfully!');
    console.log(`📊 File location: ${destPdf}`);
    
} catch (error) {
    console.error('❌ Error updating CV PDF:', error.message);
    process.exit(1);
}

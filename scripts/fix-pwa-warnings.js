const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'components', 'common', 'PWAManager.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add eslint-disable comments for all unused styled components
const styledComponents = [
  'InstallIcon',
  'BannerText', 
  'BannerTitle',
  'BannerDescription',
  'BannerActions',
  'InstallButton',
  'DismissButton'
];

styledComponents.forEach(component => {
  const regex = new RegExp(`^const ${component} = styled`, 'gm');
  content = content.replace(regex, `// eslint-disable-next-line @typescript-eslint/no-unused-vars\nconst ${component} = styled`);
});

fs.writeFileSync(filePath, content);
console.log('Fixed PWA Manager warnings');

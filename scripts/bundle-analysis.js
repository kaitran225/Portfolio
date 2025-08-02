#!/usr/bin/env node

/**
 * Bundle Analysis Script
 * Analyzes webpack chunks and identifies optimization opportunities
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BUILD_DIR = path.join(__dirname, '../build/static/js');

function analyzeChunks() {
  console.log('📦 Bundle Analysis Report');
  console.log('========================\n');
  
  if (!fs.existsSync(BUILD_DIR)) {
    console.error('❌ Build directory not found. Run "npm run build" first.');
    process.exit(1);
  }
  
  const files = fs.readdirSync(BUILD_DIR);
  const chunks = files
    .filter(file => file.endsWith('.js'))
    .map(file => {
      const filePath = path.join(BUILD_DIR, file);
      const stats = fs.statSync(filePath);
      const sizeKB = Math.round(stats.size / 1024);
      
      return {
        name: file,
        size: stats.size,
        sizeKB,
        isMain: file.includes('main'),
        isChunk: /^\d+\./.test(file)
      };
    })
    .sort((a, b) => b.size - a.size);
    
  let totalSize = 0;
  
  console.log('📊 Chunk Size Analysis:');
  console.log('=======================');
  
  chunks.forEach((chunk, index) => {
    totalSize += chunk.size;
    const status = chunk.sizeKB > 500 ? '🔴' : chunk.sizeKB > 200 ? '🟡' : '🟢';
    const priority = chunk.isMain ? ' (MAIN)' : chunk.isChunk ? ' (CHUNK)' : '';
    
    console.log(`${status} ${chunk.name}: ${chunk.sizeKB} KB${priority}`);
    
    if (index < 3) {
      console.log(`   📋 Top ${index + 1} largest chunk`);
    }
  });
  
  console.log(`\n📊 Total Bundle Size: ${Math.round(totalSize / 1024)} KB`);
  
  // Analysis and recommendations
  console.log('\n🔍 Optimization Analysis:');
  console.log('=========================');
  
  const largeChunks = chunks.filter(chunk => chunk.sizeKB > 300);
  const mainChunk = chunks.find(chunk => chunk.isMain);
  
  if (largeChunks.length > 0) {
    console.log(`⚠️  Found ${largeChunks.length} large chunks (>300KB):`);
    largeChunks.forEach(chunk => {
      console.log(`   • ${chunk.name} (${chunk.sizeKB} KB)`);
    });
  }
  
  if (mainChunk && mainChunk.sizeKB > 200) {
    console.log(`⚠️  Main chunk is large: ${mainChunk.sizeKB} KB`);
    console.log('   💡 Consider moving vendor libraries to separate chunks');
  }
  
  console.log('\n🛠️  Optimization Recommendations:');
  console.log('==================================');
  
  if (largeChunks.length > 0) {
    console.log('1. 📦 Code Splitting:');
    console.log('   • Use React.lazy() for route components');
    console.log('   • Split vendor libraries into separate chunks');
    console.log('   • Implement dynamic imports for heavy components');
  }
  
  if (totalSize > 1500000) { // > 1.5MB
    console.log('2. 🗜️  Bundle Size Reduction:');
    console.log('   • Tree-shake unused imports');
    console.log('   • Use specific imports instead of barrel exports');
    console.log('   • Remove unused dependencies');
  }
  
  console.log('3. ⚡ Performance Optimization:');
  console.log('   • Implement lazy loading for non-critical components');
  console.log('   • Use React.memo for expensive components');
  console.log('   • Optimize framer-motion imports');
  
  return {
    chunks,
    totalSize,
    largeChunks,
    mainChunk
  };
}

function generateOptimizationPlan(analysis) {
  console.log('\n📋 Optimization Action Plan:');
  console.log('============================');
  
  const actions = [];
  
  if (analysis.largeChunks.length > 0) {
    actions.push({
      priority: 'HIGH',
      task: 'Split large chunks',
      details: analysis.largeChunks.map(chunk => `${chunk.name} (${chunk.sizeKB} KB)`),
      impact: 'Reduce initial bundle size'
    });
  }
  
  if (analysis.mainChunk && analysis.mainChunk.sizeKB > 200) {
    actions.push({
      priority: 'HIGH',
      task: 'Optimize main chunk',
      details: [`Main bundle: ${analysis.mainChunk.sizeKB} KB`],
      impact: 'Faster initial page load'
    });
  }
  
  actions.push({
    priority: 'MEDIUM',
    task: 'Implement granular code splitting',
    details: ['Route-based splitting', 'Component-based lazy loading'],
    impact: 'Better caching and loading performance'
  });
  
  actions.push({
    priority: 'MEDIUM',
    task: 'Tree-shake dependencies',
    details: ['Audit unused imports', 'Use specific imports'],
    impact: 'Reduce bundle size'
  });
  
  actions.forEach((action, index) => {
    const priorityColor = action.priority === 'HIGH' ? '🔴' : '🟡';
    console.log(`${priorityColor} ${index + 1}. ${action.task} (${action.priority})`);
    console.log(`   📝 ${action.impact}`);
    action.details.forEach(detail => {
      console.log(`   • ${detail}`);
    });
    console.log('');
  });
  
  return actions;
}

// Specific optimization for framer-motion
function analyzeFramerMotionUsage() {
  console.log('🎭 Framer Motion Usage Analysis:');
  console.log('===============================');
  
  const componentFiles = [];
  
  function scanDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !entry.name.includes('node_modules')) {
        scanDirectory(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
        componentFiles.push(fullPath);
      }
    }
  }
  
  const srcDir = path.join(__dirname, '../src');
  if (fs.existsSync(srcDir)) {
    scanDirectory(srcDir);
  }
  
  let framerUsageCount = 0;
  const heavyUsageFiles = [];
  
  componentFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const framerImports = content.match(/from ['"]framer-motion['"]/g);
      const motionUsage = content.match(/motion\./g);
      
      if (framerImports || motionUsage) {
        framerUsageCount++;
        const motionCount = (motionUsage || []).length;
        
        if (motionCount > 5) {
          heavyUsageFiles.push({
            file: path.relative(srcDir, file),
            motionCount
          });
        }
      }
    } catch (error) {
      // Skip files that can't be read
    }
  });
  
  console.log(`📊 Framer Motion used in ${framerUsageCount} files`);
  
  if (heavyUsageFiles.length > 0) {
    console.log('⚠️  Heavy usage detected in:');
    heavyUsageFiles.forEach(usage => {
      console.log(`   • ${usage.file} (${usage.motionCount} motion elements)`);
    });
    
    console.log('\n💡 Optimization suggestions:');
    console.log('   • Use specific imports: import { motion } from "framer-motion"');
    console.log('   • Consider using CSS animations for simple transitions');
    console.log('   • Lazy load motion components when not immediately visible');
  }
  
  return {
    usageCount: framerUsageCount,
    heavyUsageFiles
  };
}

function main() {
  console.log('🚀 Portfolio Bundle Optimization Analysis\n');
  console.log('=========================================\n');
  
  try {
    const analysis = analyzeChunks();
    generateOptimizationPlan(analysis);
    analyzeFramerMotionUsage();
    
    console.log('✨ Analysis complete!\n');
    console.log('📖 Next Steps:');
    console.log('1. Implement code splitting for large chunks');
    console.log('2. Optimize framer-motion imports');
    console.log('3. Tree-shake unused dependencies');
    console.log('4. Run performance tests after changes');
    
  } catch (error) {
    console.error('❌ Bundle analysis failed:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  analyzeChunks,
  generateOptimizationPlan,
  analyzeFramerMotionUsage
};

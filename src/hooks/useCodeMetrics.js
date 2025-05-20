// src/hooks/useCodeMetrics.js
import { useMemo } from 'react';

/**
 * Custom hook for calculating code metrics and complexity
 * Analyzes code snippets based on language
 */
const useCodeMetrics = () => {
  // Function to calculate the complexity, code metrics based on language
  const calculateCodeMetrics = (code, language) => {
    if (!code) return null;
    
    const lines = code.split('\n');
    const nonEmptyLines = lines.filter(line => line.trim().length > 0);
    const commentRegex = language === 'python' 
      ? /#.*$|'''[\s\S]*?'''|"""[\s\S]*?"""/gm  // Python comments
      : /\/\/.*$|\/\*[\s\S]*?\*\//gm;           // C-style comments
    
    const codeWithoutComments = code.replace(commentRegex, '');
    const commentLines = code.match(commentRegex)?.length || 0;
    
    // Basic metrics that work for all languages
    const metrics = {
      totalLines: lines.length,
      codeLines: nonEmptyLines.length - commentLines,
      commentLines,
      commentPercentage: Math.round((commentLines / nonEmptyLines.length) * 100) || 0,
      charactersPerLine: Math.round(code.length / lines.length) || 0,
    };
    
    // Calculate language-specific metrics
    if (language === 'javascript' || language === 'typescript') {
      metrics.functions = (code.match(/function\s+\w+\s*\(|const\s+\w+\s*=\s*\(|=>\s*{/g) || []).length;
      metrics.variables = (code.match(/const\s+\w+|let\s+\w+|var\s+\w+/g) || []).length;
      metrics.conditionals = (code.match(/if\s*\(|else\s*{|switch\s*\(/g) || []).length;
      metrics.loops = (code.match(/for\s*\(|while\s*\(|forEach\s*\(/g) || []).length;
    } else if (language === 'python') {
      metrics.functions = (code.match(/def\s+\w+\s*\(/g) || []).length;
      metrics.classes = (code.match(/class\s+\w+/g) || []).length;
      metrics.conditionals = (code.match(/if\s+|elif\s+|else:/g) || []).length;
      metrics.loops = (code.match(/for\s+|while\s+/g) || []).length;
    } else if (language === 'java' || language === 'csharp') {
      metrics.functions = (code.match(/\w+\s+\w+\s*\([^)]*\)\s*{/g) || []).length;
      metrics.classes = (code.match(/class\s+\w+/g) || []).length;
      metrics.conditionals = (code.match(/if\s*\(|else\s*{|switch\s*\(/g) || []).length;
      metrics.loops = (code.match(/for\s*\(|while\s*\(|foreach\s*\(/g) || []).length;
    }
    
    // Calculate complexity
    const complexity = calculateComplexity(code, language, metrics);
    metrics.complexity = complexity;
    
    // Calculate maintenance score (0-100, higher is better)
    const commentRatio = metrics.commentLines / Math.max(metrics.codeLines, 1);
    const idealCommentRatio = 0.2; // 20% of the code should be comments
    const commentScore = Math.min(100, (commentRatio / idealCommentRatio) * 100);
    
    // Factor in complexity (inverse relationship - higher complexity, lower score)
    const complexityFactor = Math.max(0, 100 - (complexity * 5));
    
    // Calculate final maintainability score (weighted average)
    metrics.maintainability = Math.round((commentScore * 0.3) + (complexityFactor * 0.7));
    
    return metrics;
  };
  
  // Calculate code complexity based on various factors
  const calculateComplexity = (code, language, metrics) => {
    let complexity = 0;
    
    // Base complexity from conditional statements and loops
    complexity += (metrics.conditionals || 0) * 2;
    complexity += (metrics.loops || 0) * 2;
    
    // Nesting level increases complexity
    const lines = code.split('\n');
    let maxIndentation = 0;
    
    for (const line of lines) {
      if (line.trim() === '') continue;
      
      // Calculate indentation level
      const indentation = line.length - line.trimStart().length;
      const indentLevel = Math.floor(indentation / (language === 'python' ? 4 : 2));
      maxIndentation = Math.max(maxIndentation, indentLevel);
    }
    
    complexity += maxIndentation * 1.5;
    
    // Long functions increase complexity
    if (metrics.functions > 0) {
      const avgLinesPerFunction = metrics.codeLines / metrics.functions;
      if (avgLinesPerFunction > 15) {
        complexity += (avgLinesPerFunction - 15) * 0.1;
      }
    }
    
    // Long lines increase complexity
    if (metrics.charactersPerLine > 80) {
      complexity += (metrics.charactersPerLine - 80) * 0.05;
    }
    
    return Math.round(complexity);
  };
  
  return useMemo(() => {
    return {
      calculateCodeMetrics,
    };
  }, []);
};

export default useCodeMetrics;
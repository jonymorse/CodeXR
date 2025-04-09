/**
 * General Utilities
 * 
 * This module provides general utility functions used throughout the application.
 */

// Generate a unique ID
export function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Debounce function to limit how often a function can be called
export function debounce(func, wait = 300) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function to limit how often a function can be called
export function throttle(func, limit = 300) {
  let inThrottle;
  
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// Format code by adding indentation
export function formatCode(code, language) {
  // This is a very simple formatter
  // In a real application, you would use a proper code formatter like Prettier
  
  if (!code) return '';
  
  let formatted = code;
  
  // Simple HTML formatting
  if (language === 'html') {
    const indentSize = 2;
    let indent = 0;
    let result = '';
    
    const lines = code.split('\n');
    
    for (let line of lines) {
      line = line.trim();
      
      // Check for closing tags
      if (line.match(/^<\/[^>]+>$/)) {
        indent -= indentSize;
      }
      
      // Add the line with proper indentation
      if (line.length > 0) {
        result += ' '.repeat(indent) + line + '\n';
      } else {
        result += '\n';
      }
      
      // Check for opening tags
      if (line.match(/^<[^\/][^>]*>$/) && !line.match(/\/>/)) {
        indent += indentSize;
      }
    }
    
    formatted = result;
  }
  
  return formatted;
}

// Parse and validate JSON
export function parseJSON(jsonString, fallback = null) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return fallback;
  }
}

// Sanitize HTML to prevent XSS attacks
export function sanitizeHTML(html) {
  const temp = document.createElement('div');
  temp.textContent = html;
  return temp.innerHTML;
}

// Detect mobile devices
export function isMobileDevice() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // Check for mobile devices
  if (
    /android/i.test(userAgent) ||
    /iPad|iPhone|iPod/.test(userAgent) ||
    (window.matchMedia && window.matchMedia('(max-width: 767px)').matches)
  ) {
    return true;
  }
  
  return false;
}

// Save data to local storage
export function saveToLocalStorage(key, data) {
  try {
    const serialized = typeof data === 'object' ? JSON.stringify(data) : data;
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
}

// Load data from local storage
export function loadFromLocalStorage(key, fallback = null) {
  try {
    const item = localStorage.getItem(key);
    
    if (item === null) {
      return fallback;
    }
    
    // Try to parse as JSON, if it fails return as is
    try {
      return JSON.parse(item);
    } catch (e) {
      return item;
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return fallback;
  }
}

// Copy text to clipboard
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      return successful;
    }
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
}

// Create a download link for a file
export function createDownloadLink(content, filename, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  return {
    link,
    click: () => {
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 100);
    },
    url
  };
}

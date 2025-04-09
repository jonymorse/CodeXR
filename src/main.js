import './styles/main.css';
import './styles/project.css';
import { initializeXRScene } from './components/xr/scene';
import { initializeCodeEditors } from './components/codeEditor/editors';
import { initializeLLMInterface } from './components/llm/interface';
import { initializePreview } from './components/preview/preview';
import { initializeDeployment } from './services/deployment/github';
import { initializeProjectManager } from './components/projects/projectManager';
import { isXRSupported, isXRSessionSupported, detectXRDevice } from './utils/xrUtils';

// Global state for the application
const appState = {
  currentProject: {
    html: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My XR Web App</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>',
    css: 'body {\n  font-family: Arial, sans-serif;\n  margin: 20px;\n}\n\nh1 {\n  color: blue;\n}',
    js: 'document.addEventListener("DOMContentLoaded", function() {\n  console.log("App loaded!");\n});'
  },
  xrSessionActive: false,
  editorVisible: true,
  previewVisible: true,
  llmVisible: true
};

// Initialize application components
document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing CodeCrafter XR...');
  
  // Hide fallback content when components are ready
  const fallbackContent = document.getElementById('fallback-content');
  if (fallbackContent) {
    fallbackContent.style.display = 'none';
  }
  
  // Hide loading screen when components are ready
  const loadingScreen = document.getElementById('loading-screen');
  
  // Check for WebXR support
  if (!isXRSupported()) {
    console.warn('WebXR not supported by this browser');
    showError('WebXR not supported', 'Your browser does not support WebXR. Please try using a compatible browser like Chrome or Edge on a VR-ready device.');
    return;
  }
  
  // Initialize all components
  Promise.all([
    initializeProjectManager(appState),
    initializeXRScene(appState),
    initializeCodeEditors(appState),
    initializeLLMInterface(appState),
    initializePreview(appState),
    initializeDeployment(appState)
  ]).then(() => {
    console.log('All components initialized');
    loadingScreen.style.display = 'none';
  }).catch(error => {
    console.error('Error initializing components:', error);
    showError('Initialization Error', error.message);
  });
});

// Display error message
function showError(title, message) {
  // Hide loading screen
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.style.display = 'none';
  }
  
  // Show fallback content with error
  const fallbackContent = document.getElementById('fallback-content');
  if (fallbackContent) {
    fallbackContent.style.display = 'flex';
    
    // Update content with error message
    const heading = fallbackContent.querySelector('h1');
    if (heading) heading.textContent = title || 'Error';
    
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
      loadingIndicator.style.color = '#ec4c47';
      loadingIndicator.textContent = message || 'An unknown error occurred';
    }
  }
}

// Export the app state for access from other modules
export { appState };

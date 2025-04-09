/**
 * XR Scene Initialization and Management
 * 
 * This module handles the WebXR environment setup using A-Frame.
 * It creates the 3D workspace where code blocks and panels will be positioned.
 */

// Import A-Frame with a try-catch to handle potential issues
let aframeLoaded = false;
try {
  require('aframe');
  aframeLoaded = true;
  console.log('A-Frame loaded successfully');
} catch (error) {
  console.error('Error loading A-Frame:', error);
}

// Initialize the WebXR scene
export function initializeXRScene(appState) {
  return new Promise((resolve, reject) => {
    try {
      // Check if A-Frame loaded correctly
      if (!aframeLoaded) {
        throw new Error('A-Frame failed to load properly');
      }
      
      // Create A-Frame scene element
      const sceneEl = document.createElement('a-scene');
      sceneEl.setAttribute('background', 'color: #1e1e1e');
      sceneEl.setAttribute('webxr', '');
      sceneEl.setAttribute('vr-mode-ui', 'enabled: true');
      
      // Add entities to the scene
      
      // Environment - a simple grid
      const grid = document.createElement('a-grid');
      grid.setAttribute('position', '0 0 0');
      grid.setAttribute('rotation', '-90 0 0');
      grid.setAttribute('width', '20');
      grid.setAttribute('height', '20');
      grid.setAttribute('color', '#333333');
      sceneEl.appendChild(grid);
      
      // Lighting
      const light = document.createElement('a-light');
      light.setAttribute('type', 'ambient');
      light.setAttribute('intensity', '0.5');
      light.setAttribute('color', '#ffffff');
      sceneEl.appendChild(light);
      
      const directionalLight = document.createElement('a-light');
      directionalLight.setAttribute('type', 'directional');
      directionalLight.setAttribute('position', '1 1 1');
      directionalLight.setAttribute('intensity', '0.7');
      directionalLight.setAttribute('color', '#ffffff');
      sceneEl.appendChild(directionalLight);
      
      // User "hands" for interaction
      const leftHand = document.createElement('a-entity');
      leftHand.setAttribute('id', 'leftHand');
      leftHand.setAttribute('oculus-touch-controls', 'hand: left');
      sceneEl.appendChild(leftHand);
      
      const rightHand = document.createElement('a-entity');
      rightHand.setAttribute('id', 'rightHand');
      rightHand.setAttribute('oculus-touch-controls', 'hand: right');
      rightHand.setAttribute('laser-controls', '');
      rightHand.setAttribute('raycaster', 'objects: .interactive');
      sceneEl.appendChild(rightHand);
      
      // Mount the scene to the app container
      const appContainer = document.getElementById('app');
      appContainer.appendChild(sceneEl);
      
      // Event handlers for XR session state
      sceneEl.addEventListener('enter-vr', () => {
        console.log('Entered VR mode');
        appState.xrSessionActive = true;
        document.body.classList.add('xr-active');
      });
      
      sceneEl.addEventListener('exit-vr', () => {
        console.log('Exited VR mode');
        appState.xrSessionActive = false;
        document.body.classList.remove('xr-active');
      });
      
      // Create DOM overlay for UI in XR
      createDOMOverlay(sceneEl);
      
      // Once the scene is loaded, resolve the promise
      sceneEl.addEventListener('loaded', () => {
        console.log('A-Frame scene loaded');
        resolve(sceneEl);
      });
    } catch (error) {
      console.error('Error initializing XR scene:', error);
      reject(error);
    }
  });
}

// Create a DOM overlay for UI elements in XR
function createDOMOverlay(sceneEl) {
  // This will be used for UI elements like buttons, panels, etc.
  const overlay = document.createElement('div');
  overlay.id = 'xr-overlay';
  overlay.className = 'xr-dom-overlay';
  document.body.appendChild(overlay);
  
  // We'll use this overlay for UI elements that need to be shown in XR
  // Will be populated by other components
}

// Create a code panel for XR
export function createCodePanel(type, position, rotation, content) {
  const panel = document.createElement('a-entity');
  panel.setAttribute('id', `${type}-panel`);
  panel.setAttribute('position', position);
  panel.setAttribute('rotation', rotation);
  panel.setAttribute('class', 'interactive code-panel');
  
  // Create panel background
  const background = document.createElement('a-plane');
  background.setAttribute('width', '1');
  background.setAttribute('height', '0.7');
  background.setAttribute('color', '#2d2d2d');
  panel.appendChild(background);
  
  // Create title for the panel
  const title = document.createElement('a-text');
  title.setAttribute('value', type.toUpperCase());
  title.setAttribute('position', '0 0.3 0.01');
  title.setAttribute('align', 'center');
  title.setAttribute('color', '#4a86e8');
  title.setAttribute('scale', '0.1 0.1 0.1');
  panel.appendChild(title);
  
  // We'll use a HTML element for the actual code editor
  // This will be handled by the code editor component
  
  return panel;
}

// Utility to convert between world and local coordinates
export function convertCoordinates(fromEl, toEl, position) {
  // This is a placeholder. In a real implementation,
  // we would need to calculate world transform properly
  return position;
}

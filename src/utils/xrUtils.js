/**
 * XR Utilities
 * 
 * This module provides helper functions for working with WebXR.
 */

// Check if WebXR is supported
export function isXRSupported() {
  return navigator.xr !== undefined;
}

// Check if a specific XR session mode is supported
export async function isXRSessionSupported(mode = 'immersive-vr') {
  if (!isXRSupported()) {
    return false;
  }
  
  try {
    return await navigator.xr.isSessionSupported(mode);
  } catch (error) {
    console.error('Error checking XR session support:', error);
    return false;
  }
}

// Check if a device is likely to support WebXR
export function detectXRDevice() {
  const userAgent = navigator.userAgent;
  
  // Check for known VR/AR headsets
  if (
    userAgent.includes('OculusBrowser') || 
    userAgent.includes('SamsungBrowser VR') ||
    userAgent.includes('Windows Mixed Reality') ||
    userAgent.includes('HTC_VR') ||
    userAgent.includes('VRGlass')
  ) {
    return {
      supported: true,
      type: 'dedicated-headset',
      notes: 'Dedicated VR/AR headset detected'
    };
  }
  
  // Check for mobile devices that might support WebXR
  if (
    /Android/i.test(userAgent) || 
    /iPhone|iPad|iPod/i.test(userAgent)
  ) {
    return {
      supported: true,
      type: 'mobile',
      notes: 'Mobile device detected, WebXR may be supported'
    };
  }
  
  // Default case - desktop browsers might support WebXR with attached headsets
  return {
    supported: true,
    type: 'desktop',
    notes: 'Desktop device detected, WebXR may be supported with attached headsets'
  };
}

// Handle XR mode transitions
export function handleXRModeChange(isActive, callback) {
  if (isActive) {
    // Add XR active class to body
    document.body.classList.add('xr-active');
  } else {
    // Remove XR active class from body
    document.body.classList.remove('xr-active');
  }
  
  // Call the provided callback if any
  if (typeof callback === 'function') {
    callback(isActive);
  }
}

// Convert between screen and XR coordinates
export function convertScreenToXRCoordinates(x, y, z = -1) {
  // This is a simplified conversion - in a real app, 
  // you would need proper matrix transformations
  
  // Get viewport dimensions
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  // Convert to normalized device coordinates (-1 to 1)
  const ndcX = (x / width) * 2 - 1;
  const ndcY = 1 - (y / height) * 2;  // Y is inverted in WebGL
  
  // Convert to XR coordinates
  // This is very simplified and would need to account for the actual XR view
  const xrX = ndcX;
  const xrY = ndcY;
  const xrZ = z;
  
  return { x: xrX, y: xrY, z: xrZ };
}

// Helper to create text labels in XR
export function createXRTextLabel(text, position, color = '#ffffff', scale = 0.1) {
  const entity = document.createElement('a-entity');
  entity.setAttribute('text', `value: ${text}; color: ${color}; align: center;`);
  entity.setAttribute('position', position);
  entity.setAttribute('scale', `${scale} ${scale} ${scale}`);
  
  return entity;
}

// Helper to create interactive buttons in XR
export function createXRButton(text, position, size = { width: 0.3, height: 0.1 }, color = '#4a86e8', onClick) {
  const entity = document.createElement('a-entity');
  entity.setAttribute('position', position);
  
  const background = document.createElement('a-plane');
  background.setAttribute('width', size.width);
  background.setAttribute('height', size.height);
  background.setAttribute('color', color);
  background.setAttribute('class', 'interactive');
  
  // Add hover effects
  background.setAttribute('event-set__mouseenter', 'color: #6d9eeb');
  background.setAttribute('event-set__mouseleave', `color: ${color}`);
  
  const label = document.createElement('a-text');
  label.setAttribute('value', text);
  label.setAttribute('position', '0 0 0.01');
  label.setAttribute('align', 'center');
  label.setAttribute('color', '#ffffff');
  label.setAttribute('scale', '0.05 0.05 0.05');
  
  background.appendChild(label);
  entity.appendChild(background);
  
  // Add click handler if provided
  if (typeof onClick === 'function') {
    background.addEventListener('click', onClick);
  }
  
  return entity;
}

// Check for controller support
export function detectControllers() {
  // Check for available input sources
  if (navigator.xr && navigator.xr.session) {
    const inputSources = navigator.xr.session.inputSources;
    if (inputSources && inputSources.length > 0) {
      return true;
    }
  }
  
  // Fallback detection based on user agent
  const userAgent = navigator.userAgent;
  if (
    userAgent.includes('OculusBrowser') || 
    userAgent.includes('Windows Mixed Reality') ||
    userAgent.includes('HTC_VR')
  ) {
    return true;
  }
  
  return false;
}

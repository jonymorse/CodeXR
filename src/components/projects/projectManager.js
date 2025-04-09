/**
 * Project Manager Component
 * 
 * This module handles the creation, loading, and saving of projects.
 */

import { generateId, saveToLocalStorage, loadFromLocalStorage } from '../../utils/generalUtils';

// Default project template
const DEFAULT_PROJECT = {
  id: null,
  name: 'New Project',
  created: null,
  modified: null,
  html: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My XR Web App</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>',
  css: 'body {\n  font-family: Arial, sans-serif;\n  margin: 20px;\n}\n\nh1 {\n  color: blue;\n}',
  js: 'document.addEventListener("DOMContentLoaded", function() {\n  console.log("App loaded!");\n});'
};

// Initialize the project manager
export function initializeProjectManager(appState) {
  return new Promise((resolve) => {
    console.log('Initializing project manager...');
    
    // Create UI for desktop
    createProjectUI(appState);
    
    // Load last project or create a new one
    const lastProject = loadFromLocalStorage('codecrafter-current-project');
    if (lastProject) {
      loadProject(lastProject, appState);
    } else {
      createNewProject(appState);
    }
    
    resolve();
  });
}

// Create project management UI
function createProjectUI(appState) {
  const header = document.createElement('div');
  header.id = 'project-header';
  header.className = 'desktop-only';
  
  const logo = document.createElement('div');
  logo.className = 'logo';
  logo.textContent = 'CodeCrafter XR';
  
  const projectControls = document.createElement('div');
  projectControls.className = 'project-controls';
  
  // Project name display and edit
  const projectName = document.createElement('div');
  projectName.className = 'project-name';
  projectName.contentEditable = true;
  projectName.textContent = appState.currentProject?.name || 'New Project';
  projectName.addEventListener('blur', () => {
    if (appState.currentProject) {
      appState.currentProject.name = projectName.textContent;
      appState.currentProject.modified = new Date().toISOString();
      saveProject(appState.currentProject);
    }
  });
  
  // Project actions
  const actions = document.createElement('div');
  actions.className = 'project-actions';
  
  const newBtn = document.createElement('button');
  newBtn.textContent = 'New';
  newBtn.className = 'action-button';
  newBtn.onclick = () => createNewProject(appState);
  
  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';
  saveBtn.className = 'action-button';
  saveBtn.onclick = () => saveProject(appState.currentProject);
  
  const loadBtn = document.createElement('button');
  loadBtn.textContent = 'Load';
  loadBtn.className = 'action-button';
  loadBtn.onclick = () => showProjectList(appState);
  
  actions.appendChild(newBtn);
  actions.appendChild(saveBtn);
  actions.appendChild(loadBtn);
  
  projectControls.appendChild(projectName);
  projectControls.appendChild(actions);
  
  header.appendChild(logo);
  header.appendChild(projectControls);
  
  document.body.prepend(header);
}

// Create a new project
export function createNewProject(appState) {
  // Create a fresh project based on the default template
  const newProject = { 
    ...DEFAULT_PROJECT,
    id: generateId('project'),
    name: 'New Project',
    created: new Date().toISOString(),
    modified: new Date().toISOString()
  };
  
  // Update app state with the new project
  appState.currentProject = newProject;
  
  // Save the new project
  saveProject(newProject);
  
  // Update UI
  const projectName = document.querySelector('.project-name');
  if (projectName) {
    projectName.textContent = newProject.name;
  }
  
  // Publish event that project has changed
  const event = new CustomEvent('project-changed', {
    detail: { project: newProject }
  });
  window.dispatchEvent(event);
  
  return newProject;
}

// Save the current project
export function saveProject(project) {
  if (!project) return false;
  
  try {
    // Update timestamp
    project.modified = new Date().toISOString();
    
    // Save to local storage
    saveToLocalStorage('codecrafter-current-project', project);
    
    // Get saved projects list
    const savedProjects = loadFromLocalStorage('codecrafter-projects', []);
    
    // Check if project already exists in the list
    const existingIndex = savedProjects.findIndex(p => p.id === project.id);
    if (existingIndex >= 0) {
      // Update existing project
      savedProjects[existingIndex] = project;
    } else {
      // Add new project to list
      savedProjects.push(project);
    }
    
    // Save updated project list
    saveToLocalStorage('codecrafter-projects', savedProjects);
    
    console.log(`Project "${project.name}" saved successfully`);
    return true;
  } catch (error) {
    console.error('Error saving project:', error);
    return false;
  }
}

// Load a project
export function loadProject(project, appState) {
  if (!project) return false;
  
  try {
    // Update app state with the loaded project
    appState.currentProject = project;
    
    // Save as current project
    saveToLocalStorage('codecrafter-current-project', project);
    
    // Update UI
    const projectName = document.querySelector('.project-name');
    if (projectName) {
      projectName.textContent = project.name;
    }
    
    // Publish event that project has changed
    const event = new CustomEvent('project-changed', {
      detail: { project }
    });
    window.dispatchEvent(event);
    
    console.log(`Project "${project.name}" loaded successfully`);
    return true;
  } catch (error) {
    console.error('Error loading project:', error);
    return false;
  }
}

// Show a list of saved projects
function showProjectList(appState) {
  // Get saved projects
  const savedProjects = loadFromLocalStorage('codecrafter-projects', []);
  
  if (savedProjects.length === 0) {
    alert('No saved projects found');
    return;
  }
  
  // Create modal for project list
  const modal = document.createElement('div');
  modal.className = 'modal';
  
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  
  const modalHeader = document.createElement('div');
  modalHeader.className = 'modal-header';
  modalHeader.textContent = 'Load Project';
  
  const closeBtn = document.createElement('span');
  closeBtn.className = 'close-button';
  closeBtn.innerHTML = '&times;';
  closeBtn.onclick = () => {
    document.body.removeChild(modal);
  };
  
  modalHeader.appendChild(closeBtn);
  modalContent.appendChild(modalHeader);
  
  // Create project list
  const projectList = document.createElement('div');
  projectList.className = 'project-list';
  
  savedProjects.forEach(project => {
    const projectItem = document.createElement('div');
    projectItem.className = 'project-item';
    
    const projectInfo = document.createElement('div');
    projectInfo.className = 'project-info';
    
    const itemName = document.createElement('div');
    itemName.className = 'item-name';
    itemName.textContent = project.name;
    
    const itemDate = document.createElement('div');
    itemDate.className = 'item-date';
    itemDate.textContent = new Date(project.modified).toLocaleString();
    
    projectInfo.appendChild(itemName);
    projectInfo.appendChild(itemDate);
    
    const projectActions = document.createElement('div');
    projectActions.className = 'project-item-actions';
    
    const loadBtn = document.createElement('button');
    loadBtn.textContent = 'Load';
    loadBtn.onclick = () => {
      loadProject(project, appState);
      document.body.removeChild(modal);
    };
    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => {
      if (confirm(`Are you sure you want to delete "${project.name}"?`)) {
        deleteProject(project.id);
        projectList.removeChild(projectItem);
        
        if (projectList.children.length === 0) {
          document.body.removeChild(modal);
        }
      }
    };
    
    projectActions.appendChild(loadBtn);
    projectActions.appendChild(deleteBtn);
    
    projectItem.appendChild(projectInfo);
    projectItem.appendChild(projectActions);
    
    projectList.appendChild(projectItem);
  });
  
  modalContent.appendChild(projectList);
  modal.appendChild(modalContent);
  
  document.body.appendChild(modal);
}

// Delete a project
function deleteProject(projectId) {
  if (!projectId) return false;
  
  try {
    // Get saved projects
    const savedProjects = loadFromLocalStorage('codecrafter-projects', []);
    
    // Filter out the project to delete
    const updatedProjects = savedProjects.filter(project => project.id !== projectId);
    
    // Save updated list
    saveToLocalStorage('codecrafter-projects', updatedProjects);
    
    console.log(`Project with ID "${projectId}" deleted successfully`);
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    return false;
  }
}

// Export project as a file
export function exportProject(project) {
  if (!project) return null;
  
  const projectData = JSON.stringify(project, null, 2);
  const blob = new Blob([projectData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${project.name.replace(/\s+/g, '-').toLowerCase()}.ccxr.json`;
  link.click();
  
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

// Import project from a file
export function importProject(file, appState) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = event => {
      try {
        const projectData = JSON.parse(event.target.result);
        
        // Validate project data
        if (!projectData.html || !projectData.css || !projectData.js) {
          reject(new Error('Invalid project file format'));
          return;
        }
        
        // Ensure project has required fields
        const project = {
          ...projectData,
          id: projectData.id || generateId('project'),
          created: projectData.created || new Date().toISOString(),
          modified: new Date().toISOString()
        };
        
        // Load the imported project
        loadProject(project, appState);
        
        resolve(project);
      } catch (error) {
        console.error('Error importing project:', error);
        reject(new Error('Failed to parse project file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read project file'));
    };
    
    reader.readAsText(file);
  });
}

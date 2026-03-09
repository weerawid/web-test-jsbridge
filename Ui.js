/**
 * UI Module
 * Handles all UI interactions and utilities
 */

/**
 * Show modal with message
 * @param {string} message - Message to display
 * @param {string} type - Type: 'success', 'error', 'warning'
 */
function showModal(message, type = 'info') {
  const modal = document.getElementById('myModal');
  const modalText = document.getElementById('modalText');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');

  // Set title based on type
  const titles = {
    success: '✓ Success',
    error: '✗ Error',
    warning: '⚠ Warning',
    info: 'ℹ Info',
  };
  modalTitle.textContent = titles[type] || 'Response';

  // Display text and hide image
  modalText.innerText = message.substring(0, 500);
  modalText.style.display = 'block';
  modalImage.style.display = 'none';

  // Show modal
  modal.classList.add('active');
}

/**
 * Show modal with image
 * @param {string} base64 - Base64 image data
 */
function showModalImage(base64) {
  const modal = document.getElementById('myModal');
  const modalImage = document.getElementById('modalImage');
  const modalText = document.getElementById('modalText');
  const modalTitle = document.getElementById('modalTitle');

  modalTitle.textContent = 'Image Preview';
  modalImage.src = `data:image/*;base64,${base64}`;
  modalImage.style.display = 'block';
  modalText.style.display = 'none';

  modal.classList.add('active');
}

/**
 * Close modal
 */
function closeModal() {
  const modal = document.getElementById('myModal');
  modal.classList.remove('active');
}

/**
 * Update datalist options
 * @param {string} datalistId - Datalist ID
 * @param {Array} list - List of values
 */
function updateDatalist(datalistId, list) {
  const suggestions = document.getElementById(datalistId);
  suggestions.innerHTML = '';
  list.forEach((value) => {
    const option = document.createElement('option');
    option.value = value;
    suggestions.appendChild(option);
  });
}

/**
 * Get datalist values
 * @param {string} datalistId - Datalist ID
 * @returns {Array} Array of values
 */
function getDatalistValues(datalistId) {
  const datalist = document.getElementById(datalistId);
  const options = Array.from(datalist.options).map((option) => option.value);
  return options;
}

/**
 * Check if value is in datalist
 * @param {Array} list - List to check
 * @param {string} value - Value to find
 * @returns {boolean} True if NOT found (for adding)
 */
function isValueInDatalist(list, value) {
  return !list.includes(value);
}

/**
 * Add input field for custom parameters
 */
function addInputField() {
  const newDiv = document.createElement('div');
  newDiv.classList.add('input-field-item');

  const inputName = document.createElement('input');
  inputName.name = 'paramName';
  inputName.type = 'text';
  inputName.placeholder = 'Param Name';
  inputName.className = 'form-input';

  const inputValue = document.createElement('input');
  inputValue.name = 'paramValue';
  inputValue.type = 'text';
  inputValue.placeholder = 'Param Value';
  inputValue.className = 'form-input';

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.textContent = 'Remove';
  removeButton.className = 'btn btn-small';
  removeButton.style.backgroundColor = '#e53935';
  removeButton.style.color = 'white';
  removeButton.onclick = function () {
    newDiv.remove();
  };

  newDiv.appendChild(inputName);
  newDiv.appendChild(inputValue);
  newDiv.appendChild(removeButton);
  document.getElementById('inputFieldsContainer').appendChild(newDiv);
}

/**
 * Get data from custom input fields
 * @returns {Array} Array of {key, value} objects
 */
function getDataFromInputs() {
  const inputContainer = document.getElementById('inputFieldsContainer');
  const paramNames = inputContainer.querySelectorAll('[name="paramName"]');
  const paramValues = inputContainer.querySelectorAll('[name="paramValue"]');

  if (paramNames.length !== paramValues.length) {
    console.error('Parameter count mismatch');
    return [];
  }

  const keyValuePairs = Array.from(paramNames).map((paramName, index) => {
    return {
      key: paramName.value,
      value: paramValues[index].value,
    };
  });

  return keyValuePairs;
}

/**
 * Clear session storage
 */
function clearSession() {
  sessionStorage.clear();
  onRefresh();
  showModal('Session cleared', 'success');
}

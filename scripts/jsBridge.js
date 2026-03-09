/**
 * JSBridge Core Module
 * Handles communication between JavaScript and native code
 */

// Initialize bridge object
window.bridge = {};
let arrayListCallbackName = {};

/**
 * Main function to send messages to native bridge
 * @param {string} funcName - Function name to call
 * @param {Array} msg - Array of {key, value} objects
 */
function sendBridge(funcName, msg) {
  const functionName = funcName;
  const message = msg;

  if (window.JSBridge) {
    // Android JSBridge
    callNativeFunction(functionName, message);
  } else if (window.webkit) {
    // iOS WebKit
    const iosFunction = { name: functionName };
    message.forEach((i) => {
      iosFunction[i.key] = i.value;
    });
    window.webkit.messageHandlers.observer.postMessage(iosFunction);
  } else {
    // No bridge available
    const value = { name: functionName };
    message.forEach((i) => {
      value[i.key] = i.value;
    });
    showModal(
      `Bridge not available\n\nFunction: ${functionName}\nData: ${JSON.stringify(value)}`,
      'error'
    );
  }
}

/**
 * Call native function for Android
 * @param {string} functionName - Function name
 * @param {Array} message - Parameters
 */
function callNativeFunction(functionName, message) {
  if (
    window.JSBridge &&
    typeof window.JSBridge[functionName] === 'function'
  ) {
    const jsonObj = {};
    (message || []).forEach((item) => {
      jsonObj[item.key] = item.value;
    });
    window.JSBridge[functionName](jsonObj);
  } else {
    console.error(`Function ${functionName} not found in JSBridge interface.`);
  }
}

/**
 * Clear registered callbacks
 */
function clearCallback() {
  if (
    Object.keys(arrayListCallbackName).length !== 0 &&
    arrayListCallbackName['functionName']
  ) {
    delete window[arrayListCallbackName['functionName']];
  }
  arrayListCallbackName = {};
}

/**
 * Convert image to Base64
 * @param {Image} img - Image element
 * @returns {string} Base64 data URL
 */
function getBase64Image(img) {
  if (!img || !img.complete || img.naturalWidth === 0) {
    console.error('Invalid or broken image');
    return null;
  }

  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const dataURL = canvas.toDataURL('image/png');
  return dataURL
    .replace(/^data:image\/?[A-z]*;base64,/)
    .replace('undefined', '');
}

/**
 * ===== BRIDGE FUNCTIONS =====
 */

/**
 * Get image from camera
 */
function getCameraImage() {
  sendBridge('getCameraImage', []);
  if (window.bridge) {
    window.bridge.getCameraImageCallback = (base64Image) => {
      showModalImage(base64Image);
    };
    window.bridge.getCameraImageCallbackError = (errorCode, errorDescription) => {
      showModal(
        `Camera Error: ${errorCode}\n${errorDescription}`,
        'error'
      );
    };
  }
}

/**
 * Get image from gallery
 */
function getGalleryImage() {
  sendBridge('getGalleryImage', []);
  if (window.bridge) {
    window.bridge.getGalleryImageCallback = (base64Image) => {
      showModalImage(base64Image);
    };
    window.bridge.getGalleryImageCallbackError = (errorCode, errorDescription) => {
      showModal(
        `Gallery Error: ${errorCode}\n${errorDescription}`,
        'error'
      );
    };
  }
}

/**
 * Save image to gallery
 */
function saveImageToGallery() {
  const imgElement = new Image();
  imgElement.crossOrigin = 'Anonymous';
  imgElement.src = document
    .querySelector('input[name=saveImageToGalleryRadio]:checked')
    .parentElement.querySelector('img').src;

  imgElement.onload = function () {
    const base64 = getBase64Image(imgElement);
    sendBridge('saveImageToGallery', [
      {
        key: 'base64Str',
        value: base64,
      },
    ]);
  };

  if (window.bridge) {
    window.bridge.saveImageToGalleryCallback = (data) => {
      showModal(`Image saved: ${data}`, 'success');
    };
    window.bridge.saveImageToGalleryCallbackError = (errorCode, errorDescription) => {
      showModal(
        `Save Error: ${errorCode}\n${errorDescription}`,
        'error'
      );
    };
  }
}

/**
 * Share image
 */
function shareImage() {
  const imgElement = new Image();
  imgElement.crossOrigin = 'Anonymous';
  imgElement.src = document
    .querySelector('input[name=shareImageRadio]:checked')
    .parentElement.querySelector('img').src;

  imgElement.onload = function () {
    const base64 = getBase64Image(imgElement);
    sendBridge('shareImage', [
      {
        key: 'base64Str',
        value: base64,
      },
    ]);
  };
}

/**
 * Open payment
 */
function openPayment() {
  const txnRefId = document.getElementById('openPaymenttxnRefId').value;
  sendBridge('openPayment', [{ key: 'txnRefId', value: txnRefId }]);
  if (window.bridge) {
    window.bridge.openPaymentCallbackError = (errorCode, errorDescription) => {
      showModal(
        `Payment Error: ${errorCode}\n${errorDescription}`,
        'error'
      );
    };
  }
}

/**
 * Open webview
 */
function openWebview() {
  const webUrl = document.getElementById('openWebviewwebUrl').value;
  const suggestWebLink = getDatalistValues('weblink');

  if (isValueInDatalist(suggestWebLink, webUrl)) {
    suggestWebLink.push(webUrl);
    sessionStorage.setItem('weblink', JSON.stringify(suggestWebLink));
    updateDatalist('weblink', suggestWebLink);
  }

  sendBridge('openWebview', [{ key: 'webUrl', value: webUrl }]);
  if (window.bridge) {
    window.bridge.openWebviewCallbackError = (errorCode, errorDescription) => {
      showModal(
        `Webview Error: ${errorCode}\n${errorDescription}`,
        'error'
      );
    };
  }
}

/**
 * Close webview
 */
function closeWebview() {
  sendBridge('closeWebview', []);
}

/**
 * Open external browser
 */
function openExternalBrowser() {
  const webUrl = document.getElementById('openExternalBrowserwebUrl').value;
  const suggestWebLink = getDatalistValues('weblink');

  if (isValueInDatalist(suggestWebLink, webUrl)) {
    suggestWebLink.push(webUrl);
    sessionStorage.setItem('weblink', JSON.stringify(suggestWebLink));
    updateDatalist('weblink', suggestWebLink);
  }

  sendBridge('openExternalBrowser', [{ key: 'webUrl', value: webUrl }]);
  if (window.bridge) {
    window.bridge.openExternalBrowserCallbackError = (errorCode, errorDescription) => {
      showModal(
        `Browser Error: ${errorCode}\n${errorDescription}`,
        'error'
      );
    };
  }
}

/**
 * Open deep link (external)
 */
function openDeepLink() {
  const deepUrl = document.getElementById('openDeepLinkdeeplink').value;
  const suggestDeepLink = getDatalistValues('deeplink');

  if (isValueInDatalist(suggestDeepLink, deepUrl)) {
    suggestDeepLink.push(deepUrl);
    sessionStorage.setItem('deeplink', JSON.stringify(suggestDeepLink));
    updateDatalist('deeplink', suggestDeepLink);
  }

  sendBridge('openDeepLink', [{ key: 'deeplink', value: deepUrl }]);
  if (window.bridge) {
    window.bridge.openDeepLinkCallbackError = (errorCode, errorDescription) => {
      showModal(
        `Deep Link Error: ${errorCode}\n${errorDescription}`,
        'error'
      );
    };
  }
}

/**
 * Open internal deep link
 */
function openInternalDeepLink() {
  const deepUrl = document.getElementById('openInternalDeepLinkdeeplink').value;
  const suggestDeepLink = getDatalistValues('deeplink');

  if (isValueInDatalist(suggestDeepLink, deepUrl)) {
    suggestDeepLink.push(deepUrl);
    sessionStorage.setItem('deeplink', JSON.stringify(suggestDeepLink));
    updateDatalist('deeplink', suggestDeepLink);
  }

  sendBridge('openInternalDeepLink', [{ key: 'deeplink', value: deepUrl }]);
  if (window.bridge) {
    window.bridge.openInternalDeepLinkCallbackError = (errorCode, errorDescription) => {
      showModal(
        `Internal Deep Link Error: ${errorCode}\n${errorDescription}`,
        'error'
      );
    };
  }
}

/**
 * Open app route - NEW FUNCTION
 * @param {string} featureName - Feature name
 * @param {string} screenName - Screen name
 */
function openAppRoute() {
  const featureName = document.getElementById('openAppRouteFeatureName').value;
  const screenName = document.getElementById('openAppRouteScreenName').value;

  if (!featureName || !screenName) {
    showModal('Please fill in Feature Name and Screen Name', 'warning');
    return;
  }

  sendBridge('openAppRoute', [
    { key: 'featureName', value: featureName },
    { key: 'screenName', value: screenName },
  ]);

  if (window.bridge) {
    window.bridge.openAppRouteCallback = (result) => {
      showModal(`App Route opened: ${result}`, 'success');
    };
    window.bridge.openAppRouteCallbackError = (errorCode, errorDescription) => {
      showModal(
        `App Route Error: ${errorCode}\n${errorDescription}`,
        'error'
      );
    };
  }
}

/**
 * Open microsite
 */
function openMicrosite() {
  const webUrl = document.getElementById('openMicrositeweburl').value;
  const title = document.getElementById('openMicrositetitle').value;
  const providerName = document.getElementById('openMicrositeprovidername').value;

  sendBridge('openMicrosite', [
    { key: 'webUrl', value: webUrl },
    { key: 'title', value: title },
    { key: 'providerName', value: providerName },
  ]);

  sessionStorage.setItem('openMicrositeweburl', webUrl);
  sessionStorage.setItem('openMicrositetitle', title);
  sessionStorage.setItem('openMicrositeprovidername', providerName);

  if (window.bridge) {
    window.bridge.openMicrositeCallback = (result) => {
      showModal(`Microsite result: ${result}`, 'success');
    };
    window.bridge.openMicrositeCallbackError = (errorCode, errorDescription) => {
      showModal(
        `Microsite Error: ${errorCode}\n${errorDescription}`,
        'error'
      );
    };
  }
}

/**
 * Close microsite with result
 */
function closeMicrositeWithResult() {
  const result = document.getElementById('closeMicrositeWithResultresult').value;
  sendBridge('closeMicrositeWithResult', [{ key: 'result', value: result }]);
}

/**
 * Open mini app
 */
function openMiniApp() {
  const uuid = document.getElementById('openMiniAppminiAppUUID').value;
  const destination = document.getElementById('openMiniAppminiAppDestination').value;
  const param = document.getElementById('openMiniAppminiAppParams').value;

  sendBridge('openMiniApp', [
    { key: 'miniAppUUID', value: uuid },
    { key: 'miniAppDestination', value: destination },
    { key: 'miniAppParams', value: param },
  ]);

  if (window.bridge) {
    window.bridge.openMiniAppCallback = (result) => {
      showModal(`Mini App result: ${result}`, 'success');
    };
    window.bridge.openMiniAppCallbackError = (errorCode, errorDescription) => {
      showModal(
        `Mini App Error: ${errorCode}\n${errorDescription}`,
        'error'
      );
    };
  }
}

/**
 * Close mini app with result
 */
function closeMiniAppWithResult() {
  const result = document.getElementById('closeMiniAppWithResultresult').value;
  sendBridge('closeMiniAppWithResult', [{ key: 'result', value: result }]);
}

/**
 * Share text
 */
function shareText() {
  const shareText = document.getElementById('shareTextshareText').value;
  sendBridge('shareText', [{ key: 'text', value: shareText }]);
}

/**
 * Copy to clipboard
 */
function copyToClipboard() {
  const clip = document.getElementById('copyToClipboardText').value;
  sendBridge('copyToClipboard', [{ key: 'text', value: clip }]);
}

/**
 * Init authentication
 */
function internalPartnerInitAuth() {
  sendBridge('internalPartnerInitAuth', []);
  if (window.bridge) {
    window.bridge.internalPartnerInitAuthCallback = (authorizationCode) => {
      showModal(`Auth Code: ${authorizationCode}`, 'success');
    };
    window.bridge.internalPartnerInitAuthCallbackError = (errorCode, errorDescription) => {
      showModal(
        `Auth Error: ${errorCode}\n${errorDescription}`,
        'error'
      );
    };
  }
}

/**
 * Verify PIN
 */
function internalPartnerPinVerify() {
  const partnerReqId = document.getElementById(
    'internalPartnerPinVerifypartnerReqId'
  ).value;
  sendBridge('internalPartnerPinVerify', [{ key: 'partnerReqId', value: partnerReqId }]);
  if (window.bridge) {
    window.bridge.internalPartnerPinVerifyCallback = (pinVerRefId) => {
      showModal(`PIN Verified: ${pinVerRefId}`, 'success');
    };
    window.bridge.internalPartnerPinVerifyCallbackError = (errorCode, errorDescription) => {
      showModal(
        `PIN Error: ${errorCode}\n${errorDescription}`,
        'error'
      );
    };
  }
}

/**
 * GA tagging
 */
function internalPartnerGATagging() {
  const ga = document.getElementById('internalPartnerGATaggingga').value.replace(/\n/g, '');
  sendBridge('internalPartnerGATagging', [{ key: 'ga', value: ga }]);

  if (window.bridge) {
    window.bridge.internalPartnerGATaggingCallbackError = (errorCode, errorDescription) => {
      showModal(
        `GA Tagging Error: ${errorCode}\n${errorDescription}`,
        'error'
      );
    };
  }
}

/**
 * AppsFlyer tagging
 */
function internalPartnerAppsFlyerTagging() {
  const appsFlyer = document
    .getElementById('internalPartnerAppsFlyerTaggingappsFlyer')
    .value.replace(/\n/g, '');
  sendBridge('internalPartnerAppsFlyerTagging', [
    { key: 'appsFlyer', value: appsFlyer },
  ]);
  if (window.bridge) {
    window.bridge.internalPartnerAppsFlyerTaggingCallbackError = (
      errorCode,
      errorDescription
    ) => {
      showModal(
        `AppsFlyer Error: ${errorCode}\n${errorDescription}`,
        'error'
      );
    };
  }
}

/**
 * Open email settings
 */
function openEmailSetting() {
  sendBridge('openEmailSetting', []);
  if (window.bridge) {
    window.bridge.openEmailSettingCallback = (email) => {
      showModal(`Email: ${email}`, 'success');
    };
  }
}

/**
 * Open hide/unhide account
 */
function openHideUnHideAccount() {
  sendBridge('openHideUnHideAccount', []);
  if (window.bridge) {
    window.bridge.openHideUnHideAccountCallback = () => {
      showModal('Account settings updated', 'success');
    };
    window.bridge.openHideUnHideAccountCallbackError = (errorCode, errorDescription) => {
      showModal(
        `Account Error: ${errorCode}\n${errorDescription}`,
        'error'
      );
    };
  }
}

/**
 * PIN verification with face scan if needed
 */
function internalPartnerPinWithFaceScanIfNeeded() {
  const transactionRefId = document.getElementById(
    'internalPartnerPinWithFaceScanIfNeededtransactionRefId'
  ).value;
  const partnerRefId = document.getElementById(
    'internalPartnerPinWithFaceScanIfNeededpartnerRefId'
  ).value;

  sendBridge('internalPartnerPinWithFaceScanIfNeeded', [
    { key: 'transactionRefId', value: transactionRefId },
    { key: 'partnerRefId', value: partnerRefId },
  ]);

  if (window.bridge) {
    window.bridge.internalPartnerPinWithFaceScanIfNeededCallback = () => {
      showModal('PIN and face scan verification completed', 'success');
    };
    window.bridge.internalPartnerPinWithFaceScanIfNeededCallbackError = (
      errorCode,
      errorDescription
    ) => {
      showModal(
        `Verification Error: ${errorCode}\n${errorDescription}`,
        'error'
      );
    };
  }
}

/**
 * Custom JSBridge function
 */
function customJSBridge() {
  const jsFunction = document.getElementById('customJSBFunc').value;
  const data = getDataFromInputs();

  if (!jsFunction) {
    showModal('Please enter a function name', 'warning');
    return;
  }

  sendBridge(jsFunction, data);
  showModal(`Sent: ${jsFunction}`, 'success');
}

/**
 * Test JSBridge availability
 */
function testFunction() {
  const available = window.JSBridge && typeof window.JSBridge === 'object';
  if (available) {
    showModal('✓ JSBridge is available', 'success');
  } else {
    showModal('✗ JSBridge is not available', 'error');
  }
}

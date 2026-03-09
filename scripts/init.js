/**
 * Initialization Module
 * Sets up initial data and configuration
 */

/**
 * Initialize on page load
 */
window.onload = function () {
  onRefresh();
};

/**
 * Refresh page and load saved data
 */
function onRefresh() {
  window.bridge = {};
  window.onerror = function (message, source, lineno, colno, error) {
    debugLog(`ERROR: ${message} (${source}:${lineno})`);
  };

  const btn = document.getElementById("debug-btn");
  const consoleDiv = document.getElementById("debug-console");

  /* toggle console */
  btn.onclick = () => {
    consoleDiv.style.display =
      consoleDiv.style.display === "none" ? "block" : "none";
  };

  /* log function */
  function debugLog(msg) {
    const line = document.createElement("div");
    line.textContent = msg;
    consoleDiv.appendChild(line);
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
  }

  /* override console.log */
  const originalLog = console.log;
  console.log = function (...args) {
    debugLog(args.join(" "));
    originalLog.apply(console, args);
  };

/* test */
console.log("Debug console ready");

  // Load weblinks from session storage
  let savedWebLink = JSON.parse(sessionStorage.getItem('weblink')) || [];
  if (savedWebLink.length === 0) {
    savedWebLink = [
      'https://www.google.com/',
      'https://www.youtube.com/',
      'https://www.instagram.com/',
      'https://x.com/?lang=en&mx=2',
    ];
  }
  updateDatalist('weblink', savedWebLink);

  // Load deeplinks from session storage
  let savedDeeplink = JSON.parse(sessionStorage.getItem('deeplink')) || [];
  if (savedDeeplink.length === 0) {
    savedDeeplink = [
      'ktbnext://next.co.th/missionbase',
      'ktbnext://next.co.th/ktc/productshelf',
      'ktbnext://next.co.th/loan/landing',
    ];
  }
  updateDatalist('deeplink', savedDeeplink);

  // Load microsite data
  document.getElementById('openMicrositeweburl').value =
    sessionStorage.getItem('openMicrositeweburl') ||
    'https://weerawid.github.io/web-test-jsbridge/';
  document.getElementById('openMicrositetitle').value =
    sessionStorage.getItem('openMicrositetitle') || '';
  document.getElementById('openMicrositeprovidername').value =
    sessionStorage.getItem('openMicrositeprovidername') || '';

  // Load GA tagging template
  document.getElementById('internalPartnerGATaggingga').value =
    `{
  "event": {
    "action": "click",
    "category": "ProfileCreated",
    "label": null
  },
  "customDimemsions": [
    {
      "key": "xxx",
      "value": "yyy"
    }
  ],
  "firebaseParam": [
    {
      "key": "aaa",
      "value": "bbb"
    }
  ]
}`;

  // Load AppsFlyer tagging template
  document.getElementById('internalPartnerAppsFlyerTaggingappsFlyer').value =
    `{
  "event": {
    "label": "xxx"
  },
  "appsFlyerParam": [
    {
      "key": "aaa",
      "value": "bbb"
    }
  ]
}`;
}

// Store updated data when changed
document.addEventListener('DOMContentLoaded', function () {
  // Auto-save microsite data
  const micrositeInputs = [
    'openMicrositeweburl',
    'openMicrositetitle',
    'openMicrositeprovidername',
  ];
  micrositeInputs.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener('change', function () {
        sessionStorage.setItem(id, this.value);
      });
    }
  });
});



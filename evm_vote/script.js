/* EVM Voting Field Plug-in Script */

(function () {
  var casing = document.querySelector('.evm-casing');
  var readyLed = document.getElementById('ready-led');
  var votedLed = document.getElementById('voted-led');
  var buttons = document.querySelectorAll('.evm-blue-button');
  var rows = document.querySelectorAll('.evm-row');
  var slCells = document.querySelectorAll('.cell-sl-no');
  
  // Set 1-based Serial Numbers
  slCells.forEach(function (cell, idx) {
    cell.textContent = idx + 1;
  });

  // Default parameter values
  var beepFrequency = 1100;
  var beepDuration = 0.95;
  var readyLabelText = 'READY';
  var votedLabelText = 'VOTE CAST';
  var brandText = 'ELECTRONIC VOTING MACHINE';

  // Read parameters from getPluginParameter if available
  if (typeof getPluginParameter === 'function') {
    var pFreq = getPluginParameter('beep_frequency');
    if (pFreq) beepFrequency = parseFloat(pFreq);
    
    var pDur = getPluginParameter('beep_duration');
    if (pDur) beepDuration = parseFloat(pDur);
    
    var pReady = getPluginParameter('ready_label');
    if (pReady) readyLabelText = pReady;
    
    var pVoted = getPluginParameter('vote_cast_label');
    if (pVoted) votedLabelText = pVoted;
    
    var pTitle = getPluginParameter('title');
    if (pTitle) brandText = pTitle;
  }

  // Update brand and labels
  var brandEl = document.querySelector('.evm-brand');
  if (brandEl) brandEl.textContent = brandText;
  
  var readyLabelEl = readyLed ? readyLed.nextElementSibling : null;
  if (readyLabelEl) readyLabelEl.textContent = readyLabelText;
  
  var votedLabelEl = votedLed ? votedLed.nextElementSibling : null;
  if (votedLabelEl) votedLabelEl.textContent = votedLabelText;

  // Inline SVG icons for standard Indian parties
  var svgs = {
    bjp: '<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="party-svg">' +
         '  <path d="M50 80 C40 80, 30 65, 30 50 C30 40, 40 30, 50 15 C60 30, 70 40, 70 50 C70 65, 60 80, 50 80 Z" fill="#FF9933" />' +
         '  <path d="M50 80 C44 80, 38 68, 38 55 C38 47, 44 38, 50 25 C56 38, 62 47, 62 55 C62 68, 56 80, 50 80 Z" fill="#FFCC00" />' +
         '  <path d="M50 80 C30 80, 20 70, 20 55 C20 45, 32 40, 42 45 C35 55, 42 70, 50 80 Z" fill="#FF9933" />' +
         '  <path d="M50 80 C70 80, 80 70, 80 55 C80 45, 68 40, 58 45 C65 55, 58 70, 50 80 Z" fill="#FF9933" />' +
         '  <path d="M30 80 C40 85, 60 85, 70 80 C60 75, 40 75, 30 80 Z" fill="#138808" />' +
         '  <path d="M25 82 C35 90, 65 90, 75 82 C60 82, 40 82, 25 82 Z" fill="#0d5c05" />' +
         '</svg>',
    inc: '<svg viewBox="0 0 100 100" fill="none" stroke="#1d4ed8" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" class="party-svg">' +
         '  <path d="M35 50 V30 C35 25, 40 25, 40 30 V50 M40 45 V22 C40 17, 45 17, 45 22 V45 M45 42 V20 C45 15, 50 15, 50 20 V45 M50 48 V25 C50 20, 55 20, 55 25 V50 M55 58 V35 C55 30, 60 30, 60 35 V62" />' +
         '  <path d="M35 50 C35 65, 42 80, 55 80 C60 80, 65 72, 65 62" />' +
         '  <path d="M35 62 C25 60, 22 53, 27 48 C32 43, 35 48, 35 50" />' +
         '</svg>',
    aap: '<svg viewBox="0 0 100 100" fill="none" stroke="#854d0e" stroke-width="5" stroke-linecap="round" xmlns="http://www.w3.org/2000/svg" class="party-svg">' +
         '  <line x1="20" y1="80" x2="55" y2="45" stroke="#f59e0b" stroke-width="8" />' +
         '  <path d="M55 45 L70 30 M55 45 L75 35 M55 45 L80 40 M55 45 L85 45 M55 45 L80 50 M55 45 L75 55 M55 45 L70 60" />' +
         '  <path d="M50 42 C52 46, 56 46, 58 42 C56 38, 52 38, 50 42 Z" fill="#b45309" stroke="none" />' +
         '</svg>',
    tmc: '<svg viewBox="0 0 100 100" fill="none" stroke="#16a34a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" class="party-svg">' +
         '  <path d="M50 85 C45 65, 35 45, 35 40" />' +
         '  <path d="M50 85 C55 65, 65 45, 65 40" />' +
         '  <circle cx="35" cy="35" r="8" fill="#ec4899" stroke="none" />' +
         '  <circle cx="27" cy="35" r="6" fill="#f472b6" stroke="none" />' +
         '  <circle cx="43" cy="35" r="6" fill="#f472b6" stroke="none" />' +
         '  <circle cx="35" cy="27" r="6" fill="#f472b6" stroke="none" />' +
         '  <circle cx="35" cy="43" r="6" fill="#f472b6" stroke="none" />' +
         '  <circle cx="65" cy="35" r="8" fill="#ec4899" stroke="none" />' +
         '  <circle cx="57" cy="35" r="6" fill="#f472b6" stroke="none" />' +
         '  <circle cx="73" cy="35" r="6" fill="#f472b6" stroke="none" />' +
         '  <circle cx="65" cy="27" r="6" fill="#f472b6" stroke="none" />' +
         '  <circle cx="65" cy="43" r="6" fill="#f472b6" stroke="none" />' +
         '  <path d="M50 85 C35 75, 25 80, 20 85" />' +
         '  <path d="M50 85 C65 75, 75 80, 80 85" />' +
         '</svg>',
    bsp: '<svg viewBox="0 0 100 100" fill="#475569" xmlns="http://www.w3.org/2000/svg" class="party-svg">' +
         '  <path d="M25 65 C25 65, 23 50, 25 45 C28 40, 35 38, 45 38 C55 38, 65 40, 75 42 C85 43, 88 50, 88 58 C88 65, 83 70, 78 70 L75 70 C75 75, 73 80, 70 80 C68 80, 67 75, 67 70 L55 70 C55 75, 53 80, 50 80 C48 80, 47 75, 47 70 L35 70 C35 75, 33 80, 30 80 C28 80, 27 75, 27 70 L25 65 Z" />' +
         '  <path d="M25 45 C20 45, 12 50, 10 58 C8 65, 12 68, 14 65 C16 62, 16 55, 22 52" />' +
         '  <path d="M40 42 C35 42, 33 48, 35 55 C37 60, 42 62, 45 60 C48 55, 45 42, 40 42 Z" fill="#64748b" />' +
         '  <path d="M22 52 C18 53, 16 55, 17 56" stroke="#ffffff" stroke-width="2" />' +
         '</svg>',
    cpi: '<svg viewBox="0 0 100 100" fill="#ef4444" xmlns="http://www.w3.org/2000/svg" class="party-svg">' +
         '  <path d="M35 70 C30 50, 40 30, 60 30 C75 30, 80 40, 80 40 C80 40, 70 35, 60 40 C45 48, 42 60, 45 70 Z" fill="#ef4444" />' +
         '  <rect x="42" y="68" width="6" height="15" rx="3" transform="rotate(-45 42 68)" fill="#f59e0b" />' +
         '  <rect x="52" y="38" width="8" height="35" rx="2" transform="rotate(45 52 38)" fill="#f59e0b" />' +
         '  <rect x="35" y="32" width="16" height="26" rx="2" transform="rotate(45 35 32)" fill="#ef4444" stroke="#f59e0b" stroke-width="3" />' +
         '  <polygon points="68,15 71,22 79,23 73,28 75,36 68,32 61,36 63,28 57,23 65,22" fill="#ef4444" />' +
         '</svg>',
    nota: '<svg viewBox="0 0 100 100" fill="none" stroke="#334155" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" class="party-svg">' +
          '  <rect x="15" y="15" width="70" height="70" rx="6" stroke-width="4" />' +
          '  <line x1="25" y1="25" x2="75" y2="75" stroke="#ef4444" />' +
          '  <line x1="75" y1="25" x2="25" y2="75" stroke="#ef4444" />' +
          '</svg>'
  };
  
  // Inject SVGs if choice has no CHOICE_IMAGE
  var symbolContainers = document.querySelectorAll('.symbol-container');
  symbolContainers.forEach(function (container) {
    var val = container.getAttribute('data-choice-value');
    if (container.children.length === 0 && svgs[val]) {
      container.innerHTML = svgs[val];
    }
  });

  // Fallback to SVGs if CHOICE_IMAGE fails to load (broken image icon)
  var partyImages = document.querySelectorAll('.party-img');
  partyImages.forEach(function (img) {
    img.addEventListener('error', function () {
      var container = img.parentElement;
      var val = container.getAttribute('data-choice-value');
      if (svgs[val]) {
        container.innerHTML = svgs[val];
      }
    });
    // Force immediate SVG fallback if image is already broken/not loaded
    if (img.complete && img.naturalWidth === 0) {
      var container = img.parentElement;
      var val = container.getAttribute('data-choice-value');
      if (svgs[val]) {
        container.innerHTML = svgs[val];
      }
    }
  });

  // Sound Beep Player using Web Audio API
  function playBeep() {
    try {
      var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = 'sine';
      osc.frequency.value = beepFrequency; // Use dynamic frequency parameter
      gain.gain.setValueAtTime(0.45, audioCtx.currentTime);
      
      osc.start();
      osc.stop(audioCtx.currentTime + beepDuration); // Use dynamic duration parameter
    } catch (e) {
      console.warn('[EVM Plugin] Web Audio beep failed', e);
    }
  }

  // Restore or set initial state
  var currentAnswer = '';
  if (typeof fieldProperties !== 'undefined' && fieldProperties.CURRENT_ANSWER) {
    currentAnswer = fieldProperties.CURRENT_ANSWER;
  }
  
  var isReadOnly = false;
  if (typeof fieldProperties !== 'undefined' && fieldProperties.READONLY) {
    isReadOnly = true;
  }

  if (currentAnswer) {
    lockEVM(currentAnswer);
  } else if (isReadOnly) {
    lockEVM(null); // Lock but don't highlight any candidate
  } else {
    setReadyState();
  }

  // Add click listeners to buttons
  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (casing.classList.contains('locked') || isReadOnly) return;
      var val = btn.getAttribute('data-value');
      
      // Perform vote
      playBeep();
      lockEVM(val);
      
      if (typeof setAnswer === 'function') {
        setAnswer(val);
      }
    });
  });

  function setReadyState() {
    casing.classList.remove('locked');
    readyLed.className = 'evm-status-led led-green';
    votedLed.className = 'evm-status-led led-red-off';
    
    rows.forEach(function (row) {
      row.classList.remove('voted-row');
    });
    document.querySelectorAll('.candidate-led').forEach(function (led) {
      led.classList.remove('active-led');
    });
    buttons.forEach(function (btn) {
      btn.classList.remove('voted-btn');
      btn.disabled = false;
    });
  }

  function lockEVM(votedValue) {
    casing.classList.add('locked');
    readyLed.className = 'evm-status-led led-green-off';
    votedLed.className = 'evm-status-led led-red';
    
    buttons.forEach(function (btn) {
      btn.disabled = true;
    });

    if (votedValue) {
      var row = document.getElementById('row-' + votedValue);
      if (row) {
        row.classList.add('voted-row');
      }
      var led = document.getElementById('led-' + votedValue);
      if (led) {
        led.classList.add('active-led');
      }
      var btn = document.getElementById('btn-' + votedValue);
      if (btn) {
        btn.classList.add('voted-btn');
      }
    }
  }

  // Bind clean internal reset and state triggers to document event/global functions
  window.__evm_reset = setReadyState;
  window.__evm_lock = lockEVM;
})();

// Global clearAnswer function (required by SurveyCTO host)
function clearAnswer() {
  if (typeof window.__evm_reset === 'function') {
    window.__evm_reset();
  }
}

// Global setFocus function (optional, recommended)
function setFocus() {
  var firstBtn = document.querySelector('.evm-blue-button');
  if (firstBtn && !firstBtn.disabled) {
    firstBtn.focus();
  }
}

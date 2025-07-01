import KeyCodeParser from "bright-sdk-keycode-parser";
import msgBoxDefault from './images/msg_box.png';
import offDefault from './images/off.png';
import onDefault from './images/on.png';
import qrCodeDefault from './images/qr_brd.png';

const styleElement = document.createElement("style");
styleElement.textContent = `
  @import url("https://fonts.cdnfonts.com/css/games");

  @keyframes flash {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.1;
    }
    100% {
      opacity: 1;
    }
  }

  .flash {
    animation: flash 1.2s infinite;
  }
`;

// Append style element when the module is loaded
if (typeof document !== "undefined") {
  document.head.appendChild(styleElement);
}

function createSettingsDialog({
  title,
  qrCodeUrl = qrCodeDefault,
  logoUrl,
  msgBoxUrl = msgBoxDefault,
  offUrl = offDefault,
  onUrl = onDefault,
  onText = 'When enabled you keep the app free',
  offText = 'Enable to keep the app free',
  autoclose = true,
  onCheckboxClick,
  onShow,
  onHide,
}) {
  var overlaySetting;
  var messageBox;
  var closeButton;
  var checkbox;
  var checkboxText;
  var setting_msg_on = false;
  var currentButton;
  var isChecked;
  var autoClose = autoclose;

  function setAutoClose(value) {
    autoClose = value;
  }

  var focusableElements = [
    "closeSettingsButton",
    "checkbox",
  ];

  var elementHandlers = {
    closeSettingsButton: function () {
      hideSettings();
    },
    checkbox: function () {
      checkbox.onclick();
    },
  };

  function resetCurrent() {
    stopFlash(currentButton);
    currentButton = null;
  }

  function setCurrent(button) {
    resetCurrent();
    currentButton = button;
    startFlash(currentButton);
  }

  function handleKeyDown(e) {
    if (setting_msg_on) {
      const key = KeyCodeParser.parseEvent(e);
      if (key.UP || key.DOWN)
      {
        setCurrent(focusableElements[
          (focusableElements.indexOf(currentButton) + (key.UP ? -1 : 1))
            % focusableElements.length
        ]);
      } else if (key.ENTER) {
        elementHandlers[currentButton]();
      } else if (key.BACK) {
        hideSettings();
      }
    }
  }

  function showSettings(value) {
    setting_msg_on = true;
    overlaySetting.style.display = "block";
    messageBox.style.display = "block";
    isChecked = value;
    renderCheckBox();
    if (value)
      setCurrent("closeSettingsButton");
    else
      setCurrent("checkbox");
    overlaySetting.addEventListener("click", function (event) {
      event.stopPropagation(); // Stop the click event from propagating
    });
    document.addEventListener("keydown", handleKeyDown);
    if (onShow) onShow();
  }

  function hideSettings() {
    overlaySetting.style.display = "none";
    messageBox.style.display = "none";
    resetCurrent();
    setting_msg_on = false;
    document.removeEventListener("keydown", handleKeyDown);
    if (onHide) onHide();
  }

  function handleCheckBox() {
    isChecked = !isChecked;
    if (autoClose) hideSettings();
    else renderCheckBox();
    onCheckboxClick(isChecked);
  }

  function renderCheckBox() {
    if (isChecked) {
      checkbox.style.backgroundImage = `url(${onUrl})`;
      checkboxText.textContent = onText;
    } else {
      checkbox.style.backgroundImage = `url(${offUrl})`;
      checkboxText.textContent = offText;
    }
  }

  function createMessageBox(vendor) {
    // Create a background overlaySetting
    overlaySetting = document.createElement("div");
    overlaySetting.style.position = "fixed";
    overlaySetting.style.top = "0";
    overlaySetting.style.left = "0";
    overlaySetting.style.width = "100%";
    overlaySetting.style.height = "100%";
    overlaySetting.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Gray with 50% transparency
    overlaySetting.style.zIndex = "999"; // Behind the message box

    // Append the overlaySetting to the body
    document.body.appendChild(overlaySetting);

    // Create a div for the message box
    messageBox = document.createElement("div");
    messageBox.style.width = "28vw";
    messageBox.style.height = "55vh";
    messageBox.style.position = "fixed";
    messageBox.style.top = "50%";
    messageBox.style.left = "50%";
    messageBox.style.transform = "translate(-50%, -50%)";
    messageBox.style.backgroundImage = `url(${msgBoxUrl})`;
    messageBox.style.backgroundSize = "contain"; // or "contain" if needed
    messageBox.style.backgroundRepeat = "no-repeat";
    messageBox.style.backgroundPosition = "center";
    messageBox.style.backgroundRepeat = "no-repeat"; // Prevents repeating of the image
    messageBox.style.fontFamily = "'Molisa Delawere', sans-serif"; // Set font family for message box
    messageBox.style.zIndex = "1000"; // On top of the overlaySetting

    // Create the close button
    closeButton = document.createElement("button");
    closeButton.id = "closeSettingsButton";
    closeButton.innerHTML = "&#10005;"; // Unicode for ✕ (multiplication X)
    closeButton.style.position = "absolute";
    closeButton.style.top = "4vh";
    closeButton.style.left = "0.6vh";
    closeButton.style.backgroundColor = "rgb(255, 255, 255)";
    closeButton.style.color = "white";
    closeButton.style.border = "none";
    closeButton.style.borderRadius = "50%";
    closeButton.style.width = "3vw";
    closeButton.style.height = "3vw";
    closeButton.style.fontSize = "2vw";
    closeButton.style.lineHeight = "40px";
    closeButton.style.display = "flex";
    closeButton.style.textAlign = "center";
    closeButton.style.alignItems = "center";
    closeButton.style.justifyContent = "center";
    closeButton.style.color = "black";
    closeButton.style.padding = "0";
    closeButton.style.cursor = "pointer";
    closeButton.onclick = function () {
      hideSettings();
    };

    var logoImg = document.createElement("img");
    logoImg.src = logoUrl;
    logoImg.alt = "App Logo";
    logoImg.style.display = "block";
    logoImg.style.margin = "0 auto"; // centers the image
    logoImg.style.width = "auto"; // adjust size as needed
    logoImg.style.height = "10vh"; // preserve aspect ratio
    logoImg.style.marginTop = "12vh"; // preserve aspect ratio

    // Create the Web Indexing row with a round checkbox
    var webIndexingRow = document.createElement("div");
    webIndexingRow.style.display = "flex";
    webIndexingRow.style.alignItems = "center";
    webIndexingRow.style.justifyContent = "center"; // Centering the elements horizontally
    webIndexingRow.style.marginTop = "1.5vh";

    // Create the text label
    var webIndexingLabel = document.createElement("span");
    webIndexingLabel.textContent = "Web Indexing";
    webIndexingLabel.style.fontSize = "3.5vh";
    webIndexingLabel.style.marginRight = "1.5vh"; // Add space between label and checkbox
    webIndexingLabel.style.color = " #7ef542";
    webIndexingLabel.style.fontWeight = "bold";

    // Create the custom checkbox
    checkbox = document.createElement("div");
    checkbox.id = "checkbox";
    checkbox.style.width = "8vh";
    checkbox.style.height = "5vh";
    checkbox.style.backgroundImage = `url(${onUrl})`;
    checkbox.style.backgroundSize = "contain"; // or "contain" if needed
    checkbox.style.backgroundRepeat = "no-repeat";
    checkbox.style.backgroundPosition = "bottom";
    checkbox.style.backgroundRepeat = "no-repeat"; // Prevents repeating of the image

    // Create a text line below the checkbox that changes based on checkbox state
    checkboxText = document.createElement("p");
    checkboxText.textContent = "When enabled you keep the app free"; // Default text when checkbox is "on"
    checkboxText.style.textAlign = "center";
    checkboxText.style.marginTop = "1.6vh";
    checkboxText.style.fontSize = "1vw";
    checkboxText.style.color = "#cccccc";

    checkbox.onclick = function () {
      handleCheckBox();
    };

    // Append label and checkbox to the row
    webIndexingRow.appendChild(webIndexingLabel);
    webIndexingRow.appendChild(checkbox);

    // Add the QR Code section below the Web Indexing checkbox
    var qrCodeLabel = document.createElement("p");
    qrCodeLabel.textContent = "Scan the QR Code to learn more";
    qrCodeLabel.style.textAlign = "center";
    qrCodeLabel.style.marginTop = "1.5vh";
    qrCodeLabel.style.fontSize = "1.1vw";
    qrCodeLabel.style.color = "#cccccc";

    var qrCodeImage = document.createElement("img");
    qrCodeImage.src = qrCodeUrl;

    qrCodeImage.alt = "QR Code";
    qrCodeImage.style.display = "block";
    qrCodeImage.style.margin = "0 auto"; // Center the image
    qrCodeImage.style.width = "10vh"; // Set size for the QR code image
    qrCodeImage.style.height = "10vh";

    // Append elements to the message box
    messageBox.appendChild(closeButton);
    messageBox.appendChild(logoImg);
    // messageBox.appendChild(privacyTitle);
    // messageBox.appendChild(privacyLink);
    messageBox.appendChild(webIndexingRow); // Add the Web Indexing row
    messageBox.appendChild(checkboxText); // Add the dynamic text below the checkbox
    messageBox.appendChild(qrCodeLabel); // Add QR code label
    messageBox.appendChild(qrCodeImage); // Add QR code image

    // Append the message box to the body
    document.body.appendChild(messageBox);
    overlaySetting.style.fontFamily = "'Molisa Delawere', sans-serif"; // Set font family for overlaySetting
    messageBox.style.fontFamily = "'Molisa Delawere', sans-serif"; // Set font family for message box
    hideSettings();
  }

  function startFlash(elementId) {
    // Get the element by ID
    const element = document.getElementById(elementId); // Use getElementById to get the element
    if (element) {
      element.classList.add("flash"); // Add the flash class to start the animation
    }
  }

  function stopFlash(elementId) {
    // Get the element by ID
    const element = document.getElementById(elementId); // Use getElementById to get the element
    if (element) {
      element.classList.remove("flash"); // Remove the flash class to stop the animation
    }
  }

  createMessageBox(title);

  return {
    show: showSettings,
    hide: hideSettings,
    setAutoClose: setAutoClose,
  };
}

if (typeof window !== "undefined") {
  window.SettingsDialog = { create: createSettingsDialog };
}

export default { create: createSettingsDialog };

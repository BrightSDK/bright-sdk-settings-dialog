import KeyCodeParser from "bright-sdk-keycode-parser";

const styleElement = document.createElement('style');
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
if (typeof document !== 'undefined') {
  document.head.appendChild(styleElement);
}

function createSettingsDialog({
  title,
  qrCodeUrl,
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

  function handleKeyDown(e) {
    if (setting_msg_on) {
      const key = KeyCodeParser.parseEvent(e);
      if (key.UP) {
        stopFlash(currentButton);
        currentButton = "closeSettingsButton";
        startFlash(currentButton);
      } else if (key.DOWN) {
        stopFlash(currentButton);
        currentButton = "checkbox";
        startFlash(currentButton);
      } else if (key.ENTER) {
        if (currentButton == "closeSettingsButton") {
          hideSettings();
        } else if (currentButton == "checkbox") {
          checkbox.onclick();
        }
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
    currentButton = "closeSettingsButton";
    startFlash(currentButton);
    overlaySetting.addEventListener("click", function (event) {
      event.stopPropagation(); // Stop the click event from propagating
    });
    document.addEventListener("keydown", handleKeyDown);
    if (onShow)
      onShow();
  }

  function hideSettings() {
    overlaySetting.style.display = "none";
    messageBox.style.display = "none";
    stopFlash(currentButton);
    setting_msg_on = false;
    document.removeEventListener("keydown", handleKeyDown);
    if (onHide)
      onHide();
  }

  function handleCheckBox() {
    hideSettings();
    onCheckboxClick(!isChecked);
  }

  function renderCheckBox() {
    if (isChecked) {
      checkbox.style.backgroundColor = "#7ef542";
      checkbox.innerHTML = "&#x2713;"; // Unicode for ✓
      checkboxText.textContent = "When enabled you keep the app free";
    } else {
      checkbox.style.backgroundColor = "#ff5e5e";
      checkbox.innerHTML = "&#x2717;"; // Unicode for ✗
      checkboxText.textContent = "Enable to keep the app free";
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
    messageBox.style.width = "30%";
    messageBox.style.height = "43%";
    messageBox.style.position = "fixed";
    messageBox.style.top = "50%";
    messageBox.style.left = "50%";
    messageBox.style.transform = "translate(-50%, -50%)";
    messageBox.style.background = " #1e1e2f";
    messageBox.style.backgroundRepeat = "no-repeat"; // Prevents repeating of the image
    messageBox.style.backgroundPosition = "center"; // Centers the image in the box
    messageBox.style.border = "10px solid#3b3b3b";
    messageBox.style.borderRadius = "30px";
    messageBox.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    messageBox.style.padding = "20px";
    messageBox.style.zIndex = "1000";
    messageBox.style.fontFamily = "'Molisa Delawere', sans-serif"; // Set font family for message box
    // Create the close button
    closeButton = document.createElement("button");
    closeButton.id = "closeSettingsButton";
    closeButton.innerHTML = "X";
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.left = "10px";
    closeButton.style.backgroundColor = " #ff4d4d";
    closeButton.style.color = "white";
    closeButton.style.border = "none";
    closeButton.style.borderRadius = "50%";
    closeButton.style.width = "30px";
    closeButton.style.height = "30px";
    closeButton.style.cursor = "pointer";
    closeButton.onclick = function () {
      hideSettings();
    };

    // Create the title showing the vendor name
    var vendorTitle = document.createElement("h1");
    vendorTitle.textContent = vendor;
    vendorTitle.style.textAlign = "center";
    vendorTitle.style.color = " #00f7ff";
    vendorTitle.style.fontSize = "50px";
    vendorTitle.style.fontFamily = "'Molisa Delawere', sans-serif";

    // Create the Web Indexing row with a round checkbox
    var webIndexingRow = document.createElement("div");
    webIndexingRow.style.display = "flex";
    webIndexingRow.style.alignItems = "center";
    webIndexingRow.style.justifyContent = "center"; // Centering the elements horizontally
    webIndexingRow.style.marginTop = "20px";

    // Create the text label
    var webIndexingLabel = document.createElement("span");
    webIndexingLabel.textContent = "Web Indexing";
    webIndexingLabel.style.fontSize = "20px";
    webIndexingLabel.style.marginRight = "20px"; // Add space between label and checkbox
    webIndexingLabel.style.color = " #7ef542";
    // Create the custom checkbox
    checkbox = document.createElement("div");
    checkbox.id = "checkbox";
    checkbox.style.width = "30px";
    checkbox.style.height = "30px";
    checkbox.style.borderRadius = "50%";
    checkbox.style.display = "flex";
    checkbox.style.alignItems = "center";
    checkbox.style.justifyContent = "center";
    checkbox.style.cursor = "pointer";
    checkbox.style.backgroundColor = " #7ef542"; // Start as "on"
    checkbox.innerHTML = "&#x2713;"; // Unicode for ✓ (checkmark)
    checkbox.style.fontSize = "20px"; // Ensure the symbol is visible
    checkbox.style.color = "white";

    // Create a text line below the checkbox that changes based on checkbox state
    checkboxText = document.createElement("p");
    checkboxText.textContent = "When enabled you keep the app free"; // Default text when checkbox is "on"
    checkboxText.style.textAlign = "center";
    checkboxText.style.marginTop = "10px";
    checkboxText.style.fontSize = "14px";
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
    qrCodeLabel.style.marginTop = "1rem";
    qrCodeLabel.style.fontSize = "14px";
    qrCodeLabel.style.color = "#cccccc";

    var qrCodeImage = document.createElement("img");
    qrCodeImage.src = qrCodeUrl;

    qrCodeImage.alt = "QR Code";
    qrCodeImage.style.display = "block";
    qrCodeImage.style.margin = "0 auto"; // Center the image
    qrCodeImage.style.width = "100px"; // Set size for the QR code image
    qrCodeImage.style.height = "100px";

    // Append elements to the message box
    messageBox.appendChild(closeButton);
    messageBox.appendChild(vendorTitle);
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
  };
}

if (typeof window !== "undefined") {
    window.SettingsDialog = { create: createSettingsDialog };
}

export default { create: createSettingsDialog };
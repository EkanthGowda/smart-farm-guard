const BASE_URL = "https://iot-bbackend.onrender.com";

export async function getLatestDetection() {
  const res = await fetch(`${BASE_URL}/app/latest`);
  return res.json();
}

export async function sendDetection(data) {
  return fetch(`${BASE_URL}/device/detection`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

export async function sendCommand(action) {
  const payload =
    typeof action === "string"
      ? { device_id: "farm_001", action }
      : { device_id: "farm_001", ...action };

  return fetch(`${BASE_URL}/app/command`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export async function getAlerts() {
  const response = await fetch(`${BASE_URL}/alerts`);
  if (!response.ok) {
    throw new Error("Failed to fetch alerts");
  }
  return response.json();
}

export async function getSounds() {
  const response = await fetch(`${BASE_URL}/app/sounds?device_id=farm_001`);
  if (!response.ok) {
    throw new Error("Failed to fetch sounds");
  }
  return response.json();
}

export async function uploadSound(file) {
  const formData = new FormData();
  formData.append("file", file);

  return fetch(`${BASE_URL}/app/upload-sound`, {
    method: "POST",
    body: formData
  });
}

export async function getSettings() {
  const response = await fetch(`${BASE_URL}/settings`);
  if (!response.ok) {
    throw new Error("Failed to fetch settings");
  }
  return response.json();
}

export async function updateSettings(payload) {
  const response = await fetch(`${BASE_URL}/settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error("Failed to update settings");
  }
  return response.json();
}

export async function getMotorState() {
  const response = await fetch(`${BASE_URL}/app/motor`);
  if (!response.ok) {
    throw new Error("Failed to fetch motor state");
  }
  return response.json();
}

export async function setMotorState(action) {
  const response = await fetch(`${BASE_URL}/app/motor`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ device_id: "farm_001", action })
  });
  if (!response.ok) {
    throw new Error("Failed to update motor state");
  }
  return response.json();
}

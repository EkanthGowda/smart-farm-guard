const BASE_URL = "http://192.168.0.102:5000";

export async function sendDetection(data) {
  return fetch(`${BASE_URL}/device/detection`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

export async function sendCommand(command) {
  return fetch(`${BASE_URL}/device/command`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(command)
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
  const response = await fetch(`${BASE_URL}/sounds`);
  if (!response.ok) {
    throw new Error("Failed to fetch sounds");
  }
  return response.json();
}

export async function selectSound(soundId) {
  const response = await fetch(`${BASE_URL}/sounds/select`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ soundId })
  });
  if (!response.ok) {
    throw new Error("Failed to select sound");
  }
  return response.json();
}

export async function uploadSound(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/sounds/upload`, {
    method: "POST",
    body: formData
  });
  if (!response.ok) {
    throw new Error("Failed to upload sound");
  }
  return response.json();
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

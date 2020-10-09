const DOWNLOAD_LOCATION = "downloadLocation";

export function setDownloadLocation(path) {
  localStorage.setItem(DOWNLOAD_LOCATION, path);
}

export function getDownloadLocation(path) {
  return localStorage.getItem(DOWNLOAD_LOCATION) || "";
}

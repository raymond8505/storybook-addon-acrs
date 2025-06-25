export function msToDateString(msIn: string | number): string {
  const date = new Date(Number(msIn));
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
export function twoDigit(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}
export function msToHMS(ms: number) {
  // 1- Convert to seconds:
  let seconds: number = ms / 1000;
  // 2- Extract hours:
  const hours = Math.round(seconds / 3600); // 3,600 seconds in 1 hour
  seconds = seconds % 3600; // seconds remaining after extracting hours
  // 3- Extract minutes:
  const minutes = Math.round(seconds / 60); // 60 seconds in 1 minute
  // 4- Keep only seconds not extracted to minutes:
  seconds = Math.round(seconds % 60);

  return `${hours > 0 ? `${hours}:` : ""}${twoDigit(minutes)}:${twoDigit(seconds)}`;
}
export function download({
  data,
  fileName,
  fileType,
}: {
  data: string;
  fileName: string;
  fileType: string;
}) {
  // Create a Blob with the CSV data and type
  const blob = new Blob([data], { type: fileType });

  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create an anchor tag for downloading
  const a = document.createElement("a");

  // Set the URL and download attribute of the anchor tag
  a.href = url;
  a.download = fileName;

  // Trigger the download by clicking the anchor tag
  a.click();
}
export function arraysOverlap(arr1, arr2) {
  return arr1.some((item) => arr2.includes(item));
}

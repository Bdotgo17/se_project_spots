export function setButtonText(
  btn,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."
) {
  if (isLoading) {
    // Set the loading text
    btn.textContent = loadingText;
    console.log(`Setting text to: ${loadingText}`);
  } else {
    // Set the default text
    btn.textContent = defaultText;
    console.log(`Setting text to: ${defaultText}`);
  }
}

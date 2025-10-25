// Load from database instead of hardcoded data
async function loadImagesFromAPI() {
  try {
    const response = await fetch('http://127.0.0.1:5000/api/services/images');
    const data = await response.json();
    
    if (data.tattoos && data.tattoos.length > 0) {
      tattooDesigns.length = 0;
      tattooDesigns.push(...data.tattoos);
      loadTattooGallery();
    }
    
    if (data.haircuts && data.haircuts.length > 0) {
      haircutStyles.length = 0;
      haircutStyles.push(...data.haircuts);
      loadHaircutGallery();
    }
  } catch (error) {
    console.log("Using static image data - API not available");
  }
}

// Call it on page load
document.addEventListener("DOMContentLoaded", () => {
  loadImagesFromAPI(); // Use API data
  // Or keep the original if API fails
  // loadTattooGallery();
  // loadHaircutGallery();
});
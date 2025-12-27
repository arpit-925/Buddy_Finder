export const suggestedPlaces = [
  /* ===================== INDIA ===================== */

  /* ---- MOUNTAINS ---- */
  { name: "Manali", lat: 32.2396, lng: 77.1887, season: ["winter","summer"], type: "mountain", budgetRange: "medium", image: "https://images.unsplash.com/photo-1587502537745-84b86da1204f?auto=format&fit=crop&w=800" },
  { name: "Shimla", lat: 31.1048, lng: 77.1734, season: ["winter","summer"], type: "mountain", budgetRange: "medium", image: "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=800" },
  { name: "Mussoorie", lat: 30.4598, lng: 78.0644, season: ["summer","monsoon"], type: "mountain", budgetRange: "low", image: "https://images.unsplash.com/photo-1603312878070-1c49d2b52d44?auto=format&fit=crop&w=800" },
  { name: "Nainital", lat: 29.3919, lng: 79.4542, season: ["summer","winter"], type: "mountain", budgetRange: "low", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800" },
  {
    name: "Dalhousie",
    lat: 32.5387,
    lng: 75.9716,
    season: ["summer", "winter"],
    type: "mountain",
    budgetRange: "low",
    image: "https://images.unsplash.com/photo-1623073899809-d6c94a6b0fca?auto=format&fit=crop&w=800"
  },
  { name: "Auli", lat: 30.5286, lng: 79.5669, season: ["winter"], type: "mountain", budgetRange: "medium", image: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=800" },
  { name: "Spiti Valley", lat: 32.2462, lng: 78.0176, season: ["summer"], type: "adventure", budgetRange: "high", image: "https://images.unsplash.com/photo-1604948501466-4e5f7c9fa5db?auto=format&fit=crop&w=800" },
  { name: "Ladakh", lat: 34.1526, lng: 77.5771, season: ["summer"], type: "adventure", budgetRange: "high", image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800" },

  /* ---- BEACHES ---- */
  { name: "Goa", lat: 15.2993, lng: 74.124, season: ["winter","monsoon"], type: "beach", budgetRange: "medium", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800" },
  { name: "Gokarna", lat: 14.5479, lng: 74.3188, season: ["winter"], type: "beach", budgetRange: "low", image: "https://images.unsplash.com/photo-1590490359854-dfba19688d70?auto=format&fit=crop&w=800" },
  { name: "Varkala", lat: 8.7379, lng: 76.7163, season: ["winter","monsoon"], type: "beach", budgetRange: "low", image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=800" },
  { name: "Kovalam", lat: 8.4004, lng: 76.978, season: ["winter"], type: "beach", budgetRange: "medium", image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800" },
  { name: "Andaman Islands", lat: 11.7401, lng: 92.6586, season: ["winter"], type: "beach", budgetRange: "high", image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800" },

  /* ---- CITIES ---- */
  { name: "Delhi", lat: 28.6139, lng: 77.209, season: ["winter"], type: "city", budgetRange: "low", image: "https://images.unsplash.com/photo-1585435421671-0c16764628ce?auto=format&fit=crop&w=800" },
  { name: "Mumbai", lat: 19.076, lng: 72.8777, season: ["winter","monsoon"], type: "city", budgetRange: "medium", image: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=800" },
  {
    name: "Bangalore",
    lat: 12.9716,
    lng: 77.5946,
    season: ["monsoon", "winter"],
    type: "city",
    budgetRange: "medium",
    image: "https://images.unsplash.com/photo-1588416936097-41850ab3d86d?auto=format&fit=crop&w=800"
  },
  {
    name: "Hyderabad",
    lat: 17.385,
    lng: 78.4867,
    season: ["winter"],
    type: "city",
    budgetRange: "low",
    image: "https://images.unsplash.com/photo-1605197161470-5f2a1f1a1f4e?auto=format&fit=crop&w=800"
  },
  { name: "Pune", lat: 18.5204, lng: 73.8567, season: ["monsoon","winter"], type: "city", budgetRange: "low", image: "https://images.unsplash.com/photo-1596541223130-5d31a73fb6c6?auto=format&fit=crop&w=800" },

  /* ---- HERITAGE / CULTURE ---- */
  { name: "Jaipur", lat: 26.9124, lng: 75.7873, season: ["winter"], type: "city", budgetRange: "low", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800" },
  { name: "Udaipur", lat: 24.5854, lng: 73.7125, season: ["winter"], type: "city", budgetRange: "medium", image: "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800" },
  { name: "Jaisalmer", lat: 26.9157, lng: 70.9083, season: ["winter"], type: "adventure", budgetRange: "medium", image: "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?auto=format&fit=crop&w=800" },

  /* ---- SPIRITUAL ---- */
  { name: "Rishikesh", lat: 30.0869, lng: 78.2676, season: ["winter","summer"], type: "spiritual", budgetRange: "low", image: "https://images.unsplash.com/photo-1593452378822-26217417e704?auto=format&fit=crop&w=800" },
  { name: "Varanasi", lat: 25.3176, lng: 82.9739, season: ["winter"], type: "spiritual", budgetRange: "low", image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800" },
  { name: "Amritsar", lat: 31.634, lng: 74.8723, season: ["winter"], type: "spiritual", budgetRange: "low", image: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=800" },

  /* ===================== INTERNATIONAL ===================== */
  // ... (International links were mostly working, but verified they are fine)
  { name: "Dubai", lat: 25.2048, lng: 55.2708, season: ["winter"], type: "city", budgetRange: "high", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800" },
  { name: "Paris", lat: 48.8566, lng: 2.3522, season: ["summer","spring"], type: "city", budgetRange: "high", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800" },
  { name: "Bali", lat: -8.3405, lng: 115.092, season: ["summer"], type: "beach", budgetRange: "medium", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800" },
  { name: "Maldives", lat: 3.2028, lng: 73.2207, season: ["winter"], type: "beach", budgetRange: "high", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800" },
  { name: "Bangkok", lat: 13.7563, lng: 100.5018, season: ["winter"], type: "city", budgetRange: "medium", image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800" },
  { name: "Singapore", lat: 1.3521, lng: 103.8198, season: ["winter"], type: "city", budgetRange: "high", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800" },
  { name: "Kathmandu", lat: 27.7172, lng: 85.324, season: ["winter"], type: "mountain", budgetRange: "low", image: "https://images.unsplash.com/photo-1549880181-56a44cf4a9a5?auto=format&fit=crop&w=800" },
  { name: "Tokyo", lat: 35.6762, lng: 139.6503, season: ["spring"], type: "city", budgetRange: "high", image: "https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&w=800" },
  { name: "Istanbul", lat: 41.0082, lng: 28.9784, season: ["spring","winter"], type: "city", budgetRange: "medium", image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800" },
  { name: "Zurich", lat: 47.3769, lng: 8.5417, season: ["winter","summer"], type: "mountain", budgetRange: "high", image: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=800" },
];
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'scrapePage') {
    fetch('http://127.0.0.1:8000/scrape/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: 'url=' + encodeURIComponent(request.url)
    })
    .then(function(response) {
      if (response.ok) {
        return response.json(); // Parse the response body as JSON
      } else {
        throw new Error('Failed to scrape the page.');
      }
    })
    .then(function(data) {
      sendResponse({ success: true, data: data });
    })
    .catch(function(error) {
      sendResponse({ success: false, error: error.message });
    });
    return true; // This is important to indicate that the response will be sent asynchronously
  }
});

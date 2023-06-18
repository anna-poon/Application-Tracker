document.addEventListener('DOMContentLoaded', function() {
  var loadButton = document.getElementById('loadButton');
  var submitButton = document.getElementById('submitButton');
  var successMessage = document.getElementById('successMessage');
  var errorMessage = document.getElementById('errorMessage');
  var urlInput = document.getElementById('urlInput');
  var itemNameInput = document.getElementById('itemNameInput');
  var storeInput = document.getElementById('storeInput');
  var priceInput = document.getElementById('priceInput');
  var ratingInput = document.getElementById('ratingInput');

  loadButton.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var activeTab = tabs[0];
      var url = activeTab.url;

      console.log('Scraping page:', url); // Log the URL being scraped

      chrome.runtime.sendMessage({ action: 'scrapePage', url: url }, function(response) {
        if (response.success) {
          successMessage.textContent = 'Page scraped successfully!';
          errorMessage.textContent = '';

          console.log('Scraped data:', response.data); // Log the scraped data

          // Set the scraped data in the input fields
          document.getElementById('urlInput').value = response.data.url || '';
          document.getElementById('itemNameInput').value = response.data.item_name || '';
          document.getElementById('storeInput').value = response.data.store || '';
          document.getElementById('priceInput').value = response.data.price || '';
          document.getElementById('ratingInput').value = response.data.rating || '';

        } else {
          successMessage.textContent = '';
          errorMessage.textContent = 'Failed to scrape the page.';
        }
      });
    });
  });

  submitButton.addEventListener('click', function() {
    var url = urlInput.value;
    var item_name = itemNameInput.value;
    var store = storeInput.value;
    var price = priceInput.value;
    var rating = ratingInput.value;

    console.log('Submitting form data:');
    console.log('URL:', url);
    console.log('Item Name:', item_name);
    console.log('Store:', store);
    console.log('Price:', price);
    console.log('Rating:', rating);
    

    // Make the post request to your Django application
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://127.0.0.1:8000/submit/', true);

    // Get the CSRF token from the cookie
    var csrftoken = getCookie('csrftoken');

    // Include the CSRF token in the request headers
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    xhr.setRequestHeader('X-CSRFToken', csrftoken);

    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          successMessage.textContent = 'Form submitted successfully!';
          errorMessage.textContent = '';
        } else {
          successMessage.textContent = '';
          errorMessage.textContent = 'Failed to submit the form.';
        }
      }
    };
    var formData = 'url=' + encodeURIComponent(url) + '&item_name=' + encodeURIComponent(item_name) + '&store=' + encodeURIComponent(store) + '&price=' + encodeURIComponent(price) + '&rating=' + encodeURIComponent(rating);
    xhr.send(formData);
  });

  // Function to get the CSRF token from the cookie
  function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        // Extract the CSRF token from the cookie
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
});

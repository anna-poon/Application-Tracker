from django.shortcuts import render
import requests
from bs4 import BeautifulSoup
from app.models import *
from django.http import JsonResponse
import re
from django.views.decorators.csrf import csrf_exempt

from bs4 import BeautifulSoup
import requests
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

@csrf_exempt
def scrape_webpage(request):
    if request.method == 'POST':
        url = request.POST['url']  # Assuming you pass the URL via a form
        try:
            response = requests.get(url)
            soup = BeautifulSoup(response.content, 'html.parser')  # Use response.text instead of response.content

            #print(soup)
            
            # Extract job title
            item_name = soup.h1.text
            if item_name:
                item_name = item_name
            else:
                item_name = "N/A"

            store = soup.find('span', attrs={'itemprop': 'name'})
            if store:
                store = store.text.strip()
            else:
                store = "N/A"

            price_element = soup.find('div', {'data-test':"@web/Price/PriceFull"})
            if price_element:
                price = price_element.find('span', {'data-test': 'product-price'}).text.strip()
            else:
                price = "N/A"

            # Extract workplace type (if available)
            rating = soup.find('div', {'class': 'RatingSummary__StyledRating-sc-1ji27vb-0', 'data-test': 'rating-value'})
            if rating:
                rating = rating.text.strip()
            else:
                rating = "N/A"

            print("URL:", url)
            print("Item Name:", item_name)
            print("Store:", store)
            print("Price:", price)
            print("Rating:", rating)

            # Prepare the data to be sent back to the extension
            data = {
                'url': url,
                'item_name': item_name,
                'store': store,
                'price': price,
                'rating': rating,
            }

            return JsonResponse({'success': True, 'data': data})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})

    return JsonResponse({'success': False, 'data': {}})





def submit_info(request):
    if request.method == 'POST':
        url = request.POST['url']
        item_name = request.POST['item_name']
        store = request.POST['store']
        price = request.POST['price']
        rating = request.POST['rating']

        # Save the item information to the database
        item_info = Item.objects.create(
            url=url,
            item_name=item_name,
            store=store,
            price=price,
            rating=rating,
        )
        item_info.save()

        return JsonResponse({'success': True})
    
    return JsonResponse({'success': False})


def success_view(request):
    return render(request, 'success.html')

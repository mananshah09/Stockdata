from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from datetime import datetime, timedelta
today = datetime.today().date()


# Calculate the date 30 days ago
thirty_days_ago = today - timedelta(days=30)

# Format the dates as YYYY-MM-DD
today_formatted = today.strftime('%Y-%m-%d')
thirty_days_ago_formatted = thirty_days_ago.strftime('%Y-%m-%d')
print("Dates")
print(today_formatted,thirty_days_ago_formatted)

# Calculate the date 6 months and 1 day ago
month6ago = today - timedelta(days=30*6 + 1)

# Format the date as YYYY-MM-DD
month6ago_formatted = month6ago.strftime('%Y-%m-%d')


app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)  # Enable CORS for all routes
FINNHUB_API_URL = 'https://finnhub.io/api/v1/stock/profile2'
FINNHUB_API_URL2 = 'https://finnhub.io/api/v1/quote'
FINNHUB_API_URL3 = 'https://finnhub.io/api/v1/stock/recommendation'
FINNHUB_API_URL5 = 'https://finnhub.io/api/v1/company-news'

#polygon_url='https://api.polygon.io/v2/aggs/ticker/'

@app.route('/')
def index():
    return app.send_static_file('WebTechassignment2.html')
#return HTML static file dont forget lose marks otherwise
#https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/2023-01-09/2023-07-09?adjusted=true&sort=asc&apiKey=ctO8iVF_Gi19afBovU1ZSr6UIxqt8Fr3
@app.route('/charts', methods=['GET'])
def searchcharts():
    
    search_text = request.args.get('searchText')
    polygon_url = f"https://api.polygon.io/v2/aggs/ticker/{search_text}/range/1/day/{month6ago_formatted}/{today_formatted}"
    api_key = 'd2_iEHIy7JFTgkthU5FkWOYF2YcCQVzv'
    params = {
        'adjusted': 'true',
        'sort': 'asc',
        'apiKey': api_key
    }
    response2 = requests.get(polygon_url, params=params)

    # Check if response2 is successful
    if response2.status_code == 200:
        try:
            data2 = response2.json()
            print("Data for CHarts:", data2["results"])
            return jsonify(data2)
        except Exception as e:
            print("Response content:", response2.content)
            print("Error decoding response2 JSON:", e)
            return jsonify({'error': 'Failed to decode response2 JSON'})
    else:
        return jsonify({'error': 'Failed to fetch data from Finnhub API'})




#News News
@app.route('/news', methods=['GET'])
def searchnews():
    search_text = request.args.get('searchText')
    api_key = 'cn4rj79r01qgb8m66hbgcn4rj79r01qgb8m66hc0'
    params = {
        'symbol': search_text,
        'from':thirty_days_ago_formatted,
        'to':today_formatted,
        'token': api_key
    } 
    response5 = requests.get(FINNHUB_API_URL5, params=params)
    print("response5 is initiated")

    # Check if response2 is successful
    if response5.status_code == 200:
        try:
            data5 = response5.json()
            print("Data from response5:", data5[0])
            print(data5)
            return jsonify(data5)
        except Exception as e:
            print("Response content:", response5.content)
            print("Error decoding response5 JSON:", e)
            return jsonify({'error': 'Failed to decode response5 JSON'})
    else:
        return jsonify({'error': 'Failed to fetch data from Finnhub API'})





@app.route('/trends', methods=['GET'])
def searchtrends():
    search_text = request.args.get('searchText')
    api_key = 'cn4rj79r01qgb8m66hbgcn4rj79r01qgb8m66hc0'
    params = {
        'symbol': search_text,
        'token': api_key
    } 
    response3 = requests.get(FINNHUB_API_URL3, params=params)

    # Check if response2 is successful
    if response3.status_code == 200:
        try:
            data3 = response3.json()
            print("Data from response3:", data3)
            print("Dates")
            print(today_formatted,thirty_days_ago_formatted)
            return jsonify(data3)
        except Exception as e:
            print("Response content:", response3.content)
            print("Error decoding response2 JSON:", e)
            return jsonify({'error': 'Failed to decode response3 JSON'})
    else:
        return jsonify({'error': 'Failed to fetch data from Finnhub API'})



@app.route('/stock', methods=['GET'])
def searchstock():
    search_text = request.args.get('searchText')
    api_key = 'cn4rj79r01qgb8m66hbgcn4rj79r01qgb8m66hc0'
    params = {
        'symbol': search_text,
        'token': api_key
    } 
    response2 = requests.get(FINNHUB_API_URL2, params=params)

    # Check if response2 is successful
    if response2.status_code == 200:
        try:
            data2 = response2.json()
            print("Data from response2:", data2)
            return jsonify(data2)
        except Exception as e:
            print("Response content:", response2.content)
            print("Error decoding response2 JSON:", e)
            return jsonify({'error': 'Failed to decode response2 JSON'})
    else:
        return jsonify({'error': 'Failed to fetch data from Finnhub API'})



@app.route('/api', methods=['GET'])
def search():
    search_text = request.args.get('searchText')
    api_key = 'cn4rj79r01qgb8m66hbgcn4rj79r01qgb8m66hc0'
    params = {
        'symbol': search_text,
        'token': api_key
    } 
    response = requests.get(FINNHUB_API_URL, params=params)
    

    


    #this code first part works
    if response.status_code == 200:
        data = response.json()
        print("data",data)
        return jsonify(data)
    else:
        return jsonify({'error': 'Failed to fetch data from Finnhub API'})

if __name__ == '__main__':
    app.run(debug=True)
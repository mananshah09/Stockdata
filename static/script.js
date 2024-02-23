

// Define variables globally
const resultContainer = document.getElementById('result');
let logo = '';
let companyname = '';
let ticker = '';
let exchange = '';
let ipo = '';
let finnhubIndustry = '';

let newcal=true;

const stockSummaryDiv = document.getElementById('stocksummary');
let tikersymbol='';
let tradingday='';
let pc='';
let openingprice='';
let highprice='';
let lowprice='';
let change='';
let changepercent='';

const trends = document.getElementById('trends');
let sell='';
let buy='';
let hold='';
let strongsell='';
let strongbuy='';

const Newsinfo = document.getElementById('newsinfo');
let newsdata;
const chartss = document.getElementById('container');

// Initialize empty arrays for date, stock price chart, and volume
var date = [];
var stockpricechart = [];
var volume1 = [];
var datacharts111={};
var resetButton = document.querySelector(".clear-button");
var errorMessage = document.querySelector(".error-message");
errorMessage.style.display = "none";

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.search-form');
    const searchInput = document.getElementById('searchInput');
    const resultContainer = document.getElementById('result'); // Container to display the result
    const buttonsContainer = document.getElementById('buttonsContainer'); // Reference the buttons container
    const alertMessage = document.getElementById('alertMessage');



    

    resetButton.addEventListener("click", function() {
        resultContainer.style.display='none';
        stockSummaryDiv.style.display='none';
        Newsinfo.style.display='none';
        chartss.style.display='none';
        buttonsContainer.style.display='none';
        errorMessage.style.display = "none";
        
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        var searchText = searchInput.value.trim(); // Get the search text and remove leading/trailing whitespace

        if (searchText !== '') { // Check if search text is not empty
            // Call your Flask API here with the search text
            searchText=searchText.toUpperCase();
            callTrendsAPI(searchText);
            
            callFlaskAPI(searchText);
            callStockAPI(searchText);
            
            callNewsAPI(searchText);
            callcharts(searchText);


            newcal=true;
            console.log("Calling Button")
            
            
            
        }
        else{
            
            
        }
        // Create and append four buttons below the search bar
        
    });
    function validateForm() {
        var input = document.getElementById("myInput").value;
        if (input === "") {
          alert("Please fill out this field");
          return false; // Prevent form submission
        }
        return true; // Allow form submission
      }
      

    
    function callcharts(searchText) {
        console.log('Calling News API with search text:', searchText);
        // Make a GET request to Flask server with search text as query parameter
        fetch(`https://project1-45c23.wl.r.appspot.com/charts?searchText=${encodeURIComponent(searchText)}`, {
            method: 'GET', // Use GET method to send data to the server
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(datacharts1111 => {
            datacharts111 = datacharts1111;
            console.log("Charts data recieved data5",datacharts111)
            chartsdata=datacharts111["results"];
            console.log("charts data atatatat",chartsdata)
            console.log("TYPEEEEEEE",typeof datacharts111)
            charrttt=datacharts111
            
            
            chartsdata.forEach(function(item) {
                // Extract date, stock price chart, and volume from each object
                date.push(item.t); // Conert timestamp to Date object
                stockpricechart.push(item.c);
                volume1.push(item.v);
                //console.log("data is here",volume,date,stockpricechart)
            });
           
            
        })
        .catch(error => {
            console.error('Error:', error);
        });

    }

    // Sample data
const data = {
    charts_data: {
        ticker: "AAPL",
        results: [
            { t: 1645256400, c: 145.48, v: 100000 },
            { t: 1645170000, c: 144.73, v: 120000 },
            // Add more data points as needed
        ]
    }
};


const volumeMultiplier = 1000000; // 1 million
// Function to display charts
function displayChartsInfo() {
    const chartData = [];
    const volumeData = [];
    let today_date = new Date();
    console.log(datacharts111);
    datacharts111.results.forEach(result => {
        console.log("result result result",result)
        console.log("heeheh",result.c)
        const date = result.t; // Convert Unix timestamp to milliseconds
        const price = result.c;
        const volume = result.v;

        chartData.push([date, price]);
        volumeData.push([date, volume]);
    });
    const stockPriceMax = Math.max(...chartData.map(([_, price]) => price));
    const volumeMax = Math.max(...volumeData.map(([_, volume]) => volume));
 
    Highcharts.chart('container', {
        rangeSelector: {
            enabled: true,
            allButtonsEnabled: true,
            selected: 0,
            buttons: [{
                type: 'day',
                count: 7,
                text: '7D'
            }, {
                type: 'day',
                count: 15,
                text: '15D'
            }, {
                type: 'month',
                count: 1,
                text: '1M'
            }, {
                type: 'month',
                count: 3,
                text: '3M'
            }, {
                type: 'month',
                count: 6,
                text: '6M'
            }],
            buttonTheme: {
                width: 60
            },
            inputEnabled: false // disable input box for manual date entry
        },
        title: {
            text: 'Stock Price ' + tikersymbol + " " + today_date.toISOString().split('T')[0]
        },subtitle: {
            text: '<a class="polylink" id="polylink" target="_blank" href="https://polygon.io">Source: Polygon.io</a>'
        },
        xAxis: {
            type: 'datetime',
            ordinal: true,
            events: {
                afterSetExtremes: function() {
                    const chart = this.chart;
                    var stockPriceMax = Math.max(...chart.series[0].yData);
                    var volumeMax = Math.max(...chart.series[1].yData);
                    chart.yAxis[1].setExtremes(0, Math.max(volumeMax, stockPriceMax * 2 * volumeMultiplier));
                }}
            // events: {
            //     afterSetExtremes: function() {
            //         const chart = this.chart;
            //         chart.yAxis[1].setExtremes(0, Math.max(...volumeData)*2)
            //     }
            // }
        },
        navigator: {
            enabled: true
        },
        scrollbar: {
            enabled: true
        },

        yAxis: [{
            labels: {
                align: 'right',
            },
            title: {
                text: 'Price'
            },
            height: '100%',
            offset: 0,
            opposite: false
        }, {
            labels: {
                align: 'left',
            },
            title: {
                text: 'Volume'
            },
            height: '100%',
            offset: 0,
            opposite: true,
            lineWidth: 1
        }],
        series: [{
            name: 'Stock Price',
            data: chartData,
            type: 'area',
            marker: {
                enabled: false
            },
            tooltip: {
                valueDecimals: 2
            },
            yAxis: 0 // Use the first y-axis
        }, {
            name: 'Volume',
            data: volumeData,
            type: 'column',
            yAxis: 1, // Use the second y-axis
            color: 'black',
            tooltip: {
                valueDecimals: 2
            },
        }],
        plotOptions: {
            area: {
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            },
            column: {
                pointWidth: 5
            }
        },
        tooltip: {
            shared: true,
            formatter: function() {
                var tooltip = '<span style="font-size: 10px">' + Highcharts.dateFormat('%A, %b %e, %Y', this.x) + '</span><br/>';
    
                // Loop through each point in the series
                this.points.forEach(function(point) {
                    tooltip += '<span style="color:' + point.series.color + '">\u25CF</span> ' + point.series.name + ': <b>' + point.y.toFixed(2) + '</b><br/>';
                });
    
                return tooltip;
            },
            crosshairs: true
        },
        events: {
            load: function() {
                console.log(stockPriceMax * 2 * volumeMultiplier,"USCUSCUSC")
                // After the chart has loaded, set the y-axis extremes for volume
                this.yAxis[1].setExtremes(0, stockPriceMax * 2 * volumeMultiplier);
            }
        }

    });
}












    function callNewsAPI(searchText) {
        console.log('Calling News API with search text:', searchText);
        // Make a GET request to Flask server with search text as query parameter
        fetch(`https://project1-45c23.wl.r.appspot.com/news?searchText=${encodeURIComponent(searchText)}`, {
            method: 'GET', // Use GET method to send data to the server
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data5 => {
            console.log("News data recieved data5",data5)
            newsdata=data5;
            console.log("Newssssdata",newsdata[1])
           
            
        })
        .catch(error => {
            console.error('Error:', error);
        });

    }




    function callTrendsAPI(searchText) {
        console.log('Calling Stock API with search text:', searchText);
        // Make a GET request to Flask server with search text as query parameter
        fetch(`https://project1-45c23.wl.r.appspot.com/trends?searchText=${encodeURIComponent(searchText)}`, {
            method: 'GET', // Use GET method to send data to the server
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data3 => {
            console.log('Received trends response from Flask:', data3[0]);
            trendsdata=data3[0]
            try{
            strongsell=trendsdata.strongSell;}
            catch (error) {
                console.error('Error processing data:', error);
                errorMessage.style.display = "block";
                resultContainer.style.display='none';
                stockSummaryDiv.style.display='none';
                Newsinfo.style.display='none';
                chartss.style.display='none';
                buttonsContainer.style.display='none';

            }
            sell=trendsdata.sell;
            hold=trendsdata.hold;
            buy=trendsdata.buy;
            strongbuy=trendsdata.strongBuy;

            
        })
        .catch(error => {
            console.error('Error:', error);
        });

    }






    
    function callStockAPI(searchText) {
        console.log('Calling Stock API with search text:', searchText);
        // Make a GET request to Flask server with search text as query parameter
        fetch(`https://project1-45c23.wl.r.appspot.com/stock?searchText=${encodeURIComponent(searchText)}`, {
            method: 'GET', // Use GET method to send data to the server
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data2 => {
            console.log('Received response from Flask: datatata2', data2);

            tikersymbol=searchText;
            tradingday=data2.t;
            pc=data2.pc;
            var epochTime = parseInt(tradingday, 10);
            var date = new Date(epochTime * 1000);
            var options = { year: 'numeric', month: 'long', day: 'numeric' };
            tradingday = date.toLocaleDateString('en-US', options);
            openingprice=data2.o;
            highprice=data2.h;
            lowprice=data2.l;
            change=data2.d;
            changepercent=data2.dp;

            console.log('data recieved', tikersymbol,change,pc)




            
            
            
        })
        .catch(error => {
            console.error('Error:', error);
            alertMessage.textContent = "An error occurred while fetching  data. Please try again later.";
            resultContainer.style.display='none';
            stockSummaryDiv.style.display='none';
            Newsinfo.style.display='none';
            chartss.style.display='none';
            buttonsContainer.style.display='none';
        });

    }

    function callFlaskAPI(searchText) {
        console.log('Calling Flask API with search text:', searchText);
        // Make a GET request to Flask server with search text as query parameter
        fetch(`https://project1-45c23.wl.r.appspot.com/api?searchText=${encodeURIComponent(searchText)}`, {
            method: 'GET', // Use GET method to send data to the server
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Received response from Flask:', data);
            console.log("data is below MananManan",data.name);
            
            // Check if the properties exist in the received data
            logo = data.logo || '';
            companyname = data.name || '';
            ticker = data.ticker || '';
            exchange = data.exchange || '';
            ipo = data.ipo || '';
            finnhubIndustry = data.finnhubIndustry || '';

            // Update the HTML content to display the retrieved data
            if (data.name){
                errorMessage.style.display = "none";
                createButtons(buttonsContainer);
                resultContainer.innerHTML = `
                <p><img src="${logo}" alt="Company Logo"></p>
                <table>
                    <tr>
                        <td style="text-align: right;"><strong>Company Name:</strong></td>
                        <td style="text-align: left;">${companyname}</td>
                    </tr>
                    <tr>
                        <td style="text-align: right;"><strong>Stock Ticker Symbol:</strong></td>
                        <td style="text-align: left;">${ticker}</td>
                    </tr>
                    <tr>
                        <td style="text-align: right;"><strong>Stock Exchange Code:</strong></td>
                        <td style="text-align: left;">${exchange}</td>
                    </tr>
                    <tr>
                        <td style="text-align: right;"><strong>Company Start Date:</strong></td>
                        <td style="text-align: left;">${ipo}</td>
                    </tr>
                    <tr>
                        <td style="text-align: right;"><strong>Category:</strong></td>
                        <td style="text-align: left;">${finnhubIndustry}</td>
                    </tr>
                </table>
            `;
            
            resultContainer.style.display='block';
            stockSummaryDiv.style.display='none';
            Newsinfo.style.display='none';
            Newsinfo.innerHTML = '';
            }
            
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    function createButtons(buttonsContainer) {
        console.log("In button container");

        // Clear existing buttons
        buttonsContainer.style.display='block';
        buttonsContainer.innerHTML = '';

        // Create four buttons with labels A, B, C, D
        const buttons = ['Company', 'Stock Summary', 'Charts', 'Latest News'];
        buttons.forEach(label => {
            const button = document.createElement('button');
            button.textContent = label;
            buttonsContainer.appendChild(button);

        if (label=="Charts"){
            button.addEventListener('click',function(){
                resultContainer.style.display='none';
                stockSummaryDiv.style.display='none';
                Newsinfo.style.display='none';
                chartss.style.display='block';

                displayChartsInfo();
                

            })
        }


        if (label=='Latest News'){
            button.addEventListener('click',function(){
                resultContainer.style.display='none';
                stockSummaryDiv.style.display='none';
                Newsinfo.style.display='block';
                chartss.style.display='none';

                function isValidArticle(article) {
                    return article.hasOwnProperty('image') && article.image !== '' &&
                           article.hasOwnProperty('url') && article.url !== '' &&
                           article.hasOwnProperty('headline') && article.headline !== '' &&
                           article.hasOwnProperty('datetime') && article.datetime !== '';
                }
                
                // Filter valid articles and stop when you have 5
                var validArticles = [];
                for (var i = 0; i < newsdata.length && validArticles.length < 5; i++) {
                    var article = newsdata[i];
                    if (isValidArticle(article)) {
                        validArticles.push(article);
                    }
                }
                function formatDate(timestamp) {
                    var date = new Date(timestamp * 1000); // Convert to milliseconds
                    var options = { day: '2-digit', month: 'long', year: 'numeric' };
                    return date.toLocaleDateString('en-US', options);
                }
                
                // Display the valid articles
                // function formatDate(epochTime) {
                //     var date = new Date(epochTime * 1000); // Convert to milliseconds
                //     var options = { day: 'numeric', month: 'long', year: 'numeric' };
                //     return date.toLocaleDateString('en-US', options);
                // }
                

                // Loop through valid articles and create article containers
                if (newcal==true){
                    newcal=false;
                for (var i = 0; i < 5; i++) {
                    var article = validArticles[i];
                    
                    // Create article container
                    var articleDiv = document.createElement('article');
                    articleDiv.className = 'article';
                    
                    // Create and append image element
                    var image = document.createElement('img');
                    image.src = article.image;
                    image.className = 'article-image'; // Add a class for styling
                    articleDiv.appendChild(image);
                    
                    // Create a div to contain other content
                    var contentDiv = document.createElement('div');
                    contentDiv.className = 'article-content'; // Add a class for styling
                    
                    // Create and append headline element
                    var headline = document.createElement('h3');
                    headline.textContent = article.headline;
                    contentDiv.appendChild(headline);

                    // Create and append datetime element
                    var datetime = document.createElement('p');
                    datetime.textContent = formatDate(article.datetime);
                    contentDiv.appendChild(datetime);
                    
                    // Create and append hyperlink element
                    var urlLink = document.createElement('a');
                    urlLink.href = article.url;
                    urlLink.textContent = "See Original Post";
                    urlLink.target = "_blank"; // Open in new tab
                    contentDiv.appendChild(urlLink);
                    
                    
                    
                    // Append content div to the article div
                    articleDiv.appendChild(contentDiv);
                    
                    // Append article container to the news div
                    Newsinfo.appendChild(articleDiv);
                }}

            })
        }

            // Add event listener to the "Stock Summary" button
        if (label === 'Stock Summary') {
            button.addEventListener('click', function() {
                stockSummaryDiv.style.display='block';
                resultContainer.style.display='none';
                trends.style.display='block';
                Newsinfo.style.display='none';
                chartss.style.display='none';

                // Display "Hello World" in the div with id "stocksummary"
                var change1 = parseFloat(change);
                var imageUrl = (change >= 0) ? 'GreenArrowUp.png' : 'RedArrowDown.png';

                stockSummaryDiv.innerHTML = `
                <table class="stocksummary">
                    <tr>
                        <td><strong>Stock Ticker Symbol:</strong></td>
                        <td>${tikersymbol}</td>
                    </tr>
                    <tr>
                        <td><strong>Trading Day:</strong></td>
                        <td>${tradingday}</td>
                    </tr>
                    <tr>
                        <td><strong>Previous Closing Price:</strong></td>
                        <td>${pc}</td>
                    </tr>
                    <tr>
                        <td><strong>Opening Price:</strong></td>
                        <td>${openingprice}</td>
                    </tr>
                    <tr>
                        <td><strong>High Price:</strong></td>
                        <td>${highprice}</td>
                    </tr>
                    <tr>
                        <td><strong>Low Price:</strong></td>
                        <td>${lowprice}</td>
                    </tr>
                    <tr>
                        <td><strong>Change:</strong></td>
                        <td>${change}<img src="${imageUrl}" alt="Arrow"></td>
                    </tr>
                    <tr>
                        <td><strong>Change Percent:</strong></td>
                        <td>${changepercent}<img src="${imageUrl}" alt="Arrow"></td>
                    </tr>
                </table>

                <div class="recommendation_trend">
                

                <ul>
                    <li><div class="high">Strong <br> Sell</div></li>
                    <li class='one'>${strongsell}</li>
                    <li class='two'>${sell}</li>
                    <li class='three'>${hold}</li>
                    <li class='four'>${buy}</li>
                    <li class='five'>${strongbuy}</li>
                    <li><div class="low">Strong <br> Buy</div></li>
                    
                </ul>
                
                 </div>
              
                <div class="trend_text">Recommendation Trends</div>
                </div>
               
                `;
               
                
                
            });
        }
        if (label=='Company'){
            button.addEventListener('click',function(){
                resultContainer.style.display='block';
                stockSummaryDiv.style.display='none';
                Newsinfo.style.display='none';
                chartss.style.display='none';
                

            });
        }
            
        });
        
    }
});

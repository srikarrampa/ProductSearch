const express = require('express');
const app = express();
var http=require('http');
var https= require('https');
var url= require('url');
const PORT = process.env.PORT || 8080;


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
});
app.use(express.static(__dirname));

app.get('/zipcode_auto' , function (req, res)
{
   res.setHeader("Content-Type","text/plain");
   res.setHeader("Access-Control-Allow-Origin","*");
   var parameters = url.parse(req.url, true).query;
   var auto_zip_url = 'http://api.geonames.org/postalCodeSearchJSON?postalcode_startsWith='+parameters.zip+'&username=[USERNAME]&country=US&maxRows=5';
   http.get(auto_zip_url,function(requ,resu)
   {
   	var results = "";
   	requ.on('data',function(data)
   	{
   		results+=data;

   	});
   	requ.on('end',function()
   	{
   		return res.send(results);

   	});

   });
   // return res.send("Worked");
});

app.get('/searching' , function (req, res)
{
   res.setHeader("Content-Type","text/plain");
   res.setHeader("Access-Control-Allow-Origin","*");
   var parameters = url.parse(req.url, true).query;
   // console.log(parameters.Keyword);
   var search_url = 'http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=[APP-ID]&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&paginationInput.entriesPerPage=50&keywords='+encodeURI(parameters.Keyword)+'&buyerPostalCode='+parameters.buyerPostalCode;
   if(parameters.Category != "-1")
   {
      search_url += '&categoryId='+parameters.Category;
   }
   var counter = 0;
   search_url += '&itemFilter('+counter+').name=MaxDistance&itemFilter('+counter+').value='+parameters.distance;
   counter += 1;
   var count_check = 0;
   
   if(parameters.free == "true")
   {
      // console.log("free");
      search_url += '&itemFilter('+counter+').name=FreeShippingOnly&itemFilter('+counter+').value='+parameters.free;
      counter += 1;
   }
   if(parameters.local == "true")
   {
      // console.log("local");
      search_url += '&itemFilter('+counter+').name=LocalPickupOnly&itemFilter('+counter+').value='+parameters.local;
      counter += 1;
   }
   search_url += '&itemFilter('+counter+').name=HideDuplicateItems&itemFilter('+counter+').value=true';
   counter +=1;
   if(parameters.new == "true")
   {
      search_url += '&itemFilter('+counter+').name=Condition&itemFilter('+counter+').value('+count_check+')=New';
      count_check += 1;
   }
   if(parameters.used == "true")
   {
      search_url += '&itemFilter('+counter+').name=Condition&itemFilter('+counter+').value('+count_check+')=Used';
      count_check += 1;
   }
   if(parameters.unspecified == "true")
   {
      search_url += '&itemFilter('+counter+').name=Condition&itemFilter('+counter+').value('+count_check+')=Unspecified';
      count_check += 1;
   }
   search_url += '&outputSelector(0)=SellerInfo&outputSelector(1)=StoreInfo';
   console.log(search_url);
   http.get(search_url,function(requ,resu)
   {
      var results = "";
      requ.on('data',function(data)
      {
         results+=data;

      });
      requ.on('end',function()
      {
         // console.log(results);
         return res.send(results);

      });

   });
   // return res.send("Worked");
});

app.get('/shopping' , function (req, res)
{
   res.setHeader("Content-Type","text/plain");
   res.setHeader("Access-Control-Allow-Origin","*");
   var parameters = url.parse(req.url, true).query;
   var shopping_url = 'http://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=[APP-ID]&siteid=0&version=967&ItemID='+parameters.itemId+'&IncludeSelector=Description,Details,ItemSpecifics';
   // console.log(shopping_url);
   http.get(shopping_url,function(requ,resu)
   {
      var results = "";
      requ.on('data',function(data)
      {
         results+=data;

      });
      requ.on('end',function()
      {
         // console.log(results);
         return res.send(results);

      });

   });
});

app.get('/google_search' , function (req, res)
{
   res.setHeader("Content-Type","text/plain");
   res.setHeader("Access-Control-Allow-Origin","*");
   var parameters = url.parse(req.url, true).query;
   var google_url = 'https://www.googleapis.com/customsearch/v1?q='+encodeURI(parameters.googlesearching)+'&cx=010618545303057637593:vvou7p-g_us&imgSize=huge&imgType=news&num=8&searchType=image&key=[APP-KEY]';
   console.log(google_url);
   https.get(google_url,function(requ,resu)
   {
      var results = "";
      requ.on('data',function(data)
      {
         results+=data;

      });
      requ.on('end',function()
      {
         return res.send(results);

      });

   });
});

app.get('/similarsearching' , function (req, res)
{
   res.setHeader("Content-Type","text/plain");
   res.setHeader("Access-Control-Allow-Origin","*");
   var parameters = url.parse(req.url, true).query;
   var similar_url = 'http://svcs.ebay.com/MerchandisingService?OPERATION-NAME=getSimilarItems&SERVICE-NAME=MerchandisingService&SERVICE-VERSION=1.1.0&CONSUMER-ID=[APP-ID]&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&itemId='+parameters.itemids;
   http.get(similar_url,function(requ,resu)
   {
      var results = "";
      requ.on('data',function(data)
      {
         results+=data;

      });
      requ.on('end',function()
      {
         return res.send(results);

      });

   });

});






// Listen to the App Engine-specified port, or 8080 otherwise

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
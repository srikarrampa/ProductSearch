var app = angular.module('myapp',['ngAnimate','angular-svg-round-progressbar','ngMaterial','ngAria']);
app.controller('mycontroller', function($scope,$http,$timeout, $q, $log)
{
	localStorage.clear();
	$scope.location="zip_curr";
	$scope.initial = {Keyword:"",Category:"allcategories",dist:"10",new:false,used:false,unspecified:false,local:false,free:false,zip:""};
	$scope.val = angular.copy($scope.initial);
	$scope.zip_val = "";
	$scope.button_details=false;
	$scope.res_table = "";
	$scope.res_shipping_info = {};
	$scope.display_product=false;
	$scope.show_pic = false;
	// $scope.progress_bar_vlaue = true;
	$scope.progress_val = false;
	$scope.zip_valid = /[0-9]/;

	if($scope.location=="zip_curr")
	{
		$http.get("http://ip-api.com/json")
        .then(function(response) 
        {
            $scope.zip_val = response.data.zip;
            console.log($scope.zip_val);
        });
	}

	$scope.clear_func = function() 
	{
		$scope.val = angular.copy($scope.initial);
		$scope.zip_val = "";
		$scope.button_details=false;
		$scope.res_table = "";
		$scope.res_shipping_info = {};
		$scope.display_product=false;
		$scope.show_pic = false;
		// $scope.progress_bar_vlaue = true;
		$scope.progress_val = false;
		$scope.wishlist_tab = false;
		$scope.location="zip_curr";
		if($scope.mytable!=undefined)
		{
			$scope.mytable.destroy();
		}
		
		$scope.check_val = false;
		$scope.get_photos_g = false;
		$scope.checkrecords = false;
		if($scope.location=="zip_curr")
		{
			$http.get("http://ip-api.com/json")
	        .then(function(response) 
	        {
	            $scope.zip_val = response.data.zip;
	            console.log($scope.zip_val);
	        });
		}
	}

	$scope.selchange = function (searchText) 
	{
		$scope.val.zip = searchText;
		$scope.check_val = isNaN(searchText);
	}
	// auto complete in zipcode
	$scope.auto = function (searchStr)
	{

		if(!searchStr) {
        var searchStrEncoded = "";
    	} else {
        var searchStrEncoded = searchStr;
    	}


		// var parameters={};
		// parameters.zip = searchText;
		// $scope.values = [];
		zip_url = "http://hw8nodejs-235221.appspot.com/zipcode_auto?zip="+searchStrEncoded;
		return $http({
	        url: zip_url,
	        method: 'GET'
	    }).then(function (data) {
	    	console.log(data.data.postalCodes);
	    	$scope.zip_values = data.data;
	        return data.data.postalCodes;

	    })
	    .catch(function(e)
			{
				console.log("Error: Geonames API does not work - ",e);
			})
		

	}
	$scope.results_tab = true;
	$scope.wishlist_tab = false;
	$scope.movetowishlist = function () 
	{
		$scope.get_all_items = "";
		$scope.results_tab = true;
		$scope.wishlist_tab = false;
		$scope.display_product = false;
		$scope.detail_hide = false;
	}
	$scope.movetoresults = function () 
	{

		$scope.results_tab = false;
		$scope.wishlist_tab = true;
		$scope.display_product = false;
		$scope.detail_hide = false;
	}
	$scope.auto_fill = function (zipcode) 
	{
		$scope.val.zip = zipcode;
		$scope.auto_list = true; 
	}

	$scope.wishlist = {};
	$scope.wishlist_len = Object.keys($scope.wishlist).length;
	
	$scope.wishlistfunc_to_remove = function (wishlist_val, index) 
	{
		$scope.res_table[index].isClicked = "true";
		localStorage.setItem($scope.res_table[index].itemId[0],JSON.stringify($scope.res_table[index]));
		$scope.wishlist[$scope.res_table[index].itemId[0]] = $scope.res_table[index];
		$scope.wishlist_len = $scope.wishlist_len + 1;

	}
	$scope.wishlistfunc_to_add = function (wishlist_val, index) 
	{
		$scope.res_table[index].isClicked = "false";
		localStorage.removeItem($scope.res_table[index].itemId[0]);
		$scope.wishlist_len = $scope.wishlist_len - 1;
		delete $scope.wishlist[$scope.res_table[index].itemId[0]];

	}
	$scope.remove_from_wishlist = function (wishlist_val, index) 
	{
		count = 0;
		for (j = 0; j < $scope.res_table.length; j++) 
		{
			if(wishlist_val.itemId[0] == $scope.res_table[j].itemId[0])
			{
				$scope.res_table[j].isClicked = "false";
				count=count+1;
			}
		}
		$scope.wishlist_len = $scope.wishlist_len - 1;
		localStorage.removeItem(wishlist_val.itemId[0]);
		delete $scope.wishlist[wishlist_val.itemId[0]];

	}
	$scope.function_to_addinwishlist = function (box_in_second) 
	{
		for (j = 0; j < $scope.res_table.length; j++) 
		{
			if(box_in_second.ItemID == $scope.res_table[j].itemId[0])
			{
				$scope.res_table[j].isClicked = "true";
				localStorage.setItem($scope.res_table[j].itemId[0],JSON.stringify($scope.res_table[j]));
				$scope.wishlist[$scope.res_table[j].itemId[0]] = $scope.res_table[j];
				$scope.wishlist_len = $scope.wishlist_len + 1;
			}
		}
	}
	$scope.function_to_removeinwishlist = function (box_in_second) 
	{
		for (j = 0; j < $scope.res_table.length; j++) 
		{
			if(box_in_second.ItemID == $scope.res_table[j].itemId[0])
			{
				$scope.res_table[j].isClicked = "false";
				localStorage.removeItem($scope.res_table[j].itemId[0]);
				$scope.wishlist_len = $scope.wishlist_len - 1;
				delete $scope.wishlist[$scope.res_table[j].itemId[0]];
			}
		}
	}
	$scope.shareinfb = function (fb_details) 
	{
		

		FB.ui({
			display:'popup',
			method:'share',
			quote:$scope.desc,
			href:fb_details.ViewItemURLForNaturalSearch,
		},function(response){});
	}
	// first API call for getting table details
	$scope.submit_search = function ()
	{
		$scope.results_tab = true;
		$scope.detail_hide = false;
		$("#progres_bar_id").delay(200).fadeOut("fast");
        $scope.progres_bar_id = false;
		var parameters="";
		parameters={};
		parameters.keyword = encodeURI($scope.val.Keyword);
		if($scope.val.Category == "allcategories")
		{
			$scope.cat_id = "-1";
		}
		else if($scope.val.Category == "Art")
		{
			$scope.cat_id = "550";
		}
		else if($scope.val.Category == "Baby")
		{
			$scope.cat_id = "2984";
		}
		else if($scope.val.Category == "Books")
		{
			$scope.cat_id = "267";
		}
		else if($scope.val.Category == "Clothing")
		{
			$scope.cat_id = "11450";
		}
		else if($scope.val.Category == "Computer")
		{
			$scope.cat_id = "58058";
		}
		else if($scope.val.Category == "Health")
		{
			$scope.cat_id = "26395";
		}
		else if($scope.val.Category == "Music")
		{
			$scope.cat_id = "11233";
		}
		else if($scope.val.Category == "Video")
		{
			$scope.cat_id = "1249";
		}
		parameters.cat_id = $scope.cat_id;
		if($scope.location=="zip_curr")
		{
			parameters.zip_val = $scope.zip_val;
		}
		if($scope.location=="zip_other")
		{
			parameters.zip_val = $scope.val.zip;
		}
		parameters.distance = $scope.val.dist;
		parameters.new = $scope.val.new;
		parameters.used = $scope.val.used;
		parameters.unspecified = $scope.val.unspecified;
		parameters.local = $scope.val.local;
		parameters.free = $scope.val.free;
		$scope.urls = "http://hw8nodejs-235221.appspot.com/searching?Keyword="+parameters.keyword+"&Category="+parameters.cat_id+"&buyerPostalCode="+parameters.zip_val+"&distance="+parameters.distance+"&local="+parameters.local+"&free="+parameters.free; 
		$scope.urls += "&new="+parameters.new+"&used="+parameters.used+"&unspecified="+parameters.unspecified;
		$scope.progress_val = true;
		$http.get($scope.urls)
		.then(function (response)
		{
			// console.log(response);
			if(response.data.findItemsAdvancedResponse[0].searchResult[0]["@count"] == 0)
			{
				$scope.checkrecords = true;
				$scope.res_table = "";
			}
			else if(response.data!=undefined && response.data.findItemsAdvancedResponse[0].searchResult[0].item!=undefined)
			{
				
				$scope.res_table = response.data.findItemsAdvancedResponse[0].searchResult[0].item;
				console.log($scope.res_table);
				for (var i = 0; i < $scope.res_table.length; i++) 
				{
					$scope.res_shipping_info[$scope.res_table[i].itemId[0]] = $scope.res_table[i].shippingInfo;
					$scope.res_table[i]['isClicked'] = 'false';
					// $scope.res_shipping_info.push(response.data.findItemsAdvancedResponse[0].searchResult[0].item[i].shippingInfo);
				}
				
				$(document).ready(function()
            	{
            	// alert("DataTables");
            	
            	$scope.mytable= $("#datatables_my").DataTable({
					"info":false,
					"lengthChange":false,
					"autoWidth":false,
					"pageLength":10,
					"searching":false,
					"ordering":false,
					"language": {
					    "paginate": {
					      "previous": "&#171;Previous",
					      "next": "Next&#187;"
					    }
					  }

					// "paging":false
					
				});


				});

				

				
			}
		})
		
		

	}
	$scope.setpage = function (lists)
	{
		$scope.pageno = lists;
	}

	$scope.go_back = function () 
	{
		$scope.display_product = false;
		$scope.results_tab = true;
		$scope.detail_hide = false;
		// $scope.backing.back = 
	}

	$scope.details_button_enable = function (product_values) 
	{
		$scope.button_details = true;
		$scope.each_product = product_values;
		
	}

	$scope.details_tab = function () 
	{
		$scope.display_product = true;
		$scope.wishlist_tab = false;
	}
	$scope.higl = "";
	$scope.ebay_details_call =function (product_detail) 
	{
		$(document).ready(function()
            	{
            	// alert("DataTables");
            	$("#progres_bar_id").fadeIn("fast");
            	$("#progres_bar_id").delay(200).fadeOut("fast");
            	$scope.progres_bar_id = false;
            	});
		$scope.product_detail = product_detail;
		console.log(product_detail.itemId[0]);
		$scope.progres_bar_id = true;
		$scope.results_tab = false;
		$scope.detail_hide = true;
		// $scope.higl = product_detail.itemId[0];
		$scope.product_url = "http://hw8nodejs-235221.appspot.com/shopping?itemId="+product_detail.itemId[0];
		$http.get($scope.product_url)
		.then(function (response) 
		{
			console.log(response);
			$scope.detail_product_info = response.data.Item;
			$scope.detail_product_info['isClicked'] = product_detail.isClicked;
	
			$scope.desc = encodeURI("Buy " + $scope.detail_product_info.Title + " at $" + $scope.detail_product_info.CurrentPrice.Value +" from link below ");

		})


	}

	$scope.picture_show = function () 
	{
		$scope.show_pic = true;
	}

	$scope.get_photos_g = false;
	$scope.get_photos = function (detail_product_info) 
	{
		// var resul = document.getElementById('res').classList;
		// var wishl = document.getElementById('wish').classList;
		// if(resul.contains('btn-light'))
		// {
	 //      wishl.remove("btn-dark");
	 //      wishl.add("btn-light");
	 //      resul.remove("btn-light");
	 //      resul.add("btn-dark");
	 //   	}


		var search_title = detail_product_info.Title;
		console.log(search_title);
		$scope.google_photos = [];
		$scope.google_url = "http://hw8nodejs-235221.appspot.com/google_search?googlesearching="+search_title;
		$http.get($scope.google_url)
		.then(function (response) 
		{
			if(response.data == undefined || response.data.items == undefined)
			{
				$scope.get_photos_g = true;
			}
			else
			{

				// console.log(response.data);
				$scope.google_images = response.data.items;
				
			}
			
		})
	}

	$scope.shippinginfo = function (detail_product_info) 
	{
		$scope.shipping_details = $scope.res_shipping_info[detail_product_info.ItemID];

		// console.log($scope.shipping_details);
	}

	$scope.get_seller = function (detail_product_info) 
	{
		$scope.detail_product_infos = detail_product_info;
		// console.log($scope.detail_product_infos);
	}
	
	$scope.get_similar = function(detail_product_info)
	{
		$scope.similar_url = "http://hw8nodejs-235221.appspot.com/similarsearching?itemids="+detail_product_info.ItemID;
		$http.get($scope.similar_url)
		.then(function (response) 
		{
			// console.log(response.data);
			$scope.similar_items = response.data.getSimilarItemsResponse.itemRecommendations;
			$scope.similar_itemss = response.data.getSimilarItemsResponse.itemRecommendations.item;
			for (var l = 0; l < $scope.similar_itemss.length; l++) {
				$scope.similar_itemss[l]['days'] = parseInt($scope.similar_itemss[l].timeLeft.substring($scope.similar_itemss[l].timeLeft.indexOf("P")+1, $scope.similar_itemss[l].timeLeft.indexOf("D")));
				$scope.similar_itemss[l]['prices'] = parseInt($scope.similar_itemss[l].buyItNowPrice.__value__);
				$scope.similar_itemss[l]['sp'] = parseInt($scope.similar_itemss[l].shippingCost.__value__);
			}
			console.log($scope.similar_itemss);
			// $scope.sorting="";
			
			
		})
	}
	$scope.parseInt = parseInt;
	$scope.selected = "Default";
	$scope.selected_ad = "ASC";
	$scope.defaultvalue= "Default";
	$scope.rev_type = false;
	$scope.sortfunc = function (myvalue,similaritems) 
	{
		$scope.defaultvalue= myvalue;
		if(myvalue == "Product Name")
		{
			$scope.sorttype = 'title';
		}
		else if(myvalue == "Days Left")
		{
			$scope.sorttype = 'days';
		}
		else if(myvalue == "Price")
		{
			$scope.sorttype = 'prices';
		}
		else if(myvalue == "Shipping Cost")
		{
			$scope.sorttype = 'sp';
		}
		else if(myvalue == "Default")
		{
			$scope.sorttype = '';
		}
	}
	$scope.sortfuncrev = function (reverse,similaritem) 
	{
		if(reverse == "ASC")
		{
			console.log(reverse);
			$scope.rev_type = false;
		}
		else
		{
			$scope.rev_type = true;
		}
		// $scope.reverse = 
	}
	$scope.limit=5;
	$scope.full_list=function(list_similar)
	{
		$scope.limit=list_similar.length;
	}
	$scope.top5_list = function(list_similar) 
	{
     	$scope.limit = 5;
	}

	$scope.color_sel = function (color_s) 
	{
		for (var i = 1; i < color_s.length; i++) 
		{
			if(color_s[i] == color_s[i].toUpperCase())
			{
				return color_s.substring(0,i).toLowerCase();
			}

		}
		return color_s.toLowerCase();
	}

	$scope.getTotal = function (wishlistings) 
	{
		var total = 0.0;
		for (var i in wishlistings) {
			total = total+parseFloat(wishlistings[i].sellingStatus[0].currentPrice[0].__value__);
		}
		return total;
	}

})

function changetowishlist() 
{

	var resul = document.getElementById('res').classList;
	var wishl = document.getElementById('wish').classList;
	if(wishl.contains('btn-light'))
	{
      wishl.remove("btn-light");
      wishl.add("btn-dark");
      resul.remove("btn-dark");
      resul.add("btn-light");
   	}
}

function changetoresults() 
{
	var resul = document.getElementById('res').classList;
	var wishl = document.getElementById('wish').classList;
	if(resul.contains('btn-light'))
	{
      wishl.remove("btn-dark");
      wishl.add("btn-light");
      resul.remove("btn-light");
      resul.add("btn-dark");
   	}
}




$(document).ready(function()
            {

                $.getScript("http://connect.facebook.net/en_US/all.js#xfbml=1", function () {
                    FB.init({ appId: [app-id], status: true, cookie: true, xfbml: true });
                });

            });



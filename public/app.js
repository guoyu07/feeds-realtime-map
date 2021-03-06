var map;
var poly;
var userid;

// Function that subscribes to the feed and defines what to do when items
// are received, along with how many to load in from the past.
// Set your instance ID below!
$(document).ready(function() {
	userid = getCookie("user_id");
	const feeds = new Feeds({
		instanceId: "v1:us1:7ddeab23-f18c-4692-a59e-ca69dc5b848a", // If you're testing locally, change this to your Feeds Instance ID
	});
	const feed = feeds.feed("maps-demo-"+userid);

	feed.subscribe({
		previousItems: 20000,
		onOpen: () => {
			console.log("Feeds: Connection established");
		},
		onItem: item => {
			console.log(item);
			parseLocation(item);
		},
		onError: error => {
			console.error("Feeds error:", error);
		},
	});

	poly = new google.maps.Polyline({
		strokeColor: '#000000',
		strokeOpacity: 1.0,
		strokeWeight: 3
	});
	poly.setMap(map);

	$('#reset-map').click(resetMap);
});

// Function that sets up a Google Map, centered on the first point the
// server provides.
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 13,
		center: { lat: 51.52327, lng: -0.08271 }
	});
	var latlng = new google.maps.LatLng(51.52327, -0.08271);
	var marker = new google.maps.Marker({
		position: latlng,
		map: map,
		title: 'We are on our way!'
	});
}

function resetMap() {
	// Remove cookies
	document.cookie
	.split(";")
	.forEach(function(c) {
		document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
	});

	// Refresh page
	window.location.reload();
}

//Function which adds a point to the map at latitude x, longitude y.
function addPoint(x,y) {
	var latlng = new google.maps.LatLng(x,y);
	var path = poly.getPath();
	path.push(latlng);
}

// Function which gets called when data is received. It adds the
// location to the list, and recenters the map.
function parseLocation(latlong) {
	var remaining = latlong.data.remaining;
	if(remaining==0){
		return;
	}
	var lat=latlong.data.lat;
	var long=latlong.data.lng;
	console.log(lat,long);
	var latlng = new google.maps.LatLng(lat,long);
	addPoint(lat,long);
	map.panTo(latlng);
}

//W3Schools cookie function, used for user id
function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

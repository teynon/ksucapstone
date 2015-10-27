var com = com || {};
com.capstone = com.capstone || {};

com.capstone.helpers = {
    // Get the Leaflet bounding box for the specified point with a 
    getBoundingBox : function(latlng, meters) {
        var b1 = L.latLng(latlng.lat, latlng.lng);
        var b2 = L.latLng(latlng.lat, latlng.lng);
        b1.lat -= this.metersToLatitude(meters);
        b1.lng -= this.metersToLongitude(meters, latlng.lat);
        b2.lat += this.metersToLatitude(meters);
        b2.lng += this.metersToLongitude(meters, latlng.lat);
        return L.latLngBounds(b1, b2);
    },

    getCircle : function (latlng, meters) {
        var data = [];
        var degree = 45;
        console.log("to latitude");
        console.log(this.metersToLatitude(meters));
        console.log("to longitude");
        console.log(this.metersToLongitude(meters, latlng.lat));

        data.push({ latitude: latlng.lat + this.metersToLatitude(meters), longitude: latlng.lng });
        data.push({ latitude: latlng.lat, longitude: latlng.lng + this.metersToLongitude(meters, latlng.lat) });
        data.push({ latitude: latlng.lat - this.metersToLatitude(meters), longitude: latlng.lng });
        data.push({ latitude: latlng.lat, longitude: latlng.lng - this.metersToLongitude(meters, latlng.lat) });

        //data.push({ latitude: latlng.lat + (this.metersToLatitude(meters) * Math.cos(0)), longitude: latlng.lng + (this.metersToLongitude(meters, latlng.lat) * Math.sin(0)) });
        //data.push({ latitude: latlng.lat + (this.metersToLatitude(meters) * Math.cos(45)), longitude: latlng.lng + (this.metersToLongitude(meters, latlng.lat) * Math.sin(45)) });
        //data.push({ latitude: latlng.lat + (this.metersToLatitude(meters) * Math.cos(90)), longitude: latlng.lng + (this.metersToLongitude(meters, latlng.lat) * Math.sin(90)) });

        //for (var i = 0; i < 8; i++) {
        //    data.push({latitude: this.metersToLatitude(meters) * Math.cos(degree * i), longitude: this.metersToLongitude(meters, latlng.lat) * Math.sin(degree * i)});
        //}
        console.log("data");
        console.log(data);
        return data;
    },

    // --------------------------
    // CONVERSIONS
    // --------------------------

    // Convert meters to miles
    metersToMiles : function (meters) {
        return meters * 0.00062137;
    },

    milesToMeters : function (miles) {
        return miles / 0.00062137;
    },

    metersToLatitude : function (meters) {
        return (meters / 6378000) * (180 / Math.PI);
    },

    metersToLongitude : function (meters, latitude) {
        return (meters / 6378000) * (180 / Math.PI) / Math.cos(latitude * Math.PI / 180);
    }
};
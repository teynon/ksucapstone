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

        data.push({ latitude: latlng.lat + this.metersToLatitude(meters), longitude: latlng.lng });
        data.push({ latitude: latlng.lat + (this.metersToLatitude(meters) * (Math.sqrt(3) / 2)), longitude: latlng.lng + (this.metersToLongitude(meters, latlng.lat) * (1 / 2)) });
        data.push({ latitude: latlng.lat + (this.metersToLatitude(meters) * (Math.sqrt(2) / 2)), longitude: latlng.lng + (this.metersToLongitude(meters, latlng.lat) * (Math.sqrt(2) / 2)) });
        data.push({ latitude: latlng.lat + (this.metersToLatitude(meters) * (1 / 2)), longitude: latlng.lng + (this.metersToLongitude(meters, latlng.lat) * (Math.sqrt(3) / 2)) });

        data.push({ latitude: latlng.lat, longitude: latlng.lng + this.metersToLongitude(meters, latlng.lat) });
        data.push({ latitude: latlng.lat - (this.metersToLatitude(meters) * (1 / 2)), longitude: latlng.lng + (this.metersToLongitude(meters, latlng.lat) * (Math.sqrt(3) / 2)) });
        data.push({ latitude: latlng.lat - (this.metersToLatitude(meters) * (Math.sqrt(2) / 2)), longitude: latlng.lng + (this.metersToLongitude(meters, latlng.lat) * (Math.sqrt(2) / 2)) });
        data.push({ latitude: latlng.lat - (this.metersToLatitude(meters) * (Math.sqrt(3) / 2)), longitude: latlng.lng + (this.metersToLongitude(meters, latlng.lat) * (1 / 2)) });

        data.push({ latitude: latlng.lat - this.metersToLatitude(meters), longitude: latlng.lng });
        data.push({ latitude: latlng.lat - (this.metersToLatitude(meters) * (Math.sqrt(3) / 2)), longitude: latlng.lng - (this.metersToLongitude(meters, latlng.lat) * (1 / 2)) });
        data.push({ latitude: latlng.lat - (this.metersToLatitude(meters) * (Math.sqrt(2) / 2)), longitude: latlng.lng - (this.metersToLongitude(meters, latlng.lat) * (Math.sqrt(2) / 2)) });
        data.push({ latitude: latlng.lat - (this.metersToLatitude(meters) * (1 / 2)), longitude: latlng.lng - (this.metersToLongitude(meters, latlng.lat) * (Math.sqrt(3) / 2)) });

        data.push({ latitude: latlng.lat, longitude: latlng.lng - this.metersToLongitude(meters, latlng.lat) });
        data.push({ latitude: latlng.lat + (this.metersToLatitude(meters) * (1 / 2)), longitude: latlng.lng - (this.metersToLongitude(meters, latlng.lat) * (Math.sqrt(3) / 2)) });
        data.push({ latitude: latlng.lat + (this.metersToLatitude(meters) * (Math.sqrt(2) / 2)), longitude: latlng.lng - (this.metersToLongitude(meters, latlng.lat) * (Math.sqrt(2) / 2)) });
        data.push({ latitude: latlng.lat + (this.metersToLatitude(meters) * (Math.sqrt(3) / 2)), longitude: latlng.lng - (this.metersToLongitude(meters, latlng.lat) * (1 / 2)) });

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
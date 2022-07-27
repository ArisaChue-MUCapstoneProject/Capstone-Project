const toRadians = (num) => {
    return (num * Math.PI) / 180
}

const earthRadius = 6371

export const getDistance = (lat1, long1, lat2, long2) => {
    lat1 = toRadians(lat1)
    long1 = toRadians(long1)
    lat2 = toRadians(lat2)
    long2 = toRadians(long2)

    // haversine formula
    let dlat = lat2 - lat1
    let dlong = long2 - long1

    let a = Math.pow(Math.sin(dlat / 2), 2)
                 + Math.cos(lat1) * Math.cos(lat2)
                 * Math.pow(Math.sin(dlong / 2), 2)
               
    let c = 2 * Math.asin(Math.sqrt(a))
    return earthRadius * c
}

export const kmToMiles = (dis) => {
    return Number(dis / 1.609).toFixed(2)
}
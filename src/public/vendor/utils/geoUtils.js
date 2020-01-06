function degTorad(n){return n*(Math.PI/180)}
/* eslint-disable no-unused-vars */
function getDistanceFromLatLonInKm(a,t,n,r){var h=degTorad(n-a),s=degTorad(r-t),M=Math.sin(h/2)*Math.sin(h/2)+Math.cos(degTorad(a))*Math.cos(degTorad(n))*Math.sin(s/2)*Math.sin(s/2);return 6371*(2*Math.atan2(Math.sqrt(M),Math.sqrt(1-M)))}
/* eslint-enable */
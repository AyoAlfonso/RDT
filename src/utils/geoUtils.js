
module.exports = {
    generateRandomPoint(t,a){var n=t._lng,o=t._lat,r=a/111300,e=Math.random(),h=Math.random(),M=r*Math.sqrt(e),d=2*Math.PI*h,i=M*Math.cos(d);return{lat:M*Math.sin(d)+o,lng:i/Math.cos(o)+n,updatedAt:(new Date).toISOString().split("T")}}
}
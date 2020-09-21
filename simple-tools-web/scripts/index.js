/**
 * index.js
 * - All our useful JS goes here, awesome!
 */

$(document).ready(function(){
  console.log("JavaScript is amazing!");


//On clicking extract IP button  
$('#ext-ip-btn').on('click', function(event) {
 // $('#result').remove();
 var rawtext = $('#raw-text').val();
 var ipsParsed = extractIP(rawtext);
 $('#result-text').val(ipsParsed.pubIPs.toString()+'\n'+ipsParsed.pvtIPs.toString());
});

//on clicking copytext button
$('#copytoclip').on('click',copyTextFunc);
$('#copytoclip').on('mouseout',outFunc);

//On clicking Show IP details button
$('#show-det-btn').on('click', function(event){
  //try --- reload textarea element so that it do not bug out when text area is clicked
  $('#result-text').html('');//can be used to clear div of all its elements
  $('#result-text').append('IP---Country---ISP');
  console.log("show details button clicked")
  var rawtext = $('#raw-text').val();
  var ipsParsed = extractIP(rawtext);
  var parsedArr = fetchDetailsIpvoid('8.8.8.8',callback);
  console.log("show details ended");
  
});

//methord to extract ip and seperate private and public ranges
function extractIP(rawtext){
  var patt = /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/g;
  var patt2 = /(^127\.)|(^10\.\S*)|(^172\.1[6-9]\.)|(^172\.2[0-9]\.)|(^172\.3[0-1]\.)|(^192\.168\.)/;
  var ips = rawtext.match(patt);
  var uniqueIps = [];
  var pvtIPs = [];
  var pubIPs = [];
  $.each(ips, function(i, el){
      if($.inArray(el, uniqueIps) === -1){
        uniqueIps.push(el);
        if(el.match(patt2) != null) 
          pvtIPs.push(el);
        else
          pubIPs.push(el);
      }
  });
  return {uniqueIps, pvtIPs, pubIPs};//return all three as an object
  //$('#result-text').val(pvtIPs.toString()+'\n'+pubIPs.toString());
}
//---------for copying to clipboard feature
function copyTextFunc() {
  var copyText = $("#result-text");
  copyText.select();
  document.execCommand("copy");

  var tooltip = $("#myTooltip");
  tooltip.html("Copied: " + copyText.val());
}
//to reset hover value on mouse out
function outFunc() {
  var tooltip = $("#myTooltip");
  tooltip.html("Copy to clipboard");
}
//----------end of copy to clipboard functions

//for fetching/parsing page from ipVoid
function fetchDetailsIpvoid(ipStr,callback){
  console.log('inside fetch')
  var parsedArr = [];
  //post request
  console.log("sending post request to ipvoid")
  $.post('https://www.ipvoid.com/ip-blacklist-check/',   // url
       { 'ip': ipStr }, // data to be submit
       function(data, status, jqXHR) {// success callback

        //iterating over each row and column
        $(data).find('table').eq(0).find('tr').each(function(){
          var rowdata = []
          $(this).find('td').each(function(){
              //do your stuff, you can use $(this) to get current cell
              rowdata.push($(this).text());
              //console.log($(this).text());
              //console.log('each tis type:'+typeof $(this).text());
          });
          parsedArr.push(rowdata);
      });
      console.log("calling back display")
      callback(parsedArr);
        }); 
      
        //return parsedArr;
        return parsedArr;
}

function callback(parsedArr){
  console.log('sample: 21'+parsedArr[2][1]);
  $('#result-text').append(parsedArr.toString());

  //   Array(0) --------parsed Array return format
// 0: (2) ["Analysis Date", "2020-09-18 04:32:10"]
// 1: (2) ["Elapsed Time", "3 seconds"]
// 2: (2) ["Blacklist Status", "POSSIBLY SAFE 0/115"]
// 3: (2) ["IP Address", "8.8.8.8 Find Sites | IP Whois"]
// 4: (2) ["Reverse DNS", "dns.google"]
// 5: (2) ["ASN", "AS15169"]
// 6: (2) ["ASN Owner", "GOOGLE"]
// 7: (2) ["ISP", "Google"]
// 8: (2) ["Continent", "North America"]
// 9: (2) ["Country Code", " (US) United States"]
// 10: (2) ["Latitude / Longitude", "37.751 / -97.822 Google Map"]
// 11: (2) ["City", "Unknown"]
// 12: (2) ["Region", "Unknown "]
  // $('#result-text').val(formatres);
  //$('#result-text').val(parsedArr[2,1]);
}
//test code
  //using xmlhttprequest-failed
//   console.log('just out')
//   var req = new XMLHttpRequest();
//   req.open('GET', 'sample.html', true);
//   req.send(null);
//   if(req.status == 200){
//   console.log('status 200 is true')
//   $("outtext").innerHTML = req.responseText;
// }
  // //get request
  // $.get('sample.html',  // url
  //     function (data, textStatus, jqXHR) {  // success callback
  //         $("outtext").innerHTML = data;
  //         //alert('status: ' + textStatus + ', data:' + data);
  //         var link = $(data).find("p > a").text();
  //         console.log(link);
  //   });
  //post request
  // $.post('https://www.ipvoid.com/ip-blacklist-check/',   // url
  //      { 'ip': '8.8.4.4' }, // data to be submit
  //      function(data, status, jqXHR) {// success callback
  //               $("outtext").innerHTML = data;
  //       })
});//document.ready end--

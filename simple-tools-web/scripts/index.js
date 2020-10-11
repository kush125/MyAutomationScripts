$(document).ready(function(){
  console.log("Running...");


//clicking extract IP button  
$('#ext-ip-btn').on('click', function(event) {
 // $('#result').remove();
 var rawtext = $('#raw-text').val();
 var ipsParsed = extractIP(rawtext);
 $('#result-text').val(ipsParsed.pubIPs.toString().replace(/,/g,'\n')+'\n\n'+ipsParsed.pvtIPs.toString().replace(/,/g,'\n'));
});

//clicking copytext button
$('#copytoclip').on('click',copyTextFunc);
$('#copytoclip').on('mouseout',outFunc);

//clicking Show IP details button
$('#show-det-btn').on('click', function(event){
  console.log("show details button clicked");
  //try --- reload textarea element so that it do not bug out when text area is clicked
  $('#result-text').html('');//can be used to clear div of all its elements
  $('#result-text').append('IP---Country---ISP\n');
  
  var rawtext = $('#raw-text').val();
  var ipsParsed = extractIP(rawtext);

  $.each(ipsParsed.pubIPs, function(i,el){
    console.log("checking: "+el);
    fetchDetailsIpvoid(el,displayFunc,0);
  });
  //var parsedArr = fetchDetailsIpvoid('8.8.8.8',callback);
  console.log("show details ended");
  
});

//clicking check reputation button
$('#check-rep-btn').on('click', function(event){
  console.log("check reputation clicked");
  $('#result-text-cont').html('');
  var rawtext = $('#raw-text').val();
  var ipsParsed = extractIP(rawtext);

  $.each(ipsParsed.pubIPs, function(i,el){
    console.log("checking: "+el);
    fetchDetailsIpvoid(el,displayFunc,1);
    fetchDetailsAbuseIP(el,displayFunc);
    fetchDetailsVirusTotal(el,displayFunc);
  });
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
function fetchDetailsIpvoid(ipStr,displayFunc,optn){
  
  var parsedArr = [];
  //post request
  console.log("sending post request to ipvoid with "+ipStr);
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
      //dividing display methord with the type of button clicked
      if(optn == 0){
        displayFunc({
          type : 'ipvoid_details',
          datarr : parsedArr
        });

      }else if(optn==1){
        var value = parsedArr[2][1].match(/\d*\/\d*/)[0].split('/')[0];
        var total = parsedArr[2][1].match(/\d*\/\d*/)[0].split('/')[1];
        displayFunc({
          intel : 'IPvoid',
          type : 'meter',
          value : value,
          total : total
        });
      }
      //ipVoidParse(parsedArr,displayFunc);
        }); 
      
        //return parsedArr;
        //return parsedArr;
}
//obsolete
// function ipVoidParse(parsedArr, displayFunc){
//   //$('#result-text').append(extractIP(parsedArr[3][1]).uniqueIps[0]+'---'+parsedArr[9][1].match(/\w{3,}.*/)+'---'+parsedArr[7][1]+'\n');
//   var value = parsedArr[2][1].match(/\d*\/\d*/)[0].split('/')[0];
//   var total = parsedArr[2][1].match(/\d*\/\d*/)[0].split('/')[1];
//   displayFunc({
//     type : 'meter',
//     value : value,
//     total : total
//   });
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
// }

function displayFunc(dispobj){
  switch (dispobj.type) {
    case 'meter':
      $('#result-text-cont').append(
        "<label>"+dispobj.intel+": "+dispobj.value+"/"+dispobj.total+":</label><meter value=\""+dispobj.value+"\" min=\"0\" max=\""+dispobj.total+"\">2 out of 10</meter><br>");

    case 'ipvoid_details':
      $('#result-text').append(extractIP(dispobj.datarr[3][1]).uniqueIps[0]+'---'+dispobj.datarr[9][1].match(/\w{3,}.*/)+'---'+dispobj.datarr[7][1]+'\n');

  }
}
//obsolete
// function displayMeter(value, max, parsedArr){
  
//   $('#result-text-cont').append("<meter value=\""+value+"\" min=\"0\" max=\""+max+"\">2 out of 10</meter><br>");
// }

// function displayDetails(value, total, parsedArr){
//   $('#result-text').append(extractIP(parsedArr[3][1]).uniqueIps[0]+'---'+parsedArr[9][1].match(/\w{3,}.*/)+'---'+parsedArr[7][1]+'\n');
// }

function fetchDetailsVirusTotal(ipStr,displayFunc){
  console.log("inside virustotel");
  var positives;
  var total;
  $.getJSON('https://www.virustotal.com//ui/ip_addresses/'+ipStr,  // url
      function (data, textStatus, jqXHR) {  // success callback
         //parsing extracting totel and positives from json
          $.each(data, function(index, element){
            var final_stats=element.attributes.last_analysis_stats;
            positives=final_stats.malicious+final_stats.suspicious;
            total=final_stats.harmless+final_stats.malicious+final_stats.suspicious+final_stats.timeout+final_stats.undetected;
            displayFunc({
              intel : 'VirusTotal',
              type : 'meter',
              value : positives,
              total : total
            });
          });
    });
}
//not working
function fetchDetailsMXtoolBox(ipStr){
  console.log("inside mxtool");
    //get request---https://mxtoolbox.com/api/v1/Lookup?command=blacklist&argument="+ipStr+"&resultIndex=2&disableRhsbl=false&format=2
  $.get("https://mxtoolbox.com/api/v1/user",  // url
      function (data, textStatus, jqXHR) {  // success callback
        console.log(data);
        $("#outtext").html(data);
        $.get("https://mxtoolbox.com/api/v1/Lookup?command=blacklist&argument=1.1.1.1&resultIndex=1&disableRhsbl=true&format=2",
          function (data1){
            console.log(data1);
          });
          //try to authenticate using api key before requesting OR pass parameters in requests
          //alert('status: ' + textStatus + ', data:' + data);
    });
  }

  function fetchDetailsAbuseIP(ipStr){
    var confidence;
    var reported;
    $.get("https://www.abuseipdb.com/check/"+ipStr,  // url
      function (data, textStatus, jqXHR) {  // success callback
        //$("#outtext").html(data);
        
        if (!(($(data).find('.well > h3').text()).includes('not'))){
          console.log($(data).find('.well > p').eq(0).text());
          reported = $(data).find('.well > p').eq(0).text().match(/\d+/g)[0];
          confidence = $(data).find('.well > p').eq(0).text().match(/\d+/g)[1];
          console.log("confidence="+confidence+" reported="+reported);
          displayFunc({
            intel : 'AbuseIPdb',
            type : 'meter',
            value : confidence,
            total : 100
          });
        }else{
          displayFunc({
            intel : 'AbuseIPdb',
            type : 'meter',
            value : 0,
            total : 100
          });
        }
        
    });
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

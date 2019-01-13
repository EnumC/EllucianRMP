// LIVE

console.log("Successfully loaded RATEMYPROFESSOR extension");
if ( $( ".datadisplaytable" ).length ) {
  var arr = $("td:contains('(P)')");
  $.each( arr, function( index, value ){
    var cell = arr.eq(index);
    var name = extractNameLive(cell.text());
    getLinkLive(index, name);
  });



  // $( document ).ready(function() {
  //   $('.takeAgain')
  //     .on('mouseenter', function(){
  //         var div = $(this);
  //         div.stop(true, true).animate({ 
  //             margin: -10,
  //             width: "+=20",
  //             // height: "+=20",
  //             height: 'show', 
  //             opacity: 'show'
  //         }, 'fast');
          
  //     })
  //     .on('mouseleave', function(){
  //         var div = $(this);
  //         div.stop(true, true).animate({ 
  //             margin: 0,
  //             width: "-=20",
  //             // height: "-=20"
  //             height: 'hide', 
  //             opacity: 'hide'
  //         }, 'fast');
  //         $(this).append("show");
  //     })
  // });




}




function extractNameLive(value) {
  var words = value.split(' ');
  var first = words[0];
  var last = words[3];
  if (words[4] != "(P)") {
    last = words[4];
  }
  if (last == "Staff") {
    return null;
  }
  // console.log(first + "+" + last);
  return first + "+" + last;
}

function getLinkLive(index, value) {
  var object = $("td:contains('(P)')").eq(index);
  if (value != null) {
    var url = 'https://www.ratemyprofessors.com/search.jsp?queryoption=HEADER&queryBy=teacherName&schoolName=De+Anza+College&query=' + value;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send();

    var data = xhr.responseText;
    // console.log("Alternate");

    // console.log("RAW: ");
      // console.log(data);
      var arr = $( data ).find( "li.listing.PROFESSOR" );
      // console.log("Array: ");
      // console.log(arr);
      var link = null;
      if (arr.length > 0) {
        link = "https://www.ratemyprofessors.com" + arr.first().find('a').attr("href");
      }
      if (link != null) {
        object.html('<a title="RateMyProfessors link" target="_blank" href="' + link + '">' + object.text() + '</a>');
        getScoreLive(index, link);
      } else {
        object.html('<div title="Couldn\'t find this professor on RateMyProfessors.">' + object.text() + '</div>');
      }


    // chrome.runtime.sendMessage({
    //   method: 'GET',
    //   action: 'xhttp',
    //   url: url,
    //   data: ''
    // }, function(response) {
    //   var data = $.parseHTML(response);
    //   console.log("RAW: ");
    //   console.log(data);
    //   var arr = $( data ).find( "li.listing.PROFESSOR" );
    //   console.log("Array: ");
    //   console.log(arr);
    //   var link = null;
    //   if (arr.length > 0) {
    //     link = "https://www.ratemyprofessors.com" + arr.first().find('a').attr("href");
    //   }
    //   if (link != null) {
    //     object.html('<a title="RateMyProfessors link" target="_blank" href="' + link + '">' + object.text() + '</a>');
    //     getScoreLive(index, link);
    //   } else {
    //     object.html('<div title="Couldn\'t find this professor on RateMyProfessors.">' + object.text() + '</div>');
    //   }
    // });
  } else {
    object.html('<div title="The instructor for this course has not yet been posted.">' + object.text() + '</div>');
  }
}

function getScoreLive(index, url) {

  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, false);
  xhr.send();

  var data = xhr.responseText;

  var data = $.parseHTML(data);
  var ratingCt = $(data).find('.table-toggle.rating-count.active')[0].innerText.trim();
  // console.log("Rating");
  // console.log(ratingCt);
    var arr = $( data ).find( "div.grade" );
    var object = $("td:contains('(P)')").eq(index);
    // console.log(arr);
    var rating = null;
    if (arr.length > 0) {
      var quality = undefined;
      var qualityContent = undefined;
      arr.each(function(){
        if ($(this).parent()[0].innerText.trim().startsWith("Overall Quality")) {
          rating = parseFloat(arr.first().text());
          var color = getColorForRating(rating);
          quality = object.append('<div class="quality"></div>')
          qualityContent = $(quality).append('<br>Overall Quality:<br><strong>' + rating + '</strong>' + "<br>(" + ratingCt + ")");
          var parent = object.parent();
          object.css('background-color', color);
        }
        else {
          rating = parseFloat($(this).text());
          // console.log($(this).parent());
          console.log("quality:");
          console.log($(object).children('.quality'));
          $(object).children('.quality').append($(this).parent());
        }
      });
      
    }

  // chrome.runtime.sendMessage({
  //   method: 'GET',
  //   action: 'xhttp',
  //   url: url,
  //   data: ''
  // }, function(response) {
  //   var data = $.parseHTML(response);
  //   var arr = $( data ).find( "div.grade" );
  //   var rating = null;
  //   if (arr.length > 0) {
  //     rating = parseFloat(arr.first().text());
  //     var color = getColorForRating(rating);
  //     var object = $("td:contains('(P)')").eq(index);
  //     object.append(' - <strong>' + rating + '</strong>');
  //     var parent = object.parent();
  //     object.css('background-color', color);
  //   }
  // });
}

//var css = chrome.runtime.getURL('ui.css');
//console.log('append ' + css);
//$('link[href="/css/web_defaultmenu.css"]').attr('href',css);

// SCHEDULE

if ( $( ".aspNetHidden" ).length ) {
  var arr = $('td[align="left"]');
  $.each( arr, function( index, value ){
    var cell = arr.eq(index);
    var text = cell.text();
    if (text.match('.*, .') != null) {
      var name = extractNameSchedule(cell.text());
      getLinkSchedule(index, name);
    }
  });
}

function extractNameSchedule(value) {
  return value.split(', ');
}

function getLinkSchedule(index, value) {
  var url = 'https://www.ratemyprofessors.com/search.jsp?queryoption=HEADER&queryBy=teacherName&schoolName=De+Anza+College&query=' + value[0];
  chrome.runtime.sendMessage({
    method: 'GET',
    action: 'xhttp',
    url: url,
    data: ''
  }, function(response) {
    var data = $.parseHTML(response);
    var arr = $( data ).find( "li.listing.PROFESSOR" );
    var link = null;
    $.each( arr, function( index, v ) {
      var entry = arr.eq(index);
      var name = entry.find('.listing-name').find('.main').text();
      var initial = name.split(", ")[1].substring(0, 1);
      var search = value[1].substring(0, 1);
      if (initial == search) {
        link = "https://www.ratemyprofessors.com" + entry.find('a').attr("href");
      }
    });
    var object = $('td[align="left"]').eq(index);
    if (link != null) {
      object.html('<a title="RateMyProfessors link" target="_blank" href="' + link + '">' + object.text() + '</a>');
      getScoreSchedule(index, link);
    } else {
      object.html('<div title="Couldn\'t find this professor on RateMyProfessors">' + object.text() + '</div>');
    }
  });
}

function getScoreSchedule(index, url) {
  chrome.runtime.sendMessage({
    method: 'GET',
    action: 'xhttp',
    url: url,
    data: ''
  }, function(response) {
    var data = $.parseHTML(response);
    var arr = $( data ).find( "div.grade" );
    var rating = null;
    if (arr.length > 0) {
      rating = parseFloat(arr.first().text());
      var color = getColorForRating(rating);
      var object = $('td[align="left"]').eq(index);
      object.append(' - <strong>' + rating + '</strong>');
      var parent = object.parent();
      object.css('background-color', color);
    }
  });
}

// COMMON

function getColorForRating(rating) {
  return (rating >= 3.5 || rating == 0) ? '#2ecc71' : (rating > 2) ? '#f1c40f' : '#e74c3c';
}


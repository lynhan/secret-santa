$(document).ready(function(){
    
$('input').attr('spellcheck', 'false');
$('textarea').attr('spellcheck', 'false');
    

//transition to adding people
$('#right-input').keypress(function(e) {

    var key = (e.keyCode ? e.keyCode : e.which);

    //if pressed enter
    if(key == 13) {

        //move right box more right, hide subtitle
        $('#right-box').css({'marginLeft':'50px', 'height':'400px'});
        $('#subtitle').fadeOut(100);

        //show left pane
        setTimeout(function() {
            $('#people, #addbtn, #sendbtn, #hint').fadeIn(500);
            $('.name:first').focus();
        }, 100);

    }

});


//add people
$('#addbtn').on('click', function() {
    
    $('#people').prepend("<div class = 'person' style = 'display:none;'>" 
                         + "<div class = 'xbox'><span class = 'x'>x</span></div>"
                         + "<input type='text' class='name' style = 'display:none;' placeholder='Name' spellcheck='false'></input>"
                         + "<input type='text' class='email' style = 'display:none;' placeholder='Email' spellcheck='false'></input>"
                         + "</div>");

    //animate effect
    $('.person, .person input').show(150);
    
    //show hint: either need more entries or has blank input
    var people = $('.person input').length/2;
    
    if (people < 3) {
        $('#hint').text('(Three people or more)');
    } else {
        $('#hint').text('(Fill every box)');
    }

    //disable send btn
    $('#sendbtn').prop("disabled", true);
});
 

//delete people
$(document).on('mouseenter', '.xbox', function() {
    $(this).children('.x').show(); //show x on hover

}).on('mouseleave', '.xbox',function () {
    $(this).children('.x').hide();  //hide x

}).on('click', '.xbox',function () {
    $(this).parent('.person').remove();  //remove person on click
    $('#hint').text('(Three people or more)');  //show add prompt if deleted everyone
});

    
//change hint and xbox fill based on inputs after keyup
$(document).on('keyup', '.person input', function() {

    //loop thru people, check name/email input fill
    $(".person").each(function() {

        //if name or email blank
        if ( !$(this).children('.name').val() || !$(this).children('.email').val()) {
            //unfill xbox
            $(this).children('.xbox').css({'background':'white'});
        } else {    //name and email filled. fill xbox
            $(this).children('.xbox').css({'background':'#ffc964', 'border':'3px solid #ffc964'});
        }

    });

    //return set of empty fields
    var empty_fields = $('.person input').filter(function() {
        //check type and value
        //add to set if empty field
        return $.trim(this.value) === "";
    });

    console.log(empty_fields.length);

    var people = $('.person input').length;

    //empty fields
    if (empty_fields.length && people >= 3) {
        $('#hint').text('(Fill every box)');
        $('#sendbtn').prop("disabled", true);

    //3+ filled. remove hint and activate send button
    } else if (!empty_fields.length && people >= 3) {
        $('#hint').text('');
        $('#sendbtn').prop("disabled", false);
    }
});


//finish 
$("#sendbtn").on('click', function() {

    $('#main').hide();
    $('#sent').show();
    var title = $('#right-input').val();

    //put stuff in arrays
    var names = $.map($(".name"), function(item) {
        return item.value;
    });
    var emails =  $.map($(".email"), function(item) {
        return item.value;
    });

    var stuffing = {};  //carry name and email in js object
    for(var i = 0; i < names.length; i++) {
        stuffing[names[i]] = emails[i];
    }

    stuffing = JSON.stringify(stuffing);  //stringify for sendoff

    $.ajax({
        type: "POST",
        url: "/",
        data: 'title=' + title + '&stuffing=' + stuffing,
        success: function(mylist) {
            console.log("success");
        }
    });

    //show moreswapbtn
    $('#moreswapbtn').show();

});

        
//return to start
$('#moreswapbtn').on('click', function() {

    //remove all inputs but first
    $('.person').not(':first').remove();

    //clear input
    $('.name, .email, #right-input').val('');

    //unfill xbox
    $('.xbox').css({'background':'white'});

    //reset right box
    $('#right-box').css({'marginLeft':'0px', 'height':'170px'});
    $('#sendbtn').prop("disabled", true);

    //hide left pane
    $('#people, #addbtn, #sendbtn, #hint').hide();

    //show start page, hide sent message
    $('#subtitle, #main').show();
    $('button, #sent').hide();
    $('#right-input').focus();
    
});
   

});

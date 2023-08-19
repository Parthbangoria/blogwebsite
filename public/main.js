// Filter js
//jshint esversion:6

$(document).ready(function(){
    $(".filter-item").click(function(){
        const value = $(this).attr("data-filter");
       
        if(value=="all"){
            $(".post-box").show("1000");
        }
        else{
        $(".post-box")
            .not("."+ value)
            .hide("1000");
        $(".post-box")
           .filter("."+ value)
           .show("1000");
        }
        });
    $(".filter-item").click(function(){
        $(this).addClass("active-filter").siblings().removeClass("active-filter");

    });

    });

// header background change on scoll     

let header = document.querySelector("header");
 
 window.addEventListener("scroll",() =>{
    header.classList.toggle("shadow", window.scrollY > 0);
 });




//  login page    

$(document).ready(function(){
    $('.login-info-box').fadeOut();
    $('.login-show').addClass('show-log-panel');
});


$('.login-reg-panel input[type="radio"]').on('change', function() {
    if($('#log-login-show').is(':checked')) {
        $('.register-info-box').fadeOut(); 
        $('.login-info-box').fadeIn();
        
        $('.white-panel').addClass('right-log');
        $('.register-show').addClass('show-log-panel');
        $('.login-show').removeClass('show-log-panel');
        
    }
    else if($('#log-reg-show').is(':checked')) {
        $('.register-info-box').fadeIn();
        $('.login-info-box').fadeOut();
        
        $('.white-panel').removeClass('right-log');
        
        $('.login-show').addClass('show-log-panel');
        $('.register-show').removeClass('show-log-panel');
    }
});
  

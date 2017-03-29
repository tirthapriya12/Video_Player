

//object and variable declarations
var currentPageObject = {
    currentpage: 0
};

var jsonData;
var video = document.getElementById('firstVideo');
var btnplay = document.getElementById('play');
var btn_rewind = document.getElementById('rewind');
var vidcurrentTime = document.getElementById('vidstart-time');
var vidduration = document.getElementById('vidend-time');
var buttonbar = document.getElementById('buttonbar');
var preloader = document.getElementById('preloader');
var volume = document.getElementById('volume');
var volumectrl = document.getElementById('volume-controller');
var Fullscreen_btn = document.getElementById('fullscreen');
var playduration = document.getElementById('playduration');
var vidcontainer = document.getElementsByClassName('video-container');
var btn_img = document.querySelector('#play img');
var prev_btn = document.getElementById('prev_btn');
var next_btn = document.getElementById('next_btn');
var mute_toggle = document.getElementById('mute-toggle');
var play_bubble = document.getElementById('play_pause');
var preloader = document.getElementById('preloader');
var progressBar = document.getElementById('playduration');
var video_desc = document.getElementById('video-desc');
var isFullScreen = false;
var jsonlength;
//attaching event listeners
window.addEventListener('load', firstVideoLoad);
video.addEventListener("contextmenu", disablecontrols, false);





video.addEventListener('timeupdate', updateProgressBar, false);
volumectrl.addEventListener('change', togglevolume);
btnplay.addEventListener('click', vidPausePlay);
playduration.addEventListener('change', jumpto);
//btn_rewind.addEventListener('click',rewind);
mute_toggle.addEventListener('click', toggleMute);
prev_btn.addEventListener('click', backToPreviousVideo);
next_btn.addEventListener('click', loadNextVideo);
video.addEventListener('mouseenter', bringplayBubble, false);
video.addEventListener('mouseleave', vanishplayBubble, false);
play_bubble.addEventListener('mouseenter', bringplayBubble, false);
play_bubble.addEventListener('click', respondClickOnBubble);
Fullscreen_btn.addEventListener('click', toggleFullScreen);
video.addEventListener('canplay', vanishLoader, false);
video.addEventListener('waiting', bringLoader);
 video.addEventListener('load',vanishLoader);//for mobile
video.addEventListener('loadstart', bringLoader);
video.addEventListener('loadedmetadata',vanishLoader);
video.addEventListener('loadeddata', function () {
    updateProgressBar();
    btn_img.src = 'png/001-play.png';
    btnplay.title = 'play';
    vanishLoader();
}, false);




//detect mobile device part
var isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }

};

var mobtap=0;
//detect if iOS device
(function(){
   var volume_controller=document.getElementsByClassName('volume-controller'); 
if (isMobile.iOS()) {
    
    //mute_toggle.style.display = 'none';
    volumectrl.style.display = 'none';
    volume.style.display = 'none';
    volume_controller[0].style.left='80%';
    
   // canplayEvent = new Event('canplay');
    //video.dispatchEvent(canplayEvent);
    if(window.innerWidth==768)
        {
            volume_controller[0].style.top='-47%';
            volume_controller[0].style.width='20%';
            volume_controller[0].style.left='80%';
        }


}

if(isMobile.any())
{
      //btnplay.dispatchEvent(new Event('click'));
        video.addEventListener('load',vanishLoader);
        
        if(window.innerWidth==768)
        {
            volume_controller[0].style.top='-49%';
            volume_controller[0].style.width='20%';
            volume_controller[0].style.left='80%';
        }
        
}

})();


function handleorientation(event)
{
        var volume_controller=document.getElementsByClassName('volume-controller');
    //alert('change');
    if(window.innerWidth==768 && event.orientation=='portrait')
        {
            volume_controller[0].style.top='-49%';
            volume_controller[0].style.width='20%';
            volume_controller[0].style.left='80%';
        }


}


//First video loading
function firstVideoLoad() {

    var pageload;

    if (window.XMLHttpRequest) {
        pageload = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        pageload = new ActiveXObject("Microsoft.XMLHTTP");
    }
    pageload.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            jsonData = JSON.parse(this.responseText);

            video.src = jsonData[0].src;
            video.poster=jsonData[0].poster;
            video_desc.innerHTML = jsonData[0].desc;
            jsonlength = jsonData.length;
            video.load();
            if (currentPageObject.currentpage === 0) {
                prev_btn.disabled = true;
                prev_btn.classList.add('button-disable');
            }



        }
    };
    pageload.open("GET", "video.json", true);
    pageload.send();
}

function vanishLoader() //displays controls when image is loaded
{


    console.log('Buffering stopped');
    //buttonbar.style.opacity='1';
    preloader.style.display = 'none';



}


function bringLoader() {

    console.log('buffering');
    preloader.style.display = 'block';
}






//toggles pause or play on clicking the video
function vidPausePlay() {

    if (video.paused) {
        video.play();
        btn_img.src = 'png/012-pause.png';
        btnplay.title = 'pause';
    }

    else {
        btnplay.title = 'play';
        video.pause();
        btn_img.src = 'png/001-play.png';
    }
}


function rewind() // reloads the video
{

    video.currentTime = 0;

}

$('input[type=range]').on('change',function()
{
     
    var value=(this.value/this.max);
     this.style.backgroundImage= '-webkit-gradient(linear, left top, right top, '
                + 'color-stop(' +value + ', rgba(206, 25, 25, 0.71)), '
                + 'color-stop(' + value + ', #C5C5C5)'
                + ')';

});

function updateProgressBar() {
    var min = 0, sec = 0;

    // var changevent=new Event('change');
    // playduration.dispatchEvent(changevent);

    var percentage = Math.floor((100 / video.duration) * video.currentTime);
    var value=(playduration.value/playduration.max);
    playduration.value = percentage;


    //progre




    min = Math.floor(video.duration / 60);
    sec = Math.floor(video.duration % 60);

    if (!isNaN(video.duration)) {    //update duration and current time
        if (sec < 10) {
            vidduration.innerHTML = min + ':0' + sec;
        }
        else {
            vidduration.innerHTML = min + ':' + sec;
        }
        min = Math.floor(video.currentTime / 60);
        sec = Math.floor(video.currentTime % 60);
        if (sec < 10) {
            vidcurrentTime.innerHTML = min + ':0' + sec;
        }
        else {
            vidcurrentTime.innerHTML = min + ':' + sec;
        }

        /*progress calc color fill*/ 
        //debugger;
       playduration.style.backgroundImage= '-webkit-gradient(linear, left top, right top, '
                + 'color-stop(' +value + ', rgba(206, 25, 25, 0.71)), '
                + 'color-stop(' + value + ', #C5C5C5)'
                + ')';


    }
    else {

        playduration.value = 0;
        vidcurrentTime.innerHTML = '0:00';
        vidduration.innerHTML = '0:00';
    }

}


function respondClickOnBubble() {
    if (btnplay.title === 'play') {
        btnplay.title = 'pause';
        video.play();
        play_bubble.src = 'png/012-pause.png';
        btn_img.src = 'png/012-pause.png';
    }
    else {

        btnplay.title = 'play';
        play_bubble.src = 'png/001-play.png';
        btn_img.src = 'png/001-play.png';
        video.pause();
    }
}


function bringplayBubble() {


    play_bubble.style.visibility = 'visible';
    play_bubble.style.transform = 'scale(1.3)';
    if (video.paused) {
        play_bubble.src = 'png/001-play.png';

    }
    else {

        play_bubble.src = 'png/012-pause.png';

    }
}

function vanishplayBubble() {

    play_bubble.style.transform = 'scale(0.2)';
    play_bubble.style.visibility = 'hidden';

}



function jumpto() //jumps to a time user clicked
{

    if (playduration.value < Math.floor((100 / video.duration) * video.currentTime)) {
    video.currentTime = (playduration.value * video.duration) / 100;
    }

}



function disablecontrols(event) //disable right click on video
{
    event.preventDefault();

}







function skip(val) {

    video.currentTime = video.currentTime + val;


}

function togglevolume() {

    video.volume = volumectrl.value / 100;
    volume.innerHTML = volumectrl.value;
}

function toggleMute() {
    var mute_button = document.querySelector('#mute-toggle img');
    
    if (video.muted = !video.muted) {
        mute_button.src = 'png/003-volume.png';
        
        volumectrl.disabled=true;
        volumectrl.style.opacity='0.3';

    }
    else {
        mute_button.src = 'png/003-megaphone.png';
        volumectrl.disabled=false;
        volumectrl.style.opacity='1';
    }


}






//JSON DATA FETCHING FOR NEXT VIDEO

function loadNextVideo() {

    currentPageObject.currentpage += 1;
    if (currentPageObject.currentpage >= jsonlength - 1) {
        // currentPageObject.currentpage = jsonlength - 1;
        document.getElementById("next_btn").disabled = true;
        next_btn.classList.add('button-disable');
        
    }
    if (currentPageObject.currentpage > 0) {
        document.getElementById("prev_btn").disabled = false;
        prev_btn.classList.remove('button-disable');
    }
    console.log(currentPageObject.currentpage);
    video.src = jsonData[currentPageObject.currentpage].src;
    video_desc.innerHTML = jsonData[currentPageObject.currentpage].desc;
    video.poster=jsonData[currentPageObject.currentpage].poster


    //bringLoader();
    video.load();
    updateProgressBar();


}






//JSON DATA FETCHING FOR PREVIOUS VIDEO

function backToPreviousVideo() {


    currentPageObject.currentpage -= 1

    if (currentPageObject.currentpage < jsonlength) {
        document.getElementById("next_btn").disabled = false;
        next_btn.classList.remove('button-disable');
    }


    if (currentPageObject.currentpage <= 0) {
        document.getElementById("prev_btn").disabled = true;
        prev_btn.classList.add('button-disable');
    }


    if (currentPageObject.currentpage < 0) {
        currentPageObject.currentpage = 0;

    }

    video.src = jsonData[currentPageObject.currentpage].src;
    video_desc.innerHTML = jsonData[currentPageObject.currentpage].desc;
    video.poster=jsonData[currentPageObject.currentpage].poster;
    //bringLoader();
    // document.getElementsByClassName("video-container>video").src = newPath[clicks-1].src;
    // document.querySelectorAll('.video-container>video').src = newPath[clicks-1].src;
    video.load();
    updateProgressBar();


}



//fullscreen mode
function toggleFullScreen() {

    
    var volume_controller=document.getElementsByClassName('volume-controller');

     console.log(isFullScreen);
        buttonbar.classList.add('fullscreenControl');
    if (!isFullScreen) {

        
        if(video.webkitRequestFullScreen)
       { 
        video.webkitRequestFullScreen();
                if(!isMobile.Android()) /*if chrome default browser */
                { 
                        volume_controller[0].style.top='-47%';
                        volumectrl.style.top='-44%';
                    isFullScreen = true;
                    }
       }
       else if(video.mozRequestFullScreen)
       {
        video.mozRequestFullScreen();
        isFullScreen=true;
         volume_controller[0].style.top='-47%';
                        volumectrl.style.top='-44%';
       }
       else if(video.webkitSupportsFullscreen)
       {
          video.webkitEnterFullscreen();
          isFullScreen=true; 
       }
       else if (video.msRequestFullscreen) {
             video.msRequestFullscreen();
             
       }

      

     }
    else{
          isFullScreen=false;  
          volume_controller[0].style.top='-88%';
            volumectrl.style.top='-88%';
         document.webkitCancelFullScreen();
        document.mozCancelFullScreen();

    }

   if (document.mozFullScreen && document.webkitFullScreen)
    {
            //alert('fired');
        volume_controller[0].style.top='-88%';
            volumectrl.style.top='-88%';
    }
   

}

//POSTER FETCHING FROM JSON 
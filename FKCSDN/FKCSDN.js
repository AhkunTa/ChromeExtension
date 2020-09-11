// ==UserScript==
// @name         FKCSDN
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  try to take over the world!
// @author       Bryce
// @include      *://www.baidu.com/*
// @include      *://www.dogedoge.com/*
// @include      *://www.so.com/*
// @include      *://www.sogou.com/*
// @include      *://www.google.com/*
// @include      *://www.duckduckgo.com/*
// @include      *.bing.com/*

// @grant        none
// ==/UserScript==


(function() {
    'use strict';
    var move = false
    var insertHtml = `
     <div style="" class="fixed-btn">
        <div class="fk-box">
            <div class="fk-csdn">FK CSDN</div>
            <label class="fk-item">
                <input type="checkbox" name="fk-csdn" checked="true">
                <div class="slider round"></div>
            </label>
        </div>
    </div>`

    var insertStyle = `.fixed-btn {
       -webkit-user-select: none;
        position: fixed;
        top: 50px;
        right: 50px;
        border-radius: 50px;
        width: 100px;
        height: 100px;
        background-color: #f2f8ff;
        z-index: 10000;
    }

    .btn {
        /*background: #237bff;*/
        position: absolute;
        background-color: #237bff;
        border-radius: 20px;
        border: none;
    }

    .slider.round {
        border-radius: 34px;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        width: 40px;
        height: 20px;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        -webkit-transition: .4s;
        transition: .4s;
    }

    .slider.round:before {
        border-radius: 50%;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 16px;
        width: 16px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
    }

    .fk-item input {
        display: none;
    }

    .fk-item {
        position: absolute;
        right: 0;
        top: 10px;
        display: inline-block;
        vertical-align: middle;
        width: 40px;
        height: 20px;
        top: 6px;
    }

    input:checked+.slider {
        background-color: #2196F3;
    }

    input:checked+.slider:before {
        -webkit-transform: translateX(20px);
        -ms-transform: translateX(20px);
        transform: translateX(20px);
    }

    .fk-csdn {
        color: #000;
        font-weight: bold;
        font-size: 12px;
        vertical-align: middle;
    }

    .fk-box {
        position: relative;
        height: 30px;
        line-height: 30px;
    }

    .fk-box:first-child {
        margin-top: 20px;
    }`

     var styleDom = document.createElement('style');
     styleDom.type='text/css';
     if (styleDom.styleSheet) {
         styleDom.styleSheet.cssText = insertStyle;
     } else {
         styleDom.innerHTML = insertStyle;
     }
    document.querySelector('head').appendChild(styleDom);
    document.querySelector('body').insertAdjacentHTML('beforeEnd', insertHtml);

    var searchEngineCode = '00';
    var fixedBtn = document.querySelector('.fixed-btn');
    var inputBox = document.querySelector('input[type=checkbox]');
    var searchBtn = document;
    var searchInput = document;

    // 1 google 2 duck 3 baidu 4 sogo 5 360 6 doge 7 bing
    switch(window.location.host) {
        case 'www.google.com':
            searchEngineCode = '01';
            searchBtn = document.querySelector('.Tg7LZd');
            searchInput = document.querySelector('.gLFyf');
            break;
        case 'duckduckgo.com':
            searchEngineCode = '02';
            searchBtn = document.querySelector('#search_button');
            searchInput = document.querySelector('#search_form_input');
            break;
        case 'www.baidu.com':
            searchEngineCode = '03';
            searchBtn = document.querySelector('#su');
            searchInput = document.querySelector('#kw');
            break;
        case 'www.sogou.com':
            searchEngineCode = '04';
            searchBtn = document.querySelector('#searchBtn');
            searchInput = document.querySelector('#upquery');
            break;
        case 'www.so.com':
            searchEngineCode = '05';
            searchBtn = document.querySelector('#su');
            searchInput = document.querySelector('#keyword');
            break;
        case 'www.dogedoge.com':
            searchEngineCode = '06';
            searchBtn = document.querySelector('#search_button');
            searchInput = document.querySelector('#search_form_input');
            break;
        case 'cn.bing.com':
            searchEngineCode = '07';
            searchBtn = document.querySelector('#search_button');
            searchInput = document.querySelector('#search_form_input');            
            break;    
        case 'www.bing.com':
            searchEngineCode = '07';
            searchBtn = document.querySelector('#su');
            searchInput = document.querySelector('#keyword');          
            break;            
        default:
           searchEngineCode = '00';
           console.log('不支持此搜索引擎')
           break;         
    }
    var isChecked = window.localStorage.getItem('FKCSDNCheck')  == 'false' ? false : true; 
    inputBox.checked = isChecked;


    var mouseDownClientX,mouseDownClientY,mouseDownOffsetLeft,mouseDownOffsetRight
    fixedBtn.addEventListener("mousedown", function(e) {
        move = true;
        mouseDownClientX = e.clientX;
        mouseDownClientY = e.clientY;
        mouseDownOffsetLeft = fixedBtn.offsetLeft;
        mouseDownOffsetRight = fixedBtn.offsetTop;
    });
    document.addEventListener("mousemove", function(e) {
        if (move == false) {
            return;
        }
        var x = e.clientX;
        var y = e.clientY;
        fixedBtn.style.left = x - (mouseDownClientX - mouseDownOffsetLeft) + "px";
        fixedBtn.style.top = y -(mouseDownClientY - mouseDownOffsetRight) + "px";
    });

    fixedBtn.addEventListener("mouseup", function(e) {
        move = false;
    });
    inputBox.addEventListener('change', function() {
        var name = this.getAttribute('name');
        var value = this.getAttribute('checked');
        var ele = this;
        switch (name) {
            case 'fk-csdn':
                FKCSDN(name, value, ele);
                break
            case '':
                break;
            default:
                break;
        }
    })
    searchBtn.addEventListener('click', function(e) {
        if(searchEngineCode == '00') return;
        var searchText = searchInput.value;
        var searchArr = searchText.split(' ');
        var hasValue = false;
        for (var key in searchArr) {
            if (searchArr[key] == '-site:csdn.net') {
                hasValue = true;
            }
        }
        if (!hasValue && isChecked) {
            searchInput.value = searchText + ' -site:csdn.net';
        }
    })
    function FKCSDN(name, value, ele) {
       if(searchEngineCode == '00') return;
       isChecked = ele.checked == true ;
       window.localStorage.setItem('FKCSDNCheck',isChecked)
       if(!isChecked){
           var searchText = searchInput.value;
           var searchArr = searchText.split(' ');
           var newArr = [];
           if(searchArr.includes('-site:csdn.net')){
               searchArr.forEach((value,index)=> {
                   if(value !=='-site:csdn.net'){
                       newArr.push(value);
                   }
               })
               searchInput.value = newArr.join(' ');
           }
       }
       searchBtn.click();
    }

})();
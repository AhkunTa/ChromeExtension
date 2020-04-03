// ==UserScript==
// @name         FKCSDN
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       Bryce
// @include      *://www.baidu.com/*
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
    document.querySelector('#wrapper').appendChild(styleDom);
    document.querySelector('#head').insertAdjacentHTML('beforeEnd', insertHtml);

    var fixedBtn = document.querySelector('.fixed-btn');
    var inputBox = document.querySelector('input[type=checkbox]');
    var searchBtn = document.querySelector('#su');
    var isChecked = true;
    fixedBtn.addEventListener("mousedown", function(e) {
        move = true;
    });
    fixedBtn.addEventListener("mousemove", function(e) {
        var x = e.clientX;
        var y = e.clientY;
        if (move) {
            fixedBtn.style.left = x - fixedBtn.clientWidth / 2 + "px";
            fixedBtn.style.top = y - fixedBtn.clientHeight / 2 + "px";
        }
    });

    document.addEventListener("mouseup", function(e) {
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
    searchBtn.addEventListener('click', function() {
        var searchInput = document.querySelector('#kw');
        var searchText = searchInput.value;
        var searchArr = searchText.split(' ');
        var hasValue = false;
        for (var key in searchArr) {
            if (searchArr[key] == '-csdn') {
                hasValue = true;
            }
        }
        if (!hasValue && isChecked) {
            searchInput.value = searchText + ' -csdn';
        }
    })
    function FKCSDN(name, value, ele) {
       isChecked = ele.checked;
       if(!ele.checked){
           var searchInput = document.querySelector('#kw');
           var searchText = searchInput.value;
           var searchArr = searchText.split(' ');
           var newArr = [];
           if(searchArr.includes('-csdn')){
               searchArr.forEach((value,index)=> {
                   if(value !=='-csdn'){
                       newArr.push(value);
                   }
               })
               searchInput.value = newArr.join(' ');
           }
       }
    }

})();
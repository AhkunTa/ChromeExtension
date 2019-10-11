let url = {
    link: {
        baidu: 'https://www.baidu.com/s?wd=',
        sogou: 'https://www.sogou.com/web?query=',
        google: 'https://google.com/search?q=',
        sanliu0: 'https://www.so.com/s?q=',
        doge: 'https://www.dogedoge.com/results?q=',
        duck: 'https://duckduckgo.com/?q='
    },
    jsonPLink: {
        baidu: 'https://www.baidu.com/sugrec?prod=pc',
        sogou: 'https://www.sogou.com/suggnew/ajajjson?type=web',
        google: 'https://www.google.com/complete/search?cp=2&client=psy-ab&hl=zh-CN',
        sanliu0: 'https://sug.so.360.cn/suggest?encodein=utf-8&encodeout=utf-8&format=json',
        doge: 'https://www.dogedoge.com/sugg/',
        duck: 'https://duckduckgo.com/ac/?kl=wt-wt&_=1570767110286'
    }
}

let indexValue = '01';
//默认为百度地址
let jsonPURL = url.jsonPLink.baidu;
let normalUrl = url.link.baidu;

let chooseItem = 0;
let isfirst = 1;
let word = '';

chrome.storage.local.get({ indexValue: '01', searchEngineName: 'baidu' }, function(data) {
    $('.search-engine').css({ 'background-image': 'url(../img/' + data.searchEngineName + '.png)' })
    indexValue = data.indexValue;
    jsonPURL = url.jsonPLink[data.searchEngineName];
    normalUrl = url.link[data.searchEngineName];
});

jumpToPage();

// window.sogou = {
//     sug: function(json) {
//         console.log(json)
//         let array = json[1];
//         for (let i = 0; i < array.length; i++) {
//             var str = str + `<li class="item">${array[i]}</li>`;
//         }
//         $('.content-list').html(str);
//     }
// }


// 按键按下 上下滑动选择事件
$('#search-input').on('keydown', function(event) {
    word = $('#search-input').val();
    // isfirst = 1;
    if (word.trim() == '') {
        $('.content-list').html('');
        return
    }
    if (event.keyCode == 13) {
        window.open(normalUrl + word)
    } else if (event.keyCode == 40) {
        // 下
        event.preventDefault();
        if (isfirst == 1) {
            isfirst = 2;
            chooseItem--;
        }
        chooseItem++;
        if ($('.content-list .item').length == 0) {
            return
        }
        if (chooseItem >= $('.content-list .item').length) {
            chooseItem = 0;
        }
        addBgcolor(chooseItem);
    } else if (event.keyCode == 38) {
        // 上
        event.preventDefault();
        chooseItem--;
        if ($('.content-list .item').length == 0) {
            return
        }
        if (Math.abs(chooseItem) >= $('.content-list .item').length) {
            chooseItem = 0;
        }
        addBgcolor(chooseItem);
    }
})

// $("#search-input").on('focus blur', function(event) {
//     $('.content-list').toggleClass('hidden')
// })
$("#search-input").on('focus', function(event) {
    $('.content-list').removeClass('hidden')
})

$("#search-input").on('keyup', function(event) {
    word = $('#search-input').val();
    if (word.trim() == '') {
        $('.content-list').html('');
        return
    } else if (event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 37 || event.keyCode == 39) {
        return
    }
    if (indexValue === '05') {
        jsonPURL = jsonPURL + word
    }
    $.ajax({
        url: jsonPURL,
        type: 'get',
        dataType: ajaxDataType(indexValue),
        data: ajaxJsonp(indexValue),
        success: function(data) {
            let str = '',
                array;
            if (indexValue === '01') {
                // baidu
                array = data.g
                if (array) {
                    for (let i = 0; i < array.length; i++) {
                        str = str + `<li class="item">${array[i].q}</li>`;
                    }
                }
            } else if (indexValue === '02') {
                // google
                // let reg = /^\)\]\}'{1}/i;
                // let newData = data.replace(reg,'').trim()
                // newData = newData.split('],{')[0].replace(/^\[\[/i,'').replace(/(".+")/g, "$1 ")
                // newData = newData
                // console.log(newData)
                // newData = newData.replace(/\],\[/mg,']||[').split('||')

                array = data[1];
                if (array) {
                    for (let i = 0; i < array.length; i++) {
                        str = str + `<li class="item">${array[i][0]}</li>`;
                    }
                }
            } else if (indexValue === '03') {
                // sogou
                let newData = data.replace(/(\[.*?\])/g, '$1(╰_╯)')
                array = newData.split('(╰_╯)')[0].replace(/window\.sogou\.sug\(\[/g, '').replace(/^".*?",/g,'"sogou":')
                let jsonSogou = JSON.parse('{'+array+'}')
                if(jsonSogou) {
                    for (let i = 0; i < jsonSogou.sogou.length; i++) {
                        str = str + `<li class="item">${jsonSogou.sogou[i]}</li>`;
                    }
                }
            } else if (indexValue === '04') {
                // 360
                array = data.result;
                let arrayLength = array.length
                if (array) {
                    arrayLength = arrayLength >= 10 ? 10 : arrayLength
                    for (let i = 0; i < arrayLength; i++) {
                        str = str + `<li class="item">${array[i].word}</li>`;
                    }
                }
            } else if (indexValue === '05') {
                // doge
                let newData = data.replace(/<\/div>/g, 'O(∩_∩)O').replace(/<.*?>/g, '')
                array = newData.split('O(∩_∩)O')
                array.pop();
                if (array) {
                    for (let i = 0; i < array.length; i++) {
                        str = str + `<li class="item">${array[i]}</li>`;
                    }
                }
            } else if (indexValue === '06') {
                // duck
                array = data;
                let arrayLength = array.length
                if (array) {
                    arrayLength = arrayLength >= 10 ? 10 : arrayLength
                    for (let i = 0; i < arrayLength; i++) {
                        str = str + `<li class="item">${array[i].phrase}</li>`;
                    }
                }
            }
            $('.content-list').html(str);
        },
        error: function(data, textStatus, errThrown) {
            if (indexValue === '02' || indexValue === '06') {
                console.log('访问google和duckduckgo需自带梯子')
            }
            console.log(data, textStatus, errThrown)
        }
    });
})


$('.content-list').on('mouseover', '.item', function() {
    $(this).removeClass('choose-bg-color');
    $(this).addClass('choose-bg-color')
})
$('.content-list').on('mouseout', '.item', function() {
    $(this).removeClass('choose-bg-color');
})

$('.choose-engine-box').on('click', function() {
    $('.choose-search-engine').toggleClass('hidden')
})

$('.engine-list').on('click', '.item', function() {
    let name = $(this).attr('data-name');
    indexValue = $(this).attr('data-value');
    jsonPURL = url.jsonPLink[name];
    normalUrl = url.link[name];
    $('.choose-search-engine').toggleClass('hidden');
    changeEngineClearData();
    $('.search-engine').css({ 'background-image': 'url(../img/' + name + '.png)' })
    chrome.storage.local.set({ indexValue: indexValue, searchEngineName: name }, function() {
        console.log('保存成功！');
    });
})

function jumpToPage() {
    $('.search-btn').on('click', function() {
        window.open(normalUrl + word);
    })
    $('.content-list').on('click', '.item', function() {
        window.open(normalUrl + $(this).text())
    })
}

function addBgcolor(chooseItem) {
    $('.content-list .item').removeClass('choose-bg-color')
    $('.content-list .item').eq(chooseItem).addClass('choose-bg-color');
    $('#search-input').val($('.content-list .item').eq(chooseItem).text());
}

function changeEngineClearData() {
    $('.content-list').html('');
    $('#search-input').focus();
    $('#search-input').val('');
    chooseItem = 0;
    isfirst = 1;
}

function ajaxDataType(searchEngineIndex) {
    switch (searchEngineIndex) {
        case '01':
            // baidu
            return 'json';
        case '02':
            // google
            return 'json';
        case '03':
            // sogou
            return '';
        case '04':
            // 360
            return 'json';
        case '05':
            // doge
            return 'text';
        case '06':
            // duck
            return 'json';
        default:
            return 'json';
    }

}

function ajaxJsonp(searchEngineIndex) {
    word = $('#search-input').val();
    let data = {}
    switch (searchEngineIndex) {
        case '01':
            // baidu
            data.wd = word;
            return data;
        case '02':
            // google
            data.q = word;
            return data;
        case '03':
            // sogou
            data.key = word;
            return data;
        case '04':
            // 360
            data.word = word;
            return data;
        case '05':
            // doge
            return data;
        case '06':
            // duck
            data.q = word;
            return data;
        default:
            data.wd = word;
            return data;
    }
}
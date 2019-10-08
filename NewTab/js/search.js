let url = {
    link: {
        baidu: 'https://www.baidu.com/s?wd=',
        sogou: 'https://www.sogou.com/web?query=1',
        google: 'https://google.com/search?q=',
        sanliu0: 'https://www.so.com/s?q=',
    },
    jsonPLink: {
        baidu: 'https://www.baidu.com/sugrec?prod=pc',
        sogou: 'https://www.sogou.com/suggnew/ajajjson',
        google: 'https://www.google.com/complete/search?cp=2&client=psy-ab&hl=zh-CN',
        sanliu0: 'https://sug.so.360.cn/suggest',
    }
}

let indexValue = '01';
//默认为百度地址
let jsonPURL = 'https://www.baidu.com/sugrec?prod=pc';
// let jsonPURL = 'https://www.sogou.com/suggnew/ajajjson?type=web';
// https://www.google.com/complete/search?q=11&cp=2&client=psy-ab&xssi=t&gs_ri=gws-wiz&hl=zh-CN&authuser=0&pq=1&psi=x5WMXf3hIpf7wAO-7aDYDQ.1569494472486&ei=x5WMXf3hIpf7wAO-7aDYDQ
let normalUrl = 'https://www.baidu.com/s?wd=';

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
    $.ajax({
        url: jsonPURL,
        type: "get",
        dataType: ajaxDataType(indexValue),
        data: ajaxJsonp(indexValue),
        success: function(data) {
            console.log(data)
            let str = '',
                array;
            if (indexValue === '01') {
                // baidu
                let array = data.g
                if (array) {
                    for (let i = 0; i < array.length; i++) {
                        str = str + `<li class="item">${array[i].q}</li>`;
                    }
                }
            } else if (indexValue === '02') {
                // google
                /* google传参不同 导致返回数据格式不同 ！！！ */
                // let reg = /^\)\]\}'{1}/i;
                // let newData = data.replace(reg,'').trim()
                // newData = newData.split('],{')[0].replace(/^\[\[/i,'').replace(/(".+")/g, "$1 ")
                // newData = newData
                // console.log(newData)
                // newData = newData.replace(/\],\[/mg,']||[').split('||')

                let array = data[1];
                if (array) {
                    for (let i = 0; i < array.length; i++) {
                        str = str + `<li class="item">${array[i][0]}</li>`;
                    }
                }
            } else if (indexValue === '03') {

            }
            $('.content-list').html(str);
        },
        error: function(data, textStatus, errThrown) {
            console.log('错误', data, textStatus, errThrown)
        }
    });
})

$('.content-list').on('mouseover', '.item', function() {
    $('.item').removeClass('choose-bg-color');
    $(this).addClass('choose-bg-color')
})
$('.content-list').on('mouseout', '.item', function() {
    $('.item').removeClass('choose-bg-color');
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
            return data;
        case '04':
            // 360
            data.key = word;
            return data;
        default:
            return 'json';
    }

}

function ajaxJsonp(searchEngineIndex) {
    word = $('#search-input').val();
    var data = {}
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
            data.wd = word;
            return data;
        case '04':
            // 360
            data.key = word;
            return data;
        default:
            data.wd = word;
            return data;
    }
}
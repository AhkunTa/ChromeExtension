// 背景图来自必应背景api接口
let bingUrl = `https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=10&nc=1501558320736&pid=hp`
let weatherUrl = `https://www.tianqiapi.com/api/?version=v1&&appid=1001&appsecret=5566`
// 今日诗词
let oneUrl = `https://v2.jinrishici.com/one.json`
let clock = {
    time: '',
    date: '',
    am_pm: ''
}
let settings = {
    setRandomBg: true,
    setHours: false,
    setWeather: true,
    setSearch: true,
    setOneMsg: true,
    setTime: true,
    oneMsgToken: ''
}

config()
// updateWeather()


function config() {
    // $('.background-image').each(function() {
    //     if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
    //         $('.background-image').hide();
    //     }
    // })

    chrome.storage.local.get({ bgImg: '', randomBg: 'true', timeFormat: '24', time: 'true', weather: 'true', search: 'true', oneMsg: 'true', oneMsgToken: '' }, function(config) {
        let items = $('.setting-list .setting-item');
        settings.setHours = config.timeFormat === '12';
        settings.setTime = config.time === 'true';
        settings.setRandomBg = config.randomBg === 'true';
        settings.setWeather = config.weather === 'true';
        settings.setSearch = config.search === 'true';
        settings.setOneMsg = config.oneMsg === 'true';
        settings.oneMsgToken = config.oneMsgToken;

        if (!settings.setRandomBg && config.bgImg !== '') {
            updateTime(settings.setHours);
            $('#background-image').attr({ 'src': config.bgImg })
            $('#background-image').fadeIn();
            $('.select-background').show();
        } else {
            updateTime(settings.setHours);
            updateBg();
        }
        if (settings.setOneMsg) {
            updateOneMsg()
        } else {
            $('.poetry-content').hide();
        }
        if (settings.setSearch) {
            $('.search-box').show();
        } else {
            $('.search-box').hide();
        }
        if (settings.setTime) {
            $('.select-time-format').show();
            $('.clock-inner').show();
        } else {
            $('.clock-inner').hide();
            $('.select-time-format').hide();

        }
        items.find('[name=randomBg][value="' + config.randomBg + '"]').attr('checked', true);
        items.find('[name=timeFormat][value="' + config.timeFormat + '"]').attr('checked', true);
        items.find('[name=time][value="' + config.time + '"]').attr('checked', true);
        // items.find('[name=weather][value="' + config.weather + '"]').attr('checked', true);
        items.find('[name=search][value="' + config.search + '"]').attr('checked', true);
        items.find('[name=oneMsg][value="' + config.oneMsg + '"]').attr('checked', true);
    });
}

function updateOneMsg() {
    $.ajax({
        type: 'get',
        url: oneUrl,
        data: {},
        dataType: 'json',
        beforeSend: function(XMLHttpRequest) {
            if (settings.oneMsgToken !== '') {
                XMLHttpRequest.setRequestHeader("X-User-Token", settings.oneMsgToken);
            }
        },
        success: function(data) {
            let content = data.data.content;
            let origin = data.data.origin;
            let str = '';
            $('#content').text(content)
            $('#poetry-name').text(origin.title + ' — ' + origin.author)
            $('.poetry-whole-title').text(origin.title)
            $('.poetry-whole-dynasty').text(origin.dynasty + ' — ' + origin.author)
            for (let i = 0; i < origin.content.length; i++) {
                str = str + `<li class="item">${origin.content[i]}</li>`;
            }
            $('.poetry-list').html(str);
            $('.poetry-content').fadeIn();
            if (settings.oneMsgToken !== data.token) {
                chrome.storage.local.set({ oneMsgToken: data.token }, function(config) {
                    console.log('oneMsgToken保存成功！', data.token)
                })
            }
        },
        error: function(data) {
            $('.poetry-content').fadeOut();
            console.log(data.errMessage || data.errCode || 'oneMsg出错了！')
        }
    })

}

function updateBg() {
    $('#background').css({ 'opacity': '0' })
    $.ajax({
        type: 'get',
        url: bingUrl,
        data: {},
        dataType: 'json',
        success: function(data) {
            let randomBgIndex = Math.ceil(Math.random() * data.images.length);
            let bgUrl = 'url(https://cn.bing.com' + data.images[randomBgIndex - 1].url + ')';
            $('#background').css({ 'background-image': bgUrl })
            backgroundLoaded($('#background'), true, function() {
                $('#background-image').hide();
                $('#background').css({ 'opacity': '1' })
            })
        },
        error: function(data) {
            let radomColor = `rgb(${Math.round(Math.random()*100)}, ${Math.round(Math.random()*100)} , ${Math.round(Math.random()*100)})`
            $('#background').css({ 'background': radomColor, 'opacity': '1' })
            console.log(data.code || data.msg || '出错了！')
        }
    })
}

function backgroundLoaded(backgroundImageEle, isbackground, callback) {
    let background, imgUrl;
    if (isbackground) {
        background = backgroundImageEle.css("background-image");
        imgUrl = background.match(/url\("(\S*)"\)/)[1];
    } else {
        imgUrl = backgroundImageEle.attr('src');
    }
    let img = new Image();
    img.src = imgUrl;
    let timer = setInterval(function() {
        if (img.complete) {
            clearInterval(timer)
            callback()
        }
    }, 200)
}

function updateWeather() {
    $.ajax({
        type: 'get',
        url: weatherUrl,
        data: {
            appid: '91362169',
            appsecret: '4BXeF7Nd',
            version: 'v6'
        },
        dataType: 'json',
        success: function(data) {
            console.log(data)
        },
        error: function(data) {}
    })
}

function updateTime(twelveHour) {
    if (twelveHour === true) {
        $('#am-pm').show();
    } else {
        $('#am-pm').hide();
    }
    getLangDate(twelveHour)
    setInterval(function() {
        getLangDate(twelveHour)
    }, 60000)
}

function dateFilter(date) {
    if (date < 10) {
        return "0" + date;
    }
    return date;
}

function getLangDate(twelveHour) {
    let dateObj = new Date();
    // let year = dateObj.getFullYear()
    // let month = dateObj.getMonth() + 1;
    // let date = dateObj.getDate();
    let hour = dateObj.getHours();
    let minute = dateObj.getMinutes();
    if (hour < 12) {
        clock.am_pm = 'AM'
    } else {
        if (twelveHour) {
            hour = hour - 12
        }
        clock.am_pm = 'PM'
    }
    clock.time = `${dateFilter(hour)}:${dateFilter(minute)}`;
    // clock.date = `${dateFilter(year)} / ${dateFilter(month)} / ${dateFilter(date)}`;
    $('#time').html(clock.time);
    $('#date').html(clock.date);
    $('#am-pm').html(clock.am_pm);
}

function chooseImage(fileDOM) {
    let file = fileDOM.files[0], // 获取文件
        imageType = /^image\//,
        reader = '';
    if (file && !imageType.test(file.type)) {
        alert("请选择图片！");
        return;
    }
    if (window.FileReader) {
        reader = new FileReader();
    } else {
        alert("您的浏览器不支持图片预览功能，如需该功能请升级您的浏览器！");
        return;
    }
    reader.onload = function(event) {
        $('#background-image').attr({ 'src': event.target.result })
        chrome.storage.local.set({ bgImg: event.target.result }, function() {
            console.log('backgroundImg保存成功！');
        });
    };
    reader.readAsDataURL(file);
}

$('.choose-image').on('change', function() {
    chooseImage($(this)[0]);
})

$('.setting-btn').on('click', function(event) {
    $('.fixed-left').toggleClass('move-active');
    $('.setting-btn').toggleClass('rotate')
    event.stopPropagation();
})
$('.app-contents,.setting-back').on('click', function() {
    if ($('.fixed-left').hasClass('move-active')) {
        $('.fixed-left').removeClass('move-active');
        $('.setting-btn').removeClass('rotate');
    }
})

$('.poetry-content').on('click', function() {
    $('.poetry-whole').toggleClass('hidden');
})

// $('.app-contents').on('click',function() {
//     $('.line').removeClass('opacity-show');
//     $('.hide-content').removeClass('opacity-hide');
// })

$('.search-input').on('focus blur', function() {
    $('.line').toggleClass('opacity-show');
    $('.hide-content').toggleClass('opacity-hide');
})


// $('.search-input').on('focus',function(e){
//     e.stopPropagation();
//     e.preventDefault();
//     $('.line').addClass('opacity-show');
//     $('.hide-content').addClass('opacity-hide');
// })

$(document).on('change', '.setting-item input[type="radio"]', function(e) {
    let $radio = $(this);
    let $radioName = $radio.attr('name')
    let $radioList = $radio.closest('.setting-item');
    listenRadioChange($radioList, $radioName, $radio.val());
});

function listenRadioChange(radioList, radioName, value) {
    switch (radioName) {
        case 'randomBg':
            chrome.storage.local.set({ randomBg: value }, function() {
                console.log('radomBg保存成功！', value);
            });
            if (value === 'true') {
                updateBg();
                $('.select-background').hide();
            } else {
                config()
                $('.select-background').show();
            }
            break;
        case 'timeFormat':
            chrome.storage.local.set({ timeFormat: value }, function() {
                console.log('timeformat保存成功！', value);
            });
            if (value === '12') {
                settings.setHours = true
                updateTime(true)
            } else if (value === '24') {
                settings.setHours = false
                updateTime(false)
            }
            break;
        case 'time':
            chrome.storage.local.set({ time: value }, function() {
                console.log('time保存成功！', value);
            });
            if (value === 'true') {
                $('.clock-inner').fadeIn();
                $('.select-time-format').show();
            } else if (value === 'false') {
                $('.clock-inner').fadeOut();
                $('.select-time-format').hide();
            }
            break;
        case 'weather':
            break;
        case 'search':
            chrome.storage.local.set({ search: value }, function() {
                console.log('search保存成功！', value);
            });
            if (value === 'true') {
                $('.search-box').fadeIn();
            } else if (value === 'false') {
                $('.search-box').fadeOut();
            }
            break;
        case 'oneMsg':
            chrome.storage.local.set({ oneMsg: value }, function() {
                console.log('oneMsg保存成功！', value);
            });
            if (value === 'true') {
                updateOneMsg()
            } else if (value === 'false') {
                $('.poetry-content').fadeOut();
            }
        default:
            break;
    }
}
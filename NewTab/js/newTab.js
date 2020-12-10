// 背景图来自必应背景api接口
let bingUrl = `https://cn.bing.com/HPImageArchive.aspx?format=js&n=10`;
// 背景图片接口来自https://unsplash.com
let unsplashUrl = `https://unsplash.com/napi/search/photos?query=desktop%20background`
// 天气接口暂未实现
let weatherUrl = `https://www.tianqiapi.com/api/?version=v1&&appid=1001&appsecret=5566`
// 今日诗词
let oneUrl = `https://v2.jinrishici.com/one.json`
// 一言
let oneYan = `https://v1.hitokoto.cn/?encode=json`
// 毒鸡汤来自
// https://dujitang.90so.net/docs/1.0/apis/get_a_soup
let soul = `https://dujitang.90so.net/api/soups`

let clock = {
    time: '',
    date: '',
    am_pm: ''
}
let settings = {
    setBgImg: '',
    setRandomBg: true,
    setHours: false,
    setBackgroundUrl: true,
    setWeather: true,
    setSearch: true,
    setOneMsg: true,
    setTime: true,
    setShowChickenSoup: true,
    setChickenSoup: true,
    oneMsgToken: '',
}

let updataTimeInterval, backgroundUrl = bingUrl;
config()
// updataWeather()


function config() {

    /*  默认
        随机图片  必应背景
        展示时间  12小时
        展示搜索
        展示古诗
        展示毒鸡汤
    */
    chrome.storage.local.get({
        bgImg: '',
        randomBg: true,
        backgroundUrl: true,
        timeFormat: true,
        time: true,
        weather: true,
        search: true,
        oneMsg: true,
        showChickenSoup: true,
        chickenSoup: true,
        oneMsgToken: ''
    }, function(config) {
        let items = $('.setting-item .check-item');
        settings.setBgImg = config.bgImg;
        settings.setHours = config.timeFormat;
        settings.setTime = config.time;
        settings.setRandomBg = config.randomBg;
        settings.backgroundUrl = config.backgroundUrl;
        // settings.setWeather = config.weather === 'true';
        settings.setSearch = config.search;
        settings.setOneMsg = config.oneMsg;
        settings.oneMsgToken = config.oneMsgToken;
        settings.setShowChickenSoup = config.showChickenSoup;
        settings.setChickenSoup = config.chickenSoup;

        if (!settings.setRandomBg) {
            $('.select-background').show();
            $('.select-background-url').hide();
            if (config.bgImg !== '') {
                $('#background-image').attr({ 'src': config.bgImg })
                $('#background-image').fadeIn();
            }else {
                let radomColor = `rgb(${Math.round(Math.random()*100)}, ${Math.round(Math.random()*100)} , ${Math.round(Math.random()*100)})`
                $('#background').show().css({ 'background-color': radomColor, 'opacity': '1' })
            }
        } else {
            $('.select-background-url').show();
            if (!settings.backgroundUrl) {
                $('.select-background-url .check-title').text('unsplash背景')
                backgroundUrl = unsplashUrl;
            }
            updataBg(backgroundUrl);
        }

        if (settings.setOneMsg) {
            updataOneMsg()
            $('#refresh-poetry').show();
        } else {
            $('#refresh-poetry').hide();
            $('.poetry-content').hide();
        }

        if (settings.setSearch) {
            $('.search-box').show();
        } else {
            $('.search-box').hide();
        }

        if (settings.setTime) {
            updataTime(settings.setHours)
            $('.select-time-format').show();
            $('.clock-inner').show();
        } else {
            $('.clock-inner').hide();
            $('.select-time-format').hide();
        }
        if (!settings.setShowChickenSoup) {
            $('.select-chicken-soup').hide();
        } else {
            $('.select-chicken-soup').show();
            if (settings.setChickenSoup) {
                $('.select-chicken-soup .check-title').text('来碗鸡汤')
            } else {
                $('.select-chicken-soup .check-title').text('来碗毒鸡汤')
            }
            updataChickenSoup(settings.setChickenSoup);
        }

        items.find('[name=randomBg]').prop('checked', config.randomBg);
        items.find('[name=backgroundUrl]').prop('checked', config.backgroundUrl);
        items.find('[name=timeFormat]').prop('checked', config.timeFormat);
        items.find('[name=time]').prop('checked', config.time);
        // items.find('[name=weather][value="' + config.weather + '"]').attr('checked', true);
        items.find('[name=search]').prop('checked', config.search);
        items.find('[name=oneMsg]').prop('checked', config.oneMsg);
        items.find('[name=showChickenSoup]').prop('checked', config.showChickenSoup);
        items.find('[name=chickenSoup]').prop('checked', config.chickenSoup);
    });
}

function updataOneMsg() {
    $('.poetry-whole').css({ 'max-width': `${document.documentElement.clientWidth-200}px` })
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
            $('#content').text(content);
            $('#poetry-name').text(origin.title + ' — ' + origin.author);
            $('.poetry-whole-title').text(origin.title);
            $('.poetry-whole-dynasty').text(origin.dynasty + ' — ' + origin.author);
            for (let i = 0; i < origin.content.length; i++) {
                str = str + `<li class="item">${origin.content[i]}</li>`;
            }
            $('.poetry-list').html(str);
            $('.poetry-content').fadeIn();
            if (settings.oneMsgToken !== data.token) {
                chrome.storage.local.set({ oneMsgToken: data.token }, function(config) {
                    console.log('oneMsgToken保存成功！', data.token);
                })
            }
        },
        error: function(data) {
            $('.poetry-content').fadeOut();
            console.log(data.errMessage || data.errCode || 'oneMsg出错了！');
        }
    })
}

function updataChickenSoup(flag) {
    if (flag) {
        $.ajax({
            type: 'get',
            url: oneYan,
            data: {},
            dataType: 'json',
            success: function(data) {
                $('.chicken-soup-text').text(data.hitokoto)
                $('.chicken-soup-from').text(' — ' + data.from)
                $('.chicken-soup').fadeIn();
            },
            error: function(data) {
                console.log(data.code || data.msg || '一言出错了！')
            }
        })
    } else {
        $.ajax({
            type: 'get',
            url: soul,
            data: {},
            dataType: 'json',
            success: function(data) {
                $('.chicken-soup-text').text(data.title)
                $('.chicken-soup-from').text('')
                $('.chicken-soup').fadeIn();
            },
            error: function(data) {
                let randomSoul = Math.ceil(soulArr.length * Math.random());
                $('.chicken-soup-text').text(soulArr[randomSoul - 1]);
                $('.chicken-soup-from').text('');
                $('.chicken-soup').fadeIn();
                console.log(data.code || data.msg || '毒鸡汤出错了！')
            }
        })
    }
}

function updataBg(url) {
    $('#background').hide();
    $('#background').css({ 'opacity': '0' })
    $.ajax({
        type: 'get',
        url: url,
        data: {
            page: Math.ceil(Math.random() * 20)
        },
        dataType: 'json',
        success: function(data) {
            if (url == bingUrl) {
                let randomBgIndex = Math.ceil(Math.random() * data.images.length);
                let bgUrl = 'url(https://cn.bing.com' + data.images[randomBgIndex - 1].url + ')';
                $('#background').css({ 'background-image': bgUrl })
                backgroundLoaded($('#background'), true, function() {
                    if ($('.select-radom .radio-item [type=radio]:checked').attr('value') == 'false') {
                        $('#background-image').attr({ 'src': settings.setBgImg })
                        $('#background-image').fadeIn();
                        $('.select-background').show();
                        $('.select-background-url').hide();
                        return
                    }
                    // if ($('.select-background-url .radio-item [type=radio]:checked').attr('value') == 'unsplash') {
                    //     return
                    // }
                    $('#background-image').hide();
                    $('#background').show();
                    $('#background').css({ 'opacity': '1' })
                })
            } else {
                // 二百张图片随机获取
                let randomBgIndex = Math.ceil(Math.random() * 10);
                // 修改图片质量

                // 常规 0-1 M
                let bgUrl = data.results[randomBgIndex - 1].urls.regular;

                // 全屏 2~5M
                // let bgUrl = data.results[randomBgIndex].urls.full;

                // 原生 10+M
                // let bgUrl = data.results[randomBgIndex].urls.raw;

                $('#background').css({ 'background-image': 'url(' + bgUrl + ')' })
                backgroundLoaded($('#background'), true, function() {
                    if ($('.select-radom .radio-item [type=radio]:checked').attr('value') == 'false') {
                        $('#background-image').attr({ 'src': settings.setBgImg })
                        $('#background-image').fadeIn();
                        $('.select-background').show();
                        $('.select-background-url').hide();
                        return
                    }
                    // if ($('.select-background-url .radio-item [type=radio]:checked').attr('value') == 'bing') {
                    //     console.log(222)
                    //     return
                    // }
                    $('#background-image').hide();
                    $('#background').show();
                    $('#background').css({ 'opacity': '1' });
                })
            }

        },
        error: function(data) {
            let radomColor = `rgb(${Math.round(Math.random()*100)}, ${Math.round(Math.random()*100)} , ${Math.round(Math.random()*100)})`
            $('#background').show().css({ 'background-color': radomColor, 'opacity': '1' })
            console.log(data.code || data.msg || '背景出错了！')
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
            clearInterval(timer);
            callback();
        }
    }, 200)
}

// function updataWeather() {
//     $.ajax({
//         type: 'get',
//         url: weatherUrl,
//         data: {
//             appid: '91362169',
//             appsecret: '4BXeF7Nd',
//             version: 'v6'
//         },
//         dataType: 'json',
//         success: function(data) {
//             console.log(data);
//         },
//         error: function(data) {}
//     })
// }

// true 12小时
// false 24小时
function updataTime(twelveHour) {
    if (twelveHour === true) {
        $('#am-pm').show();
        $('.select-time-format .check-title').text('十二小时')
    } else {
        $('.select-time-format .check-title').text('二十四小时')
        $('#am-pm').hide();
    }
    getLangDate(twelveHour)
    updataTimeInterval = setInterval(function() {
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
        clock.am_pm = 'AM';
    } else {
        if (twelveHour) {
            hour = hour - 12;
        }
        clock.am_pm = 'PM';
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
        $('#background-image').attr({ 'src': event.target.result });
        chromeStorageSet('bgImg',event.target.result);
        settings.setBgImg = event.target.result;
    };
    reader.readAsDataURL(file);
}

$('.choose-image').on('change', function() {
    chooseImage($(this)[0]);
    $('#background-image').attr({ 'src': settings.setBgImg })
    $('#background-image').fadeIn();
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

$('input[type=checkbox]').on('change', function() {
    let $check = $(this)
    let $checkName = $check.attr('name');
    let $checkVal = $check.prop('checked');
    listenCheckChange($check, $checkName, $checkVal)
})

$('.poetry-content').on('click', function() {
    $('.poetry-whole').toggleClass('hidden');
})

$('.search-input').on('focus blur', function() {
    $('.line').toggleClass('opacity-show');
    $('.hide-content').toggleClass('opacity-hide');
})

$('.refresh').on('click', function() {
    var checkRadio = $(this).siblings().children('[type=checkbox]');
    var checkName = checkRadio.attr('name')
    var checkValue = checkRadio.prop('checked')
    switch (checkName) {
        case 'backgroundUrl':
            if (checkValue) {
                backgroundUrl = bingUrl;
            } else {
                backgroundUrl = unsplashUrl;
            }
            updataBg(backgroundUrl);
            break;
        case 'oneMsg':
            if (checkValue) {
                updataOneMsg();
            }
            break;
        case 'chickenSoup':
            updataChickenSoup(checkValue);
            break;
    }
})

function chromeStorageSet(key, value) {
    chrome.storage.local.set({
        [key]: value
    }, function() {
        console.log(key, '保存成功！', value);
    });
}

function updataRandomBg() {
    if ($('.select-background-url').find('input[type=checkbox]').is(':checked')) {
        $('.select-background-url .check-title').text('必应背景')
        backgroundUrl = bingUrl;
    } else {
        $('.select-background-url .check-title').text('unsplash背景')
        backgroundUrl = unsplashUrl;
    }
}


function listenCheckChange(check, checkName, value) {
    switch (checkName) {
        case 'randomBg':
            chromeStorageSet('randomBg', value)
            if (value) {
                updataRandomBg()
                updataBg(backgroundUrl);
                $('.select-background-url').show();
                $('.select-background').hide();
            } else {
                if (settings.setBgImg !== '') {
                    $('#background-image').attr({ 'src': settings.setBgImg })
                    $('#background-image').fadeIn();
                }
                $('.select-background').show();
                $('.select-background-url').hide();
            }
            break;
        case 'backgroundUrl':
            chromeStorageSet('backgroundUrl', value)
            updataRandomBg()
            updataBg(backgroundUrl);
            break
        case 'timeFormat':
            chromeStorageSet('timeFormat', value);
            clearInterval(updataTimeInterval);
            if (value) {
                // 24
                // settings.setHours = true
                updataTime(true)
            } else {
                // 12
                // settings.setHours = false
                updataTime(false)
            }
            break;
        case 'time':
            chromeStorageSet('time', value);
            if (value) {
                updataTime(settings.setHours);
                $('.clock-inner').fadeIn();
                $('.select-time-format').show();
            } else {
                clearInterval(updataTimeInterval);
                $('.clock-inner').fadeOut();
                $('.select-time-format').hide();
            }
            break;
        case 'weather':
            break;
        case 'search':
            chromeStorageSet('search', value);
            if (value) {
                $('.search-box').fadeIn();
            } else {
                $('.search-box').fadeOut();
            }
            break;
        case 'oneMsg':
            chromeStorageSet('oneMsg', value);
            if (value) {
                $('#refresh-poetry').fadeIn();
                updataOneMsg()
            } else {
                $('#refresh-poetry').hide();
                $('.poetry-content').fadeOut();
            }
            break;
        case 'showChickenSoup':
            chromeStorageSet('showChickenSoup', value);
            if (value) {
                $('.select-chicken-soup').show();
                if ($('.select-chicken-soup').find('input[type=checkbox]').is(':checked')) {
                    $('.select-chicken-soup .check-title').text('来碗鸡汤')
                    updataChickenSoup(true);
                } else {
                    $('.select-chicken-soup .check-title').text('来碗毒鸡汤')
                    updataChickenSoup(false);
                }
            } else {
                $('.select-chicken-soup').hide();
                $('.chicken-soup').hide()
            }
            break;
        case 'chickenSoup':
            chromeStorageSet('chickenSoup', value);
            updataChickenSoup(value);
            if (value) {
                $('.select-chicken-soup .check-title').text('来碗鸡汤')
            } else {
                $('.select-chicken-soup .check-title').text('来碗毒鸡汤')
            }
            break;
        default:
            break;
    }
}
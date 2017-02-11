/*
* @author sergix / http://sergix.visualstudio.net/
*/

/*
* Game Engine dev1.3 Worker Full Script
* (c) 2016 Sergix
*/

onmessage = function (evt) {
    if (evt.data.task === undefined) return 0;
    postMessage(evt.data());
    return 1;
}
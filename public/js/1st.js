const tags = document.getElementsByClassName("tags")[0];
var list = ["FITNESS FREAKS", "DEVELOPERS", "VEGANS", "EVERYONE"];
var counter = 0;

function rotate() {
    if (tags == undefined)
        return;
    setInterval(function () {
        var flag = 0;
        var i = 0;
        var timer = setInterval(function () {
            if (flag == 0) {
                if (tags.textContent.length == 0) {
                    flag = 1;
                }
                tags.textContent = tags.textContent.slice(0, tags.textContent.length - 1);
            } else {
                if (i == list[counter].length) {
                    clearInterval(timer);
                }
                tags.textContent += list[counter].charAt(i++);
            }
        }, 50);
        counter++;
        if (counter >= list.length) {
            counter = 0;
        }
    }, 10000);
}
rotate();
String.prototype.q2obj = function () {
    var qArr = this.split("&"),
        qObj = {},
        i = -1;
    while (++i < qArr.length) {
        qfrag = qArr[i].split("=");
        qObj[qfrag[0]] = qfrag[1];
    }
    return qObj;
};

var queryObj = location.search.substr(1).q2obj();

// Query should be like:
//
// {
//     "resource": "something",
// }

window.addEventListener("load", () => {
    let list = document.getElementById("photos-list");
    let endpoint = `../portfolio/${queryObj.resource}`;
    let mainResource = `${endpoint}/index.png`;
    var imagesCount = 1;

    list.innerHTML = `
    <li>
        <img 
            class="photo"
            src="${mainResource}"
            alt="index"
            onClick="window.open(this.src)"
        />
    </li>
    `;

    while (imagesCount != -1) {
        let resource = `${endpoint}/${queryObj.resource}-0${imagesCount}.png`;

        if (isNotExist(resource)) {
            imagesCount = -1;
        } else {
            list.innerHTML += `
            <li>
                <img
                    class="photo" 
                    src="${resource}"
                    alt="${imagesCount}"
                    onClick="window.open(this.src)"
                />
            </li>
            `;
            imagesCount += 1;
        }
    }
});

function isNotExist(url) {
    var http = new XMLHttpRequest();
    http.open("HEAD", url, false);
    http.send();
    return http.status == 404;
}

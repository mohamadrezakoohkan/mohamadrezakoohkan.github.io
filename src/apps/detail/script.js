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
//     "count": 0
// }

window.addEventListener("load", () => {
    let list = document.getElementById("photos-list");
    let endpoint = `../portfolio/${queryObj.resource}`;
    let mainResource = `${endpoint}/index.png`;

    list.innerHTML = `
    <li>
        <a href="${mainResource}" target="_blank">
            <img class="photo" src="${mainResource}" alt=""/>
        </a>
    </li>
    `;

    for (i = 1; i <= queryObj.count; i++) {
        let resource = `${endpoint}/${queryObj.resource}-0${i}.png`;
        list.innerHTML += `
        <li>
            <a href="${resource}" target="_blank">
                <img class="photo" src="${resource}" alt=""/>
            </a>
        </li>
        `;
    }
});

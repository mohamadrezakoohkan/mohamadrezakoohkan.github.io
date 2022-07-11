const data = [
    {
        title: "Qsouq",
        description:
            "Qsouuq is the style shopping destination for qatar. With the largest online selection of leading brands in fashion. Also multilingual!",
        resource: "qsouq",
        imagesCount: 0,
        link: "https://apps.apple.com/us/app/1sell-easy-online-shopping/id1596568282",
    },
    {
        title: "Rafiji Customer",
        description:
            "Rafiji Customer is an application for best and the highest quality of carwash & laundry services all over Doha. Also this app is multilingual and covers both RTL and LTR languages.",
        resource: "rafijicustomer",
        imagesCount: 1,
        link: "",
    },
    {
        title: "Rafiji Pro",
        description:
            "Rafiji pro is an application for employees (professionals), They can take their tasks and managing their financial status. Also this app is multilingual and covers both RTL and LTR languages.",
        resource: "rafijipro",
        imagesCount: 0,
        link: "",
    },
    {
        title: "COVID-19: Radar",
        description:
            "This app keep track of spread coronavirus (COVID-19), totally free to use and open source, have option to receive push notification about COVID-19 news, a lot of option for sorting data",
        resource: "covid19radar",
        imagesCount: 0,
        link: "",
    },
    {
        title: "Turbo remote",
        description:
            "Turbo remote is a car remote controller for TURBO GPS trackers which can locate vehicle and do stuff in vehicle, This app uses MQTT and SMS to track and execute command on GPS",
        resource: "turbo",
        imagesCount: 0,
        link: "",
    },
    {
        title: "DDoS",
        description:
            "This app send packets with your desired size to victim server with Semaphore or Mutex to handle multithreading. Tests on iPhone XS Max had result of 1000 packets per second.",
        resource: "ddos",
        imagesCount: 0,
        link: "",
    },
    {
        title: "Hamyan 3.0.0",
        description:
            "Hamyan is a mobile lending app where you can get fair, friendly loans in minutes, This version contains various UI changes and new features",
        resource: "hamyan2",
        imagesCount: 1,
        link: "",
    },
    {
        title: "Hamyan 1.5.3",
        description: "Hamyan is a mobile lending app where you can get fair, friendly loans in minutes.",
        resource: "hamyan1",
        imagesCount: 0,
        link: "",
    },
    {
        title: "Navano 2.8.5",
        description:
            "An online traditional music player app that written with RxSwif, Also available for CarPlay and Apple Watch. Cotains AR for entertainment and Machine Learning for image processing to control music based on hand gesture. This version contains UI changes and new player performance",
        resource: "navano2",
        imagesCount: 1,
        link: "",
    },
    {
        title: "Navano 1.4.3",
        description:
            "An online traditional music player app that written with RxSwif, Also available for CarPlay and Apple Watch. Cotains AR for entertainment and Machine Learning for image processing to control music based on hand gesture.",
        resource: "navano1",
        imagesCount: 6,
        link: "",
    },
    {
        title: "Calculator",
        description:
            "A photo vault app to keep your photos, videos, contacts and notes safe. There is an internal web browser with private cookie storage to keep your browsing sessions live forever.",
        resource: "calculator",
        imagesCount: 8,
        link: "",
    },
    {
        title: "SweetSense",
        description: "This app is for a pastry with online shopping and delivery tracking. And order customized cakes.",
        resource: "sweetsense",
        imagesCount: 0,
        link: "",
    },
    {
        title: "Dariush Carpet",
        description:
            "This app is an online carpet shop to great Iranian carpet. Dariush Carpet have Augmented Reality (AR) to place your desired carpet in your place.",
        resource: "dariushcarpet",
        imagesCount: 4,
        link: "",
    },
    {
        title: "NIKZEE",
        description:
            "NIKZEE is an online learning and teaching marketplace with over 10000 courses and 2 million students",
        resource: "nikzee",
        imagesCount: 0,
        link: "",
    },
    {
        title: "Sakhtemun Yar",
        description: "SakhtemunYar is a building construction marketplace to ask for workers and materials.",
        resource: "sakhtemunyar",
        imagesCount: 5,
        link: "",
    },
    {
        title: "Winner marketing 3.1.0",
        description: "Next generation of WinnerMarketing with diffrent UI and more features",
        resource: "winnermarketing3",
        imagesCount: 6,
        link: "",
    },
    {
        title: "Winner marketing 2.5.9",
        description: "Next generation of WinnerMarketing is a wholesaling app that connects factories to wholesalers",
        resource: "winnermarketing2",
        imagesCount: 8,
        link: "",
    },
    {
        title: "Winner marketing 1.2.0",
        description:
            "This app is a wholesaling app that connects companies to wholesalers for selling IT related stuff.",
        resource: "winnermarketing1",
        imagesCount: 5,
        link: "",
    },
    {
        title: "Hajabdollah Candy",
        description:
            "Hajabdollah is a iranian candy factory, This apps is online shopping for all Hajabdollah stores and contains Machine learning to automate purchasing a product in local stores using app and phone camera.",
        resource: "hajabdollah",
        imagesCount: 0,
        link: "",
    },
    {
        title: "Success Calendar",
        description:
            "Psychological counseling app with calendar, reminder, psychological tests, psychological stories and online realtime support",
        resource: "successcalendar",
        imagesCount: 10,
        link: "",
    },
    {
        title: "Tavan Market",
        description:
            "This app is for Tavan charity community to spend money on charity and be aware of news of community and congresses",
        resource: "tavanmarket",
        imagesCount: 2,
        link: "",
    },
    {
        title: "Todo",
        description:
            "Todo is a reminder for tasks based on Agile Scrum task management and can connect with Trello to fetch data. Has ability to group tasks, works and teams",
        resource: "todo",
        imagesCount: 3,
        link: "",
    },
    {
        title: "Scale",
        description: "This app measure up to 3KG using 3D touch tools and process scale with touch pressure.",
        resource: "scale",
        imagesCount: 2,
        link: "",
    },
    {
        title: "Quran Karim",
        description: "Quran karim is a quran player with lyrics. Lyrics is synced with sound.",
        resource: "quran",
        imagesCount: 1,
        link: "",
    },
];

window.addEventListener("load", () => {
    let appsList = document.getElementById("apps-list");
    appsList.innerHTML = "";

    for (let app of data) {
        var seeMore = `<button class="btn btn--block card__btn" onclick="location.href='../apps/detail/index.html?resource=${app.resource}&count=${app.imagesCount}'">See photos...</button>`;

        if (app.link != "") {
            seeMore += `<button class="btn btn--block card__btn" onclick="window.open('${app.link}', '_blank')">See on AppStore...</button>`;
        }

        appsList.innerHTML += `
        <li class="card">
            <div class="card-body">
                <img class="card-image" src="portfolio/${app.resource}/index.png" alt="Lynx"></img>
                <div class="card-content">
                    <div class="card-title">${app.title}</div>
                    <p class="card-text">${app.description}</p>
                    ${seeMore}
                </div>
            </div>
        </li>
        `;
    }
});

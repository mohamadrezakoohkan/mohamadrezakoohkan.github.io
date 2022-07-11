const data = [
    {
        title: "Jetpush CI/CD Tool",
        description:
            "Jetpush is a Continues Deployment tool for iOS distribution with automatic signing. Also Jetpush can create GitHub and GitLab CI configuration",
        link: "https://github.com/mohamadrezakoohkan/Jetpush",
    },
    {
        title: "Resigner",
        description:
            "Resigner is a shell script to automate re signing iOS app's This tool takes 9 step to resign an iOS app under 10 second",
        link: "https://github.com/mohamadrezakoohkan/Resigner",
    },
    {
        title: "Plister",
        description:
            "Working with property lists like a piece of cake. Plister creates,read,update and delete .plist files super fast in just one row. Also values can encrypt by AES encryption and plister will decrypt values when you need them!",
        link: "https://github.com/mohamadrezakoohkan/Plister",
    },
    {
        title: "Dequer",
        description:
            "Dequer is a light weight library to handle Any Cell. One of the most used things in iOS development is deque UITableViewCell or UICollectionViewCell through DataSources and it has some configuration. I maded an extension and protocol which reuse a cell as clean as possible.",
        link: "https://github.com/mohamadrezakoohkan/Dequer",
    },
    {
        title: "Balloon Slider",
        description: "UISlier with Animated Balloon representing slider value.",
        link: "https://github.com/mohamadrezakoohkan/BalloonSlider",
    },
];

window.addEventListener("load", () => {
    let postsList = document.getElementById("posts");
    postsList.innerHTML = "";
    for (let post of data) {
        posts.innerHTML += `
        <a href=${post.link}>
            <div class="blog-post">
                <h1 class="blog-post-title">${post.title}</h1>
                <div class="blog-post-body">
                    <p class="blog-post-p">${post.description}</p>
                </div>
            </div>
        </a> 
        `;
    }
});

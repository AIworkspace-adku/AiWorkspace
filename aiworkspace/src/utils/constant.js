const logos = [
    new URL("./LogoBanner/logo1.png", import.meta.url).href,
    new URL("./LogoBanner/logo2.png", import.meta.url).href,
    new URL("./LogoBanner/logo3.png", import.meta.url).href,
    new URL("./LogoBanner/logo4.png", import.meta.url).href,
    new URL("./LogoBanner/logo1.png", import.meta.url).href,
    new URL("./LogoBanner/logo2.png", import.meta.url).href,
    new URL("./LogoBanner/logo3.png", import.meta.url).href,
    new URL("./LogoBanner/logo4.png", import.meta.url).href,
    new URL("./LogoBanner/logo1.png", import.meta.url).href,
    new URL("./LogoBanner/logo2.png", import.meta.url).href,
    new URL("./LogoBanner/logo3.png", import.meta.url).href,
    new URL("./LogoBanner/logo4.png", import.meta.url).href,
    new URL("./LogoBanner/logo1.png", import.meta.url).href,
    new URL("./LogoBanner/logo2.png", import.meta.url).href,
    new URL("./LogoBanner/logo3.png", import.meta.url).href,
    new URL("./LogoBanner/logo4.png", import.meta.url).href,
];

const features=[
    {
        gridArea:"tl",
        image: new URL("./features/thumbs-up.png",import.meta.url).href,
        heading: "Seamless Team and Project Management",
        description:" Let there be a group of 4 or 10, manage your team with our platform seamlessly, tracking each member of your team."
    },
    {
        gridArea:"tr",
        image: new URL("./features/globe.png",import.meta.url).href,
        heading: "Real-Time Dashboard",
        description:" Keep a track of progress on individual and project basis through the user friendly dashbard."
    },
    {
        gridArea:"bl",
        image: new URL("./features/flag.png",import.meta.url).href,
        heading: "One place destination",
        description:" Let it be Online video conferencing, or let it be group chatting, or say it collaborative Document preparation, get everything at one place."
    },
    {
        gridArea:"blm",
        image: new URL("./features/graphic-circle.png",import.meta.url).href,
        heading: "Real-TIme Collaboration",
        description:" While working on documentation experience the real time collaboration feature of our platform."
    },
    {
        gridArea:"brm",
        image: new URL("./features/branch.png",import.meta.url).href,
        heading: "Research Paper in one Click",
        description:"You dont have to browse through the nternet to find research paper for your projects, we got your back with help of our research GPT."
    },
    {
        gridArea:"br",
        image: new URL("./features/hash.png",import.meta.url).href,
        heading: "GenAI powered Documentation",
        description:"While writing documentation, let the GenAI model do your work just in one click, and also check your grammatical error."
    }
]

export { logos, features};
import logo1 from './LogoBanner/logo1.png';
import logo2 from './LogoBanner/logo2.png';
import logo3 from './LogoBanner/logo3.png';
import logo4 from './LogoBanner/logo4.png';
import thumbsUp from './features/thumbs-up.png';
import globe from './features/globe.png';
import flag from './features/flag.png';
import graphicCircle from './features/graphic-circle.png';
import branch from './features/branch.png';
import hash from './features/hash.png';

const logos = [
    logo1, logo2, logo3, logo4,
    logo1, logo2, logo3, logo4,
    logo1, logo2, logo3, logo4,
    logo1, logo2, logo3, logo4
];

const features = [
    {
        gridArea: "tl",
        image: thumbsUp,
        heading: "Seamless Team and Project Management",
        description: " Let there be a group of 4 or 10, manage your team with our platform seamlessly, tracking each member of your team."
    },
    {
        gridArea: "tr",
        image: globe,
        heading: "Real-Time Dashboard",
        description: " Keep a track of progress on individual and project basis through the user friendly dashbard."
    },
    {
        gridArea: "bl",
        image: flag,
        heading: "One place destination",
        description: " Let it be Online video conferencing, or let it be group chatting, or say it collaborative Document preparation, get everything at one place."
    },
    {
        gridArea: "blm",
        image: graphicCircle,
        heading: "Real-TIme Collaboration",
        description: " While working on documentation experience the real time collaboration feature of our platform."
    },
    {
        gridArea: "brm",
        image: branch,
        heading: "Research Paper in one Click",
        description: "You dont have to browse through the nternet to find research paper for your projects, we got your back with help of our research GPT."
    },
    {
        gridArea: "br",
        image: hash,
        heading: "GenAI powered Documentation",
        description: "While writing documentation, let the GenAI model do your work just in one click, and also check your grammatical error."
    }
];

export { logos, features };
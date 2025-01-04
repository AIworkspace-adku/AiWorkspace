import React from "react";
import { motion } from "framer-motion";
import "./Card.css";

const Card = ({ title, description, onClick }) => (
  <motion.div
    className="card"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
  >
    <h3>{title}</h3>
    <p>{description}</p>
  </motion.div>
);

const Cards = () => {
  const data = [
    { title: "Project 1", description: "Explore the AI-driven solutions." },
    { title: "Project 2", description: "Enhance your workflow efficiency." },
    // Add more cards as needed
  ];

  return (
    <section className="cards">
      {data.map((item, index) => (
        <Card key={index} {...item} />
      ))}
    </section>
  );
};

export default Cards;

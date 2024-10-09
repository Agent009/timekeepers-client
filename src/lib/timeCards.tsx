import React from "react";
import { TimeCard } from "@customTypes/index.ts";

export const cards: TimeCard[] = [
  {
    title: "10",
    description: "Minute",
    date: new Date(),
    content: () => {
      return <p>Next minute.</p>;
    },
  },
  {
    title: "11",
    description: "Minute",
    date: new Date(),
    content: () => {
      return <p>Next minute.</p>;
    },
  },
  {
    title: "12",
    description: "Minute",
    date: new Date(),
    content: () => {
      return <p>Next minute.</p>;
    },
  },
  {
    title: "13",
    description: "Minute",
    date: new Date(),
    content: () => {
      return <p>Next minute.</p>;
    },
  },
];

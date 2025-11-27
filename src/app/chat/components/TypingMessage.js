"use client";
import { useState, useEffect } from "react";

// ---- CLEAN MARKDOWN (remove **, *, __) ----
function cleanText(text) {
  return text
    .replace(/\*\*/g, "")   // remove **
    .replace(/\*/g, "")     // remove *
    .replace(/__/g, "");    // remove __
}

// ---- TYPING COMPONENT WITH BULLET SUPPORT ----
export default function TypingMessage({ text }) {
  const clean = cleanText(text);
  const [displayed, setDisplayed] = useState("");

  // typing animation
  useEffect(() => {
    let i = 0;
    setDisplayed("");

    const interval = setInterval(() => {
      i++;
      setDisplayed(clean.slice(0, i));
      if (i >= clean.length) clearInterval(interval);
    }, 15);

    return () => clearInterval(interval);
  }, [clean]);

  // format bullets correctly
  const renderFormatted = () => {
    const lines = displayed.split("\n");

    const elements = [];
    let currentList = [];

    const pushList = (key) => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={key} style={{ paddingLeft: "20px", marginTop: 4 }}>
            {currentList.map((item, idx) => (
              <li key={key + "_li_" + idx} style={{ marginBottom: 4 }}>
                {item}
              </li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      const isBullet =
        trimmed.startsWith("- ") ||
        trimmed.startsWith("* ") ||
        /^[0-9]+\.\s/.test(trimmed);

      if (isBullet) {
        const content = trimmed
          .replace(/^[-*]\s/, "")
          .replace(/^[0-9]+\.\s/, "");

        currentList.push(content);
      } else {
        // Whenever paragraph starts, push existing <ul>
        pushList("ul_" + idx);

        if (trimmed.length > 0) {
          elements.push(
            <p key={idx} style={{ margin: "4px 0" }}>
              {trimmed}
            </p>
          );
        }
      }
    });

    // push final list if exists
    pushList("ul_final");

    return elements;
  };

  return <div style={{ whiteSpace: "pre-wrap" }}>{renderFormatted()}</div>;
}

"use client";
import { useState, useEffect, useRef } from "react";

// Clean markdown
function cleanText(text) {
  return text
    .replace(/\*\*/g, "")          // bold **
    .replace(/\*/g, "")            // italic *
    .replace(/__/g, "")            // underline __
    .replace(/^#{1,6}\s+/gm, "");  // headers
}

export default function TypingMessage({ text, onDone }) {
  const clean = cleanText(text);

  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);
  const prevTextRef = useRef("");

  useEffect(() => {
    // Append chunk without resetting animation
    if (clean.length > prevTextRef.current.length) {
      prevTextRef.current = clean;
    }

   const interval = setInterval(() => {
      setDisplayed((prev) => {
        if (prev.length < clean.length) {
          indexRef.current++;
          return clean.slice(0, indexRef.current);
        } else {
          clearInterval(interval);

          // ✅ IMPORTANT FIX:
          // Prevent React error: “Cannot update parent while rendering child”
          setTimeout(() => {
            onDone?.();
          }, 0);

          return prev;
        }
      });
    }, 12);

    return () => clearInterval(interval);
  }, [clean]);

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

    pushList("ul_final");
    return elements;
  };

  return <div style={{ whiteSpace: "pre-wrap" }}>{renderFormatted()}</div>;
}

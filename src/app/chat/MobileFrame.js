export default function MobileFrame({ children }) {
  return (
    <div style={styles.outer}>
      <div style={styles.phone}>
        {/* NOTCH */}
        <div style={styles.notch} />

        {/* SCREEN */}
        <div style={styles.screen}>
          {children}
        </div>
      </div>
    </div>
  );
}

const styles = {
  outer: {
    width: "100%",
    height: "100vh",
    display: "flex",
    justifyContent: "right",
    alignItems: "center",
    backgroundImage: "url('/Images/bg-img.jpeg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
},

phone: {
    width: 390,                // iPhone 14 width
    height: 780,               // iPhone 14 height
    borderRadius: 42,
    background: "#000",
    border: "1px solid #ffffff65",
    padding: 10,
    boxShadow:
    "0 30px 80px rgba(0,0,0,.6), inset 0 0 0 2px #1a1a1a",
    position: "relative",
    marginRight: '100px'
  },

  notch: {
    width: 120,
    height: 26,
    background: "#000",
    borderRadius: "0 0 18px 18px",
    position: "absolute",
    top: 10,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 10
  },

  screen: {
    width: "100%",
    height: "100%",
    borderRadius: 32,
    overflow: "hidden",
    background:
      "linear-gradient(180deg,#111,#0f1a2f)"
  }
};

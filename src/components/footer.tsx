import { BsSoundwave } from "react-icons/bs";
import "./styles.css";

export function Footer() {
  return (
    <footer
      className="flex items-center justify-between py-6 text-center pl-5 pr-5"
      style={{ backgroundColor: "#0e1111" }}
    >
      <div
        className="home-text logo-text pr-10"
        style={{ color: "#ebf6f9", fontSize: "2rem" }}
      >
        Fl
        <BsSoundwave
          style={{
            fontSize: "2rem",
            color: "#ebf6f9",
            verticalAlign: "middle",
            display: "inline-block",
          }}
        />
        ws
      </div>
      <div className="flex gap-x-8 home-text">
        <a href="#" className="hover:underline" style={{ color: "#ebf6f9" }}>
          About Us
        </a>
        <a href="#" className="hover:underline" style={{ color: "#ebf6f9" }}>
          License
        </a>
        <a href="#" className="hover:underline" style={{ color: "#ebf6f9" }}>
          Contact Us
        </a>
      </div>
    </footer>
  );
}

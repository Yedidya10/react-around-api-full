import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer__copyright">
        © {new Date().getFullYear()} Yedidya Averjel
      </p>
    </footer>
  );
}

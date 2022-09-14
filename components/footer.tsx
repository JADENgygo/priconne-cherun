export const Footer = (props: { className?: string }) => {
  return (
    <div
      className={`bg-secondary bg-opacity-10 text-center pt-3 pb-3 ${props.className}`}
    >
      <div className="container">
        <a href="https://twitter.com/JADENgygo" className={`link-dark link`}>
          <i className="bi bi-twitter"></i>
        </a>
        <a
          href="https://priconne-portfolio.vercel.app"
          className={`ms-3 link-dark link`}
        >
          闇プリン開発室
        </a>
        <div>画像 &copy; Cygames, Inc.</div>
      </div>
    </div>
  );
};

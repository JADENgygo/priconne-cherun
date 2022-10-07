import { useEffect, useState } from "react";

export const Header = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    setTheme(theme === "dark" ? "dark" : "light");
  }, []);

  const changeTheme = () => {
    document.querySelector('html')?.classList.toggle('dark');
    const theme = localStorage.getItem('theme');
    localStorage.setItem("theme", theme === "dark" ? "light" : "dark");
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="container pt-1">
      <div className="text-end mb-3"><span className="link" onClick={changeTheme}>ダークモード: { theme === "light" ? "オフ" : "オン" }</span></div>
      <div className="fs-3 text-center">
        プリコネちぇるーん
      </div>
    </div>
  );
};

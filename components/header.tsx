import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { parseCookies, setCookie } from "nookies";

export const Header = () => {
  const router = useRouter();
  const [theme, setTheme] = useState<"" | "light" | "dark">("");

  useEffect(() => {
    const cookie = parseCookies();
    setTheme(cookie.theme === "dark" ? "dark" : "light");
  }, []);

  const changeTheme = () => {
    const cookie = parseCookies();
    setCookie(null, "theme", cookie.theme === "dark" ? "light" : "dark", {
      maxAge: 60 * 60 * 24 * 30 * 12 * 1,
      path: "/"
    });
    router.reload();
  };

  return (
    <div className="container pt-1">
      <div className={`text-end mb-3 ${theme ===  "" ? "invisible" : "visible"}`}>
        <span className="link" onClick={changeTheme}>ダークモード: { theme === "light" ? "オフ" : "オン" }</span>
      </div>
      <div className="fs-3 text-center">
        プリコネちぇるーん
      </div>
    </div>
  );
};

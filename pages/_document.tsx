import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="ちぇる語の翻訳機" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@JADENgygo" />
        <meta property="og:url" content="https://priconne-cherun.vercel.app" />
        <meta property="og:title" content="プリコネちぇるーん" />
        <meta property="og:description" content="ちぇる語の翻訳機" />
        <meta
          property="og:image"
          content="https://priconne-cherun.vercel.app/img/peko.png"
        />
        <link rel="icon" href="/img/peko.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="ちぇる語の翻訳ツール" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@JADENgygo" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="プリコネちぇるーん" />
        <meta property="og:description" content="ちぇる語の翻訳ツール" />
        <meta property="og:url" content="https://priconne-cherun.vercel.app" />
        <meta
          property="og:image"
          content="https://priconne-cherun.vercel.app/img/card.webp"
        />
        <link rel="icon" href="/img/peko.png" />
      </Head>
      <body>
        <script src="/script.js" async />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

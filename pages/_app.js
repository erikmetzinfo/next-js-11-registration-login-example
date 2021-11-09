import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import "styles/globals.css";

import { userService } from "services";
import { Nav, Alert } from "components";

export default App;

const content = {
  head_text:
    "Next.js 11 - User Registration and Login Example for - Camera Campture",
  //"Next.js 11 - User Registration and Login Example for - Camera Campture",
  link_text: "Home",
  //"Next.js 11 - User Registration and Login Tutorial with Example App",
  link_url: "https://spray-r.com",
  //"https://jasonwatmore.com/post/2021/08/19/next-js-11-user-registration-and-login-tutorial-with-example-app",
  home_text: "Erik Metz", //"JasonWatmore.com",
  home_url: "https://www.linkedin.com/in/erik-metz/", //"https://jasonwatmore.com",
};

function App({ Component, pageProps }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // on initial load - run auth check
    authCheck(router.asPath);

    // on route change start - hide page content by setting authorized to false
    const hideContent = () => setAuthorized(false);
    router.events.on("routeChangeStart", hideContent);

    // on route change complete - run auth check
    router.events.on("routeChangeComplete", authCheck);

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off("routeChangeStart", hideContent);
      router.events.off("routeChangeComplete", authCheck);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function authCheck(url) {
    // redirect to login page if accessing a private page and not logged in
    setUser(userService.userValue);
    const publicPaths = ["/account/login", "/account/register"];
    const path = url.split("?")[0];
    if (!userService.userValue && !publicPaths.includes(path)) {
      setAuthorized(false);
      router.push({
        pathname: "/account/login",
        query: { returnUrl: router.asPath },
      });
    } else {
      setAuthorized(true);
    }
  }

  return (
    <>
      <Head>
        <title>{content.head_text}</title>

        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link
          href="//netdna.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
          rel="stylesheet"
        />
      </Head>

      <div className={`app-container ${user ? "bg-light" : ""}`}>
        <Nav />
        <Alert />
        {authorized && <Component {...pageProps} />}
      </div>

      {/* credits */}
      <div className="text-center mt-4">
        <p>
          <a href={content.link_url} target="_top">
            {content.link_text}
          </a>
        </p>
        <p>
          <a href={content.home_url} target="_top">
            {content.home_text}
          </a>
        </p>
      </div>
    </>
  );
}

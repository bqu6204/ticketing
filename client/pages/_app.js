import "bootstrap/dist/css/bootstrap.css";
import { buildClient } from "../api/build-client";

import Header from "../components/header";

// for Page Component, getInitialProps(context), context === { req, res }
// for App Component, context === { Component, cts: { req, res }}

// When we tie getInitialProps to the _app component,
// the getInitialProps on other page will not work.

export default function MyApp({ Component, pageProps, currentUser }) {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get("/api/users/currentuser");

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }

  return {
    pageProps,
    currentUser: data.currentUser,
  };
};

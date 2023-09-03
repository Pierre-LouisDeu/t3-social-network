import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import { SideNav } from "~/components/common/layouts/SideNav";
import { Toast } from "~/components/common/toasts/toast";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Toast />
        <Head>
          <title>T3 Social Network</title>
          <meta
            name="description"
            content="This is a Social Network App build with T3 stack"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="container mx-auto flex items-start">
          <SideNav />
          <div className="min-h-screen flex-grow border-x sm:mr-48">
            <Component {...pageProps} />
          </div>
        </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

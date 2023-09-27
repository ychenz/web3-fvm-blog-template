import React from "react";
import ReactDOM from "react-dom/client";
import { MoralisProvider } from "react-moralis";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ConfigProvider } from "antd";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 10000 } },
});

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <MoralisProvider initializeOnMount={false}>
                <ConfigProvider
                    theme={{
                        token: {
                            colorPrimary: "#00b96b",
                            colorBgContainer: "#ffffff",
                        },
                    }}
                >
                    <App />
                </ConfigProvider>
            </MoralisProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

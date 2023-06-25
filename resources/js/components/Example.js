import React from "react";
import ReactDOM from "react-dom";
import store from "./redux/store";
import { Provider } from "react-redux";
import CampaignComponent from "./Campaign/CampaignComponent";

function Example() {
    return (
        <Provider store={store}>
            <div className="container">
                <CampaignComponent />
            </div>
        </Provider>
    );
}

export default Example;

if (document.getElementById("example")) {
    ReactDOM.render(<Example />, document.getElementById("example"));
}

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import CampaignComponent from "./CampaignComponent";

jest.mock("../../../css/campaign.css", () => ({}));
jest.mock("../../../css/paginate.css", () => ({}));
jest.mock("react-datepicker/dist/react-datepicker.css", () => ({}));

const mockStore = configureStore([thunk]);

describe("CampaignComponent", () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            data: {
                items: [],
                loading: false,
                error: null,
            },
        });
    });

    it("allows searching campaigns by name", () => {
        render(
            <Provider store={store}>
                <CampaignComponent />
            </Provider>
        );

        const searchInput = screen.getByPlaceholderText("Search by name");
        fireEvent.change(searchInput, { target: { value: "Campaign 1" } });

        const searchButton = screen.getByText("Search");
        fireEvent.click(searchButton);
    });

    it("allows filtering campaigns by start and end dates", () => {
        render(
            <Provider store={store}>
                <CampaignComponent />
            </Provider>
        );

        const startDatePicker = screen.getByPlaceholderText("Start-Date");
        const endDatePicker = screen.getByPlaceholderText("End-Date");
        fireEvent.change(startDatePicker, { target: { value: "2023-06-01" } });
        fireEvent.change(endDatePicker, { target: { value: "2023-06-30" } });
        const searchButton = screen.getByText("Search");
        fireEvent.click(searchButton);
    });
});

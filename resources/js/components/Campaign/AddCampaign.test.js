import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import AddCampaignComponent from "./AddCampaign";
import thunk from 'redux-thunk';
import '@testing-library/jest-dom/extend-expect';

jest.mock("react-datepicker/dist/react-datepicker.css", () => ({}));

const mockStore = configureStore([thunk]);

describe("AddCampaignComponent", () => {
    let store;
    let component;

    beforeEach(() => {
        store = mockStore({
            data: {
                postItem: [],
                postLoading: false,
                postError: null,
            },
        });
        component = (
            <Provider store={store}>
                <AddCampaignComponent />
            </Provider>
        );
    });

    it("renders input fields correctly", () => {
        const { getByPlaceholderText } = render(component);

        expect(getByPlaceholderText("Enter Campaign Name")).toBeInTheDocument();
        expect(getByPlaceholderText("Enter Budget")).toBeInTheDocument();
        expect(getByPlaceholderText("Enter Start Date")).toBeInTheDocument();
        expect(getByPlaceholderText("Enter End Date")).toBeInTheDocument();
    });

    it("updates campaign name input value correctly", () => {
        const { getByPlaceholderText } = render(component);
        const campaignNameInput = getByPlaceholderText("Enter Campaign Name");

        fireEvent.change(campaignNameInput, {
            target: { value: "Test Campaign" },
        });

        expect(campaignNameInput.value).toBe("Test Campaign");
    });

    it("updates budget input value correctly", () => {
        const { getByPlaceholderText } = render(component);
        const budgetInput = getByPlaceholderText("Enter Budget");

        fireEvent.change(budgetInput, { target: { value: "1000" } });

        expect(budgetInput.value).toBe("1000");
    });

    it("validates campaign name correctly", () => {
        const { getByPlaceholderText, getByText } = render(component);
        const campaignNameInput = getByPlaceholderText("Enter Campaign Name");

        fireEvent.change(campaignNameInput, {
            target: { value: "Invalid@Name" },
        });

        expect(
            getByText("Campaign name can only contain letters and numbers")
        ).toBeInTheDocument();
    });

    it("validates required fields before submission", () => {
        const { getByText } = render(component);
        const submitButton = getByText("Submit");

        fireEvent.click(submitButton);

        expect(getByText("All fields are required")).toBeInTheDocument();
    });

    it("submits campaign details correctly", () => {
        const { getByPlaceholderText, getByText } = render(component);
        const campaignNameInput = getByPlaceholderText("Enter Campaign Name");
        const budgetInput = getByPlaceholderText("Enter Budget");
        const startDateInput = getByPlaceholderText("Enter Start Date");
        const endDateInput = getByPlaceholderText("Enter End Date");
        const submitButton = getByText("Submit");

        fireEvent.change(campaignNameInput, {
            target: { value: "Test Campaign" },
        });
        fireEvent.change(budgetInput, { target: { value: "1000" } });
        fireEvent.change(startDateInput, { target: { value: "2023-06-25" } });
        fireEvent.change(endDateInput, { target: { value: "2023-06-30" } });
        fireEvent.click(submitButton);
    });
});

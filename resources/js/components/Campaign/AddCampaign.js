import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { postData, fetchData } from "../redux/dataSlice";
import { useSelector, useDispatch } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import { handleKeyDown, formatDate } from "../../utils";

const AddCampaignComponent = () => {
    const [campaignName, setCampaignName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isCampaignSucess, setIsCampaignSucess] = useState(false);
    const [errorPost, setErrorPost] = useState("");
    const [budget, setBudget] = useState("");
    const [minEndDate, setMinEndDate] = useState(
        new Date().setHours(0, 0, 0, 0)
    );
    const dispatch = useDispatch();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { postItem, postLoading, postError } = useSelector(
        (state) => state.data
    );

    const resetForm = () => {
        setCampaignName("");
        setStartDate("");
        setEndDate("");
        setBudget("");
    };

    const handleCampaignInput = (value) => {
        const regex = /^[a-zA-Z0-9\s]+$/;
        setCampaignName(value);
        if (regex.test(value)) {
            setErrorPost("");
        } else {
            setErrorPost("Campaign name can only contain letters and numbers");

            return false;
        }
        return true;
    };

    const handleDate = (date, type) => {
        if (type === "startDate") {
            setStartDate(date);
        } else {
            setEndDate(date);
        }
    };

    const checkRequiredValidation = () => {
        if (
            campaignName.trim() !== "" &&
            startDate !== "" &&
            endDate !== "" &&
            budget.trim() !== ""
        ) {
            setErrorPost("");
            return true;
        } else {
            setErrorPost("All fields are required");
            return false;
        }
    };

    const handleCampaignSubmit = () => {
        if (checkRequiredValidation()) {
            if (handleCampaignInput(campaignName)) {
                const startDateVal = formatDate(startDate, false);
                const endDateVal = formatDate(endDate, false);

                const postDataValues = {
                    name: campaignName,
                    startDate: startDateVal,
                    endDate: endDateVal,
                    budget,
                };

                dispatch(postData(postDataValues));
                resetForm();
                return true;
            }
        } else {
            return false;
        }
    };

    useEffect(() => {
        if (!postError && !postLoading && postItem?.length) {
            setIsCampaignSucess(true);
            setTimeout(()=> {
                setIsCampaignSucess(false);
                const apiUrl = "api/campaigndata";
                dispatch(fetchData(apiUrl));
            },2000)
           
        }
    }, [postItem, postLoading, postError]);

    useEffect(() => {
        if (startDate) {
            setMinEndDate(startDate);
            setEndDate(startDate);
        }
    }, [startDate]);

    return (
        <div>
            <div>
                <input
                    type="text"
                    value={campaignName}
                    onChange={(event) =>
                        handleCampaignInput(event.target.value)
                    }
                    className="inputName"
                    placeholder="Enter Campaign Name"
                />
                <input
                    type="number"
                    value={budget}
                    onChange={(event) => setBudget(event.target.value)}
                    className="inputName"
                    placeholder="Enter Budget"
                />
            </div>
            <div className="date-picker-container">
                <DatePicker
                    selected={startDate}
                    onChange={(date) => handleDate(date, "startDate")}
                    className="inputStartDate date-picker"
                    placeholderText="Enter Start Date"
                    dateFormat="dd/MM/yyyy"
                    minDate={today}
                    onKeyDown={handleKeyDown}
                />
                <DatePicker
                    selected={endDate}
                    onChange={(date) => handleDate(date, "endDate")}
                    className="inputEndDate date-picker"
                    placeholderText="Enter End Date"
                    dateFormat="dd/MM/yyyy"
                    minDate={minEndDate}
                    onKeyDown={handleKeyDown}
                />
                <button className="btnAction" onClick={handleCampaignSubmit}>
                    Submit
                </button>
            </div>
            {errorPost && <div className="postErrorContainer msgContainer">{errorPost}</div>}
            {isCampaignSucess && <div className="postCampaignSuccess msgContainer">Campaign details submitted successfully</div>}
        </div>
    );
};

export default AddCampaignComponent;

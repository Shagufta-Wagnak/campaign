import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchData } from "../redux/dataSlice";
import DatePicker from "react-datepicker";
import AddCampaignComponent from "./AddCampaign";
import CampaignList from "./CampaignList";
import "../../../css/campaign.css";
import "react-datepicker/dist/react-datepicker.css";
import "../../../css/paginate.css";
import ReactPaginate from "react-paginate";
import {
    handleKeyDown,
    isDateBetween,
    formatDate,
    formatCurrency,
} from "../../utils";

const CampaignComponent = () => {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [dateError, setDateError] = useState();
    const [isShowCampaign, setIsShowCampaign] = useState(false);
    const [nameSearchVal, setNameSearchVal] = useState("");
    const [startDateSearchVal, setStartDateSearchVal] = useState("");
    const [endDateSearchVal, setEndDateSearchVal] = useState("");
    const [minEndDate, setMinEndDate] = useState("");
    const [activePage, setActivePage] = useState("");
    const { items, loading, error } = useSelector((state) => state.data);
    const [itemOffset, setItemOffset] = useState(0);
    const [paginationKey, setPaginationKey] = useState(Date.now());
    const itemsPerPage = 10;
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = data?.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(data.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % data.length;
        setItemOffset(newOffset);
    };

    const refreshData = (items) => {
        setData(
            items.map((item) => {
                const startDate = new Date(item.startDate);
                const endDate = new Date(item.endDate);
                const formattedStartDate = formatDate(startDate);
                const formattedEndDate = formatDate(endDate);
                const isActive = isDateBetween(startDate, endDate);
                const currency = formatCurrency(item.Budget);
                return {
                    ...item,
                    isActive,
                    startDate: formattedStartDate,
                    endDate: formattedEndDate,
                    Budget: currency,
                };
            })
        );
    };

    function handleDateInput(date, type) {
        if (type === "startDate") {
            setStartDateSearchVal(date);
        } else {
            setEndDateSearchVal(date);
        }
    }

    const handleNameSearch = () => {
        // setActivePage("");
        if (nameSearchVal.trim() !== "") {
            setDateError("");

            const filterDataValue = items.filter((item) => {
                return item.name
                    .toLowerCase()
                    .includes(nameSearchVal.toLowerCase());
            });
            // console.log('filterDataValue',items, filterDataValue)
            refreshData(filterDataValue);
            const validationDate = validateDates();
            if (startDateSearchVal && endDateSearchVal && validationDate) {
                const filteredDate = filterData(filterDataValue);
            }
            setItemOffset(0);
            setActivePage(0);
            setPaginationKey(Date.now());
        } else {
            setDateError("Please enter name to search");
        }
    };

    const validateDates = () => {
        if (
            new Date(startDateSearchVal).getTime() >
            new Date(endDateSearchVal).getTime()
        ) {
            setDateError("Start date cannot be after end date.");
            refreshData([]);
            return false;
        }

        setDateError("");
        return true;
    };

    const filterData = (dataValues) => {
        const filtered = dataValues.filter((item) => {
            const itemStartDate = new Date(item.startDate);
            const itemEndDate = new Date(item.endDate);
            return (
                itemStartDate.getTime() <=
                    new Date(startDateSearchVal.getTime()) &&
                itemEndDate.getTime() >= new Date(endDateSearchVal.getTime())
            );
        });

        refreshData(filtered);
        return filtered;
    };

    const handleDateFilter = (e) => {
        // setActivePage("");
        const validationDate = validateDates();

        if (!startDateSearchVal || !endDateSearchVal) {
            setDateError("Start Date or End Date cannot be empty");
            return false;
        }
        if (startDateSearchVal && endDateSearchVal && validationDate) {
            setDateError("");
            const filteredDate = filterData(items);
            if (nameSearchVal !== "") {
                const filterDataValue = filteredDate.filter((item) => {
                    return item.name
                        .toLowerCase()
                        .includes(nameSearchVal.toLowerCase());
                });
                refreshData(filterDataValue);
            }
            setItemOffset(0);
            setActivePage(0);
            setPaginationKey(Date.now());
        }
        return true;
    };

    const handleResetFilters = () => {
        setNameSearchVal("");
        setStartDateSearchVal("");
        setEndDateSearchVal("");
        setDateError("");
        refreshData(items);
    };

    useEffect(() => {
        const apiUrl = "api/campaigndata";

        dispatch(fetchData(apiUrl));
    }, [dispatch]);

    useEffect(() => {
        if (items) {
            refreshData(items);
        }
    }, [items]);

    useEffect(() => {
        if (startDateSearchVal) {
            setMinEndDate(startDateSearchVal);
        }
    }, [startDateSearchVal]);

    return (
        <div>
            <div>
                <div className="date-picker-container">
                    <DatePicker
                        selected={startDateSearchVal}
                        className="inputStartDate date-picker"
                        placeholderText="Start-Date"
                        dateFormat="dd/MM/yyyy"
                        onChange={(date) => handleDateInput(date, "startDate")}
                        onKeyDown={handleKeyDown}
                    />
                    <DatePicker
                        selected={endDateSearchVal}
                        className="inputEndDate date-picker"
                        placeholderText="End-Date"
                        dateFormat="dd/MM/yyyy"
                        onChange={(date) => handleDateInput(date, "endDate")}
                        onKeyDown={handleKeyDown}
                        minDate={minEndDate}
                    />
                    <button className="searchDate" onClick={handleDateFilter}>
                        Search
                    </button>
                </div>

                <input
                    type="text"
                    value={nameSearchVal}
                    onChange={(event) => setNameSearchVal(event.target.value)}
                    className="inputName"
                    placeholder="Search by name"
                />
                <button className="searchName" onClick={handleNameSearch}>
                    Search Name
                </button>
                <button className="btnAction" onClick={handleResetFilters}>
                    Reset Filters
                </button>
                <button
                    className="btnAction"
                    onClick={() => setIsShowCampaign(!isShowCampaign)}
                >
                    Add Campaign
                </button>
            </div>
            <div
                className={`${
                    !isShowCampaign
                        ? "hideCampaignContainer"
                        : "showCampaignContainer"
                }`}
            >
                <AddCampaignComponent />
            </div>
            {loading ? (
                <div className="loadContainer msgContainer">Loading...</div>
            ) : (
                <>
                    {error || dateError ? (
                        <div className="errorContainer msgContainer">
                            Error: {error || dateError}
                        </div>
                    ) : (
                        <></>
                    )}

                    <CampaignList campaignData={currentItems} />

                    <ReactPaginate
                        breakLabel="..."
                        nextLabel=">"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        className="pagination"
                        pageCount={pageCount}
                        forcePage={activePage}
                        previousLabel="<"
                        renderOnZeroPageCount={null}
                        key={paginationKey}
                    />
                </>
            )}
        </div>
    );
};

export default CampaignComponent;

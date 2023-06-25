import React from "react";
import "../../../css/campaign.css";
import "react-datepicker/dist/react-datepicker.css";

const CampaignList = ({ campaignData }) => {
    
    const activeCircle = () => {
        return (
            <div>
                <span className="greenCircle"></span> Active
            </div>
        );
    };
    const inactiveCircle = () => {
        return (
            <div>
                <span className="redCircle"></span> Inactive
            </div>
        );
    };

    return campaignData.length ? (
        <table className="campaignTable">
            <thead className="tableHeader">
                <tr>
                    <th>Name</th>
                    <th>User Name</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Active</th>
                    <th>Budget</th>
                </tr>
            </thead>
            <tbody>
                {campaignData.map((item) => (
                    <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.username}</td>
                        <td>{item.startDate}</td>
                        <td>{item.endDate}</td>
                        <td>
                            {item.isActive ? activeCircle() : inactiveCircle()}
                        </td>
                        <td>{item.Budget}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    ) : (
        <div className="msgContainer loadContainer">No data found</div>
    );
};

export default CampaignList;

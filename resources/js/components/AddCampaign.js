import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { postData, fetchData } from './redux/store';
import { useSelector, useDispatch } from 'react-redux';
import 'react-datepicker/dist/react-datepicker.css';

const AddCampaignComponent = () => {
    const [campaignName, setCampaignName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [errorPost, setErrorPost] = useState('error');
    const [budget, setBudget] = useState('');
    const dispatch = useDispatch();
    const { postItem, postLoading, postError } = useSelector((state) => state.data);

    const resetForm = () => {
        setCampaignName('');
        setStartDate('');
        setEndDate('');
        setBudget('');
    }

    useEffect(()=> {
        if(!postError && !postLoading){
            const apiUrl = 'http://localhost/campaign/public/api/campaigndata';
            dispatch(fetchData(apiUrl));
        }
    }, [postItem, postLoading, postError ])
 

    function handleDate(date, type) {
        const numericValue = /^\d+$/.test(date.getTime()) ? date : ''; 
        date = numericValue;
        if(type === 'startDate'){
            setStartDate(date);
        } else {
            setEndDate(date)
        }
        
    }

    const  formatDate = (date) => {
        const month = date.getMonth()+1;
        const day = date.getDate();
        const year = date.getFullYear();
        
        return `${month}/${day}/${year}`;
    }

    const handleCampaignSubmit = () => {
        
        const startDateVal = formatDate(startDate);
        const endDateVal = formatDate(endDate);
        
        const postDataValues = {
            name: campaignName,
            startDate: startDateVal,
            endDate: endDateVal,
            budget,
        }   
       
        dispatch(postData(postDataValues));
        resetForm();
    }


 
    return (
        <div>
            <div>
                <input type="text" value={campaignName} onChange={(event)=>setCampaignName(event.target.value)} className='inputName' placeholder='Enter Campaign Name' />
                <input type="text" value={budget} onChange={(event)=>setBudget(event.target.value)}  className='inputName' placeholder='Enter Budget' />
            </div>
            <div className='date-picker-container'>
                <DatePicker selected={startDate} onChange={(date) => handleDate(date, 'startDate')}  className='inputStartDate date-picker' placeholderText='Enter Start Date'  />
                <DatePicker selected={endDate} onChange={(date) => handleDate(date, 'endDate')} className='inputStartDate date-picker' placeholderText='Enter End Date'  />
                <button className='btnAction' onClick={handleCampaignSubmit}>Submit</button>
            </div>
            {/* <div className='postErrorContainer'>{errorPost}</div> */}
        </div>
    );
};

export default AddCampaignComponent;
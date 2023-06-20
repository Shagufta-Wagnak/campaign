import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchData } from './redux/store';
import DatePicker from 'react-datepicker';
import AddCampaignComponent from './AddCampaign';
import CampaignList  from './CampaignList';
import '../../css/campaign.css';
import 'react-datepicker/dist/react-datepicker.css';


const CampaignComponent = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [dateError, setDateError] = useState();
  const [isShowCampaign, setIsShowCampaign] = useState(false);
  const [nameSearchVal, setNameSearchVal] = useState('');
  const [startDateSearchVal, setStartDateSearchVal] = useState('');
  const [endDateSearchVal, setEndDateSearchVal] = useState('');
  const { items, loading, error } = useSelector((state) => state.data);
 

  const isDateBetween = (startDate, endDate) => {
    const currentDate = new Date();
    return currentDate >= startDate && currentDate <= endDate;
  }

  const refreshData = (items) => {
    // console.log('items', items)
    setData(items.map((item)=> {
      const startDate = new Date(item.startDate);
      const endDate = new Date(item.endDate);
      const isActive = isDateBetween(startDate,endDate);
      return {...item, isActive};
    }));
  }

  function handleDateInput(date, type) {
    const numericValue = /^\d+$/.test(date.getTime()) ? date : ''; 
    date = numericValue;
    if(type === 'startDate'){
      setStartDateSearchVal(date);
    } else {
      setEndDateSearchVal(date)
    }
    
  }
  

  const handleNameSearch = ()=> {
    if(nameSearchVal !== ""){
     const filterDataValue = items.filter((item)=> {
         return (item.name.toLowerCase()).includes(nameSearchVal.toLowerCase());
      });
      refreshData(filterDataValue);
      const validationDate = validateDates();
      if(startDateSearchVal && endDateSearchVal && validationDate){
        const filteredDate = filterData(filterDataValue);   
      }
      
    } else {
      refreshData(items);
    }
  }

  const validateDates = () => {

    if (new Date(startDateSearchVal) > new Date(endDateSearchVal)) {
      setDateError('Start date cannot be after end date.');
      return false;
    }

    setDateError('');
    return true;
  };

  const filterData = (dataValues) => {
    const filtered = dataValues.filter((item) => {
      const itemStartDate = new Date(item.startDate);
      const itemEndDate = new Date(item.endDate);
      return itemStartDate <= new Date(startDateSearchVal) && itemEndDate >= new Date(endDateSearchVal);
    });

    refreshData(filtered);
    return filtered;
   
  };

  const handleDateFilter = (e) => {
   
      const validationDate = validateDates();
      if(startDateSearchVal && endDateSearchVal && validationDate){
        const filteredDate = filterData(data);
        if(nameSearchVal !== ""){
          const filterDataValue = filteredDate.filter((item)=> {
              return (item.name.toLowerCase()).includes(nameSearchVal.toLowerCase());
           });
           refreshData(filterDataValue);
         }
      }
  
  };

  const handleResetFilters = () => {
    setNameSearchVal('');
    setStartDateSearchVal('');
    setEndDateSearchVal('');
    setDateError('');
    refreshData(items);
  }

  useEffect(() => {
    
    const apiUrl = 'http://localhost/campaign/public/api/campaigndata';
    dispatch(fetchData(apiUrl));
  }, [dispatch]);

  useEffect(()=> {
    
    if(items){
      refreshData(items);
    } 
    
  },[items]);

  return (
    <div>
      <div>
        <div className='date-picker-container'>
          <DatePicker selected={startDateSearchVal}  className='inputStartDate date-picker' placeholderText='Start-Date' onChange={(date) => handleDateInput(date, 'startDate')} />
          <DatePicker selected={endDateSearchVal} className='inputEndDate date-picker' placeholderText='End-Date' onChange={(date) =>  handleDateInput(date, 'endDate')} />
          <button className='searchDate' onClick={handleDateFilter}>Search</button>
        </div>
     
        <input type="text" value={nameSearchVal} onChange={(event) => setNameSearchVal(event.target.value)} className='inputName' placeholder='Search by name' />
        <button className='searchName' onClick={handleNameSearch}>Search</button>
        <button className='btnAction' onClick={handleResetFilters}>Reset Filters</button>
        <button className='btnAction' onClick={()=>setIsShowCampaign(!isShowCampaign)}>Add Campaign</button>
      </div>
      <div className={`${!isShowCampaign ? "hideCampaignContainer" : "showCampaignContainer"}`}>
        <AddCampaignComponent />
      </div>
      {loading ? 
        (<div className="loadContainer">Loading...</div>) :
      error || dateError ? 
        (<div className="errorContainer">Error: {error || dateError}</div>) :
        ( <CampaignList campaignData={data} /> )}
    </div>
  );
};

export default CampaignComponent;
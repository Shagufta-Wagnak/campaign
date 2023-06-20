import React from 'react';
import { render } from '@testing-library/react';
import CampaignList from './CampaignList';
import '@testing-library/jest-dom/extend-expect';

jest.mock('../../css/campaign.css', () => ({}));
jest.mock('react-datepicker/dist/react-datepicker.css', () => ({}));


describe('CampaignList', () => {
  test('renders table rows correctly', () => {
    const data = [
        {"id":1,"name":"Divavu", "username":"Leanne Graham","startDate":"9/19/2021","endDate":"3/9/2023","isActive": 'Active',"Budget":'88377'},
        {"id":2,"name":"Jaxspan", "username":"Ervin Howell","startDate":"01/21/2023","endDate":"2/21/2024","isActive": 'Inactive',"Budget":'608715'},
    ];

    const { getByText, queryAllByText, getAllByRole, queryAllByLabelText } = render(<CampaignList campaignData={data} />);

    // Assert the table headers
    expect(getByText('Name')).toBeInTheDocument();
    expect(getByText('User Name')).toBeInTheDocument();
    expect(getByText('Start Date')).toBeInTheDocument();
    expect(getByText('End Date')).toBeInTheDocument();
    const activeElements = queryAllByText(content => content.includes('Active') || content.includes('Inactive'));
    expect(activeElements.length).toBeGreaterThan(0);
    expect(getByText('Budget')).toBeInTheDocument();

    const tableRows = getAllByRole('row');
    expect(tableRows.length).toBe(data.length + 1); // +1 for the header row

    data.forEach(item => {
      expect(getByText(item.name)).toBeInTheDocument();
      expect(getByText(item.username)).toBeInTheDocument();
      expect(getByText(item.startDate)).toBeInTheDocument();
      expect(getByText(item.endDate)).toBeInTheDocument();
      expect(queryAllByText(content => item.isActive ? content.includes('Active') : content.includes('Inactive')).length).toBeGreaterThan(0);
      expect(getByText(`${item.Budget} USD`)).toBeInTheDocument();
    });

    
   
  });
});

export const handleKeyDown = (event) => {
    event.preventDefault();
};


export const formatDate = (date, forDisplay= true) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    return forDisplay ? `${day}/${month}/${year}` : `${month}/${day}/${year}`;
};

export const isDateBetween = (startDate, endDate) => {
    const currentDate = new Date();
    return currentDate >= startDate && currentDate <= endDate;
};

export const hasDecimal = (number) => {
    return number % 1 !== 0;
}


export const formatCurrency = (number) => {
    const abbreviations = {
      K: 1000,
      M: 1000000,
      B: 1000000000,
      T: 1000000000000,
    };
  
    const roundedNum = Math.floor(number);
  
    if (roundedNum < 1000) {
      return `${roundedNum} USD`;
    }
  
    const abbreviationsKeys = Object.keys(abbreviations).reverse();
  
    for (let i = 0; i < abbreviationsKeys.length; i++) {
      const abbreviationKey = abbreviationsKeys[i];
      const abbreviationValue = abbreviations[abbreviationKey];
      if (roundedNum >= abbreviationValue) {
        const numberValue = (roundedNum / abbreviationValue);
        const formattedNumber = numberValue.toFixed(hasDecimal(numberValue) ? 1 : 0);
        return `${formattedNumber}${abbreviationKey} USD`;
      }
    }
  
    return `${roundedNum} USD`;
  }
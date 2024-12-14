interface DateFormatProps {
    date: Date;
  }
  
  const DateFormat: React.FC<DateFormatProps> = ({ date }) => { 
    const dateObject = new Date(date); 
  
    return (
      <div>
        <h3>{`${dateObject.getDate().toString().padStart(2, "0")}/${(
          dateObject.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}/${dateObject.getFullYear()}`}</h3>
        <h3>{`${(dateObject.getHours() % 12 || 12)
          .toString()
          .padStart(2, "0")}:${dateObject
          .getMinutes()
          .toString()
          .padStart(2, "0")}:${dateObject
          .getSeconds()
          .toString()
          .padStart(2, "0")} ${dateObject.getHours() >= 12 ? "PM" : "AM"}`}</h3>
      </div>
    );
  };
  
  export default DateFormat;
  
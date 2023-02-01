import React, { useState } from "react";
import Calendar from "react-calendar";
import { addDays, subDays, differenceInCalendarDays } from "date-fns";
import "react-calendar/dist/Calendar.css";
import "./customized-calendar.css";
import { compareDesc, format, parseISO } from "date-fns";

import ApiService from "../../services/api";
import {
  classForSentiment,
  emojiAndColorForSentiment,
} from "../../utils/sentiments";

const ReactCustomizedCalendar = (props) => {
  const [selectedDate, SetSelectedDate] = useState(new Date());
  let [feedbackList, setFeedbackList] = useState([]);
  const [isFeedbackListLoaded, setIsFeedbackListLoaded] = useState(false);

  React.useEffect(() => {
    let isMounted = true;
    if (!isFeedbackListLoaded) {
      ApiService.get("/feedback")
        .then((res) => {
          if (isMounted) {
            setFeedbackList(
              res.data
                .map((f) => ({ ...f, created_at: parseISO(f.created_at) }))
                .sort((a, b) => compareDesc(a.created_at, b.created_at))
                .map((f) => ({
                  ...f,
                  date: format(f.created_at, "eeee MMM d"),
                }))
            );
            setIsFeedbackListLoaded(true);
          }
        })
        .catch((e) => {
          if (isMounted) {
            alert("Could not load feedback!");
            setIsFeedbackListLoaded(true);
          }
        });
    }
    return () => {
      isMounted = false;
    };
  }, [isFeedbackListLoaded]);

  function isSameDay(a, b) {
    return differenceInCalendarDays(a, b) === 0;
  }

  // const datesToAddContentTo = [
  //   subDays(new Date(), 1),
  //   subDays(new Date(), 2),
  //   subDays(new Date(), 3),
  //   subDays(new Date(), 6),
  //   subDays(new Date(), 7),
  // ];

  function tileContent({ date, view }) {
    Date.prototype.addDays = function (days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };
    var dateObj = new Date();

    // Add class to tiles in month view only
    if (view === "month") {
      const today = feedbackList.find((dDate) =>
        isSameDay(dateObj.addDays(dDate.id), date)
      );
      // Check if a date React-Calendar wants to check is on the list of dates to add class to
      // if (today) {
      //   return today.feedback;
      // }
    }
  }

  // const datesToAddClassTo = datesToAddContentTo;
  function bucketedSentimentValue(value) {
    return Math.min(Math.max(Math.round(value), 1), 5);
  }
  function tileClassName({ date, view }) {
    // Add class to tiles in month view only
    Date.prototype.addDays = function (days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };
    var dateObj = new Date();

    if (view === "month") {
      let classNameValue;
      let today = feedbackList.find((dDate) =>{
        console.log("dDate", dDate);
        isSameDay(new Date(dDate.id), date);
        }
      );
      if (today) {
        const sentimentValue = bucketedSentimentValue(
          parseFloat(today.average_sentiment)
        );
        classNameValue = classForSentiment(sentimentValue);
      }

      // Check if a date React-Calendar wants to check is on the list of dates to add class to
      if (classNameValue) {
        console.log("today", today, classNameValue);
        return `highlight-selected-${classNameValue}`;
      } else {
        return "highlight-unselected";
      }
    }
  }
  if (isFeedbackListLoaded) {
    return (
      <Calendar
        onChange={(date) => {
          Date.prototype.addDays = function (days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
          };
          var dateObj = new Date();
          let today = feedbackList.find((dDate) =>
            isSameDay(dateObj.addDays(dDate.id), date)
          );
          if (today) {
            props.onChangeDay(today);
          }
        }}
        value={selectedDate}
        tileClassName={tileClassName}
        tileContent={tileContent}
      />
    );
  } else {
    return <div>loading</div>;
  }
};

export default ReactCustomizedCalendar;

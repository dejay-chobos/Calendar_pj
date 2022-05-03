import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FullCalendar, { formatDate } from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { createEventId } from './event-utils';
const Calendar = () => {
  let str = formatDate(new Date(), {
    month: 'long',
    year: 'numeric',
    day: 'numeric',
  });

  useEffect(() => {
    const getdata = async () => {
      const response = await axios.get('http://localhost:8081/api/planList');

      console.log('res2', response);
    };
    getdata();
  }, []);

  axios
    .get('http://localhost:8081/api/planList')
    .then((Response) => {
      console.log('res', Response);
    })
    .catch((Error) => {
      console.log('getError', Error);
    });

  const handleDateClick = (selectInfo) => {
    let title = prompt('일정 :');
    // title 값이 있을때, 화면에 calendar.addEvent() json형식으로 일정을 추가
    let calendarApi = selectInfo.view.calendar;
    calendarApi.unselect(); // clear date selection
    // alert('Date: ' + selectInfo.dateStr); // 선택날짜
    if (title) {
      calendarApi.addEvent(
        axios
          .post('http://localhost:8081/api/planSave', {
            id: createEventId(),
            title: title,
            start_time: selectInfo.dateStr,
            end_time: selectInfo.dateStr,
            allDay: selectInfo.allDay,
          })
          .then(function (res) {
            // 그러면
            console.log(res);
          })
          .catch(function (error) {
            //에러
            console.log('postError', error);
          })
      );
    }
    // change the day's background color just for fun
    // info.dayEl.style.backgroundColor = 'red';
  };

  const handleEventClick = (clickInfo) => {
    if (window.confirm(`삭제 '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
    console.log('handleEventClick', clickInfo);
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        locale='ko'
        businessHours={true} // 주말 색깔 블러 처리
        weekends={false} //주말 볼지 말지
        headerToolbar={{
          left: 'prev',
          center: 'title',
          right: 'today dayGridMonth, timeGridWeek, next',
        }}
        initialView='timeGridWeek'
        ///////////////////////////////
        events={axios.get('http://localhost:8081/api/planList')}
        ////////////////////////////////

        dateClick={handleDateClick}
        eventClick={handleEventClick}
        editable={true} // 수정 ?
        selectable={true} //드래그 가능
        selectMirror={true}
        // 이벤트명 : function(){} : 각 날짜에 대한 이벤트를 통해 처리할 내용..
        dayMaxEvents={true}
        weekends={false} //주말
      />
    </div>
  );
};

export default Calendar;

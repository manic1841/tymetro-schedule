import { useEffect, useState } from 'react';
import './Schedule.css';


const STATION_NAMES = {
  'tymetro_a01': '台北車站',
  'tymetro_a08': '長庚醫院',
  'tymetro_a18': '桃園高鐵',
};

function getSchedule(data, filter) {
  const schedule = [];
  data.forEach((item) => {
    // Check direction
    if (item.dir === filter.direction) {
      return;
    }
    // Check holiday
    if (item.holiday !== filter.holiday) {
      return;
    }

    item.timeTable.forEach((time) => {
      if (time.startTime < filter.startTime || time.startTime > filter.endTime) {
        return;
      }
      schedule.push({
        startTime: time.startTime,
        startTimeStr: time.startTimeStr,
        endTime: time.endTime,
        endTimeStr: time.endTimeStr,
        trainType: time.type
      })
    });
  });
  return schedule.sort((a, b) => a.startTime - b.startTime);
}

function Schedule({filter, rawData}) {
  const [schedule, setSchedule] = useState([]);
  useEffect(() => {
    setSchedule(getSchedule(rawData, filter));
  }, [filter, rawData]);

  return (
    <div className="schedule">
      <table>
        <thead>
          <tr>
            <th>{STATION_NAMES[filter.startStation]}</th>
            <th>{STATION_NAMES[filter.endStations[filter.direction]]}</th>
            <th>車種</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((item, index) => (
            <tr key={index}>
              <td>{item.startTimeStr}</td>
              <td>{item.endTimeStr}</td>
              <td>{item.trainType === 'normal' ? '普通' : '直達'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Schedule;

import React, { useEffect, useState } from 'react';
import './ScheduleWrapper.css';
import FilterBtn from './FilterBtn';
import Schedule from './Schedule';


function toTimestamp(dateString) {
  const [hours, minutes] = dateString.split(':').map(Number);
  return hours * 3600 + minutes * 60;
}

function toTimeString(timestamp) {
  const hours = Math.floor(timestamp / 3600);
  const minutes = Math.floor((timestamp % 3600) / 60);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function getSchedule(data, filter) {
  const schedule = [];
  data.forEach((item) => {
    if (item.dir !== filter.direction) {
      return;
    }
    let needToAdd = false;
    item.timeTable.forEach((time) => {
      if (time.stationID === filter.startStation) {
        if (time.depTime > filter.startTime && time.depTime < filter.endTime) {
          needToAdd = true;
        }
      }
    });
    if (needToAdd) {
      let startTimeStr = null,
        startTime = null;
      let endTimeStr = null,
        endTime = null;
      item.timeTable.forEach((time) => {
        if (time.stationID === filter.startStation) {
          startTime = time.depTime;
          startTimeStr = time.depTimeStr;
        } else if (time.stationID === filter.endStations[filter.direction]) {
          endTime = time.arrTime;
          endTimeStr = time.arrTimeStr;
        }
      });
      if (startTimeStr && endTimeStr) {
        schedule.push({
          startTime: startTime,
          startTimeStr: startTimeStr,
          endTime: endTime,
          endTimeStr: endTimeStr,
          trainType: item.type,
        });
      }
    }
  });
  return schedule.sort((a, b) => a.startTime - b.startTime);
}

function ScheduleWrapper() {
  const [filter, setFilter] = useState({
    startStation: 'tymetro_a08',
    endStations: ['tymetro_a01', 'tymetro_a18'],
    startTime: toTimestamp('09:00'),
    endTime: toTimestamp('10:00'),
    direction: 0,
  });
  const [schedule, setSchedule] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('tymc.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch schedule data');
        }
        return response.json();
      })
      .then((data) => {
        setSchedule(getSchedule(data, filter));
        setError(null);
      })
      .catch((error) => {
        console.error('Error fetching schedule:', error);
        setError('Failed to load schedule. Please try again later.');
      });
  }, [filter]);

  return (
    <div className="schedule-wrapper">
      <h1>機場捷運時刻表</h1>
      <FilterBtn filter={filter} setFilter={setFilter} />
      {error ? (
        <p className="error">{error}</p>
      ) : (
        <Schedule filter={filter} schedule={schedule} />
      )}
    </div>
  );
}

export default ScheduleWrapper;

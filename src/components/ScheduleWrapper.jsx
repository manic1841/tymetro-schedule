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

function fetchData(setRawData, setError) {
  fetch('tymc-schedule.json')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Failed to fetch schedule data');
    }
    return response.json();
  })
  .then((data) => {
    setRawData(data);
    setError(null);
  })
  .catch((error) => {
    console.error('Error fetching schedule:', error);
    setError('Failed to load schedule. Please try again later.');
  });
}

function ScheduleWrapper() {
  const [filter, setFilter] = useState({
    startStation: 'tymetro_a08',
    endStations: ['tymetro_a01', 'tymetro_a18'],
    startTime: toTimestamp('09:00'),
    endTime: toTimestamp('10:00'),
    direction: 1,
    holiday: true,
  });
  const [rawData, setRawData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData(setRawData, setError);
  }, []);

  return (
    <div className="schedule-wrapper">
      <h1>機場捷運時刻表</h1>
      <FilterBtn filter={filter} setFilter={setFilter} />
      {error ? (
        <p className="error">{error}</p>
      ) : (
        <Schedule filter={filter} rawData={rawData} />
      )}
    </div>
  );
}

export default ScheduleWrapper;

import './Schedule.css';


const STATION_NAMES = {
  'tymetro_a01': '台北車站',
  'tymetro_a08': '長庚醫院',
  'tymetro_a18': '桃園高鐵',
};

function Schedule({filter, schedule}) {

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
              <td>{item.trainType === 'normal' ? '普' : '快'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Schedule;

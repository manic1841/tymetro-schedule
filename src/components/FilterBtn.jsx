import './FilterBtn.css'

function FilterBtn({ filter, setFilter }) {
    return (
        <div className="filter-btn-container">
            <button className="btn filter-btn" onClick={() => {
                setFilter({ ...filter, direction: filter.direction === 0 ? 1 : 0 });
            }}>
                {filter.direction === 0 ? '往桃園' : '往台北'}
            </button>
            <button className="btn filter-btn" onClick={() => {
                setFilter({
                    ...filter,
                    startTime: filter.startTime - 3600,
                    endTime: filter.endTime - 3600,
                });
            }}>
                上一小時
            </button>
            <button className="btn filter-btn" onClick={() => {
                setFilter({
                    ...filter,
                    startTime: filter.startTime + 3600,
                    endTime: filter.endTime + 3600,
                });
            }}>
                下一小時
            </button>
            <button className="btn filter-btn" onClick={() => {
                setFilter({ ...filter, holiday: !filter.holiday });
            }}>
                {filter.holiday ? '平日' : '假日'}
            </button>
        </div>
    )
}

export default FilterBtn;
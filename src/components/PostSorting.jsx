import PropTypes from 'prop-types';

export function PostSorting({ fields = [], value, onChange, orderValue, onOrderChange }) {
    return (
        <div>
            <label htmlFor="sortBy">Sort By: </label>
            <select id="sortBy" name="sortBy" value={value} onChange={(e) => onChange(e.target.value)}>
                {fields.map((field) => (
                    <option key={field} value={field}>
                        {field}
                    </option>
                ))}
            </select>
            {' / '}
            <label htmlFor="sortOrder">Sort Order: </label>
            <select id="sortOrder" name="sortOrder" value={orderValue} onChange={(e) => onOrderChange(e.target.value)}>
                <option value="ascending">Ascending</option>
                <option value="descending">Descending</option>
            </select>
        </div>
    )
}

PostSorting.propTypes = {
    fields: PropTypes.arrayOf(PropTypes.string).isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    orderValue: PropTypes.string.isRequired,
    onOrderChange: PropTypes.func.isRequired,
}
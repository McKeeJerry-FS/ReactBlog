import PropTypes from 'prop-types'

export function PostSorting({
  fields = [],
  value,
  onChange,
  orderValue,
  onOrderChange,
}) {
  return (
    <div className='row g-3 align-items-end mb-3'>
      <div className='col-sm-6'>
        <label htmlFor='sortBy' className='form-label fw-semibold'>
          Sort By
        </label>
        <select
          id='sortBy'
          name='sortBy'
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className='form-select'
        >
          {fields.map((field) => (
            <option key={field} value={field}>
              {field}
            </option>
          ))}
        </select>
      </div>
      <div className='col-sm-6'>
        <label htmlFor='sortOrder' className='form-label fw-semibold'>
          Sort Order
        </label>
        <select
          id='sortOrder'
          name='sortOrder'
          value={orderValue}
          onChange={(e) => onOrderChange(e.target.value)}
          className='form-select'
        >
          <option value='ascending'>Ascending</option>
          <option value='descending'>Descending</option>
        </select>
      </div>
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

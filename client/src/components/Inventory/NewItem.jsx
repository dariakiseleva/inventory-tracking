export default function NewItem() {

    return (
        <form className="inputForm">

            <label>Item name</label>
            <input type="text" required 
                placeholder ="Enter item name" 
                onInvalid={e => e.target.setCustomValidity('Please enter the item name')}
            />

            <label>Quantity</label>
            <input type="number" required 
                onInvalid={e => e.target.setCustomValidity('Please enter a quantity')}
                min="0"
                max="100000"
            />

            <label>City</label>
            <select defaultValue="" required onInvalid={e => e.target.setCustomValidity('Please select a city')}>
                <option value="" disabled>Select a city</option>
                <option value="Montreal">Montreal</option>
                <option value="Toronto">Toronto</option>
            </select>

            <button>Create new item</button>

        </form>
    )

}
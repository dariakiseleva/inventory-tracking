export default function NewItem() {

    return (
        <form className="inputForm">

            <label>Item name</label>
            <input type="text" required></input>

            <label>City</label>
            <select required>
                <option></option>
                <option value="Montreal">Montreal</option>
                <option value="Toronto">Toronto</option>
            </select>

            <button>Create new item</button>
        </form>
    )

}
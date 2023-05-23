import React, {useState} from "react";

function SearchForm({filter}){
    const [formData, setFormData] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        filter(formData)
        setFormData('')
    }

    const handleChange = (e) => {
        setFormData(e.target.value)
    }

    return(
        <form onSubmit={handleSubmit}>
            <label htmlFor="filter">Keyword: </label>
            <input type="text" name="filter" id="filter" value={formData} onChange={handleChange}/>
            <button type="submit">Submit</button>
        </form>
    )
}

export default SearchForm